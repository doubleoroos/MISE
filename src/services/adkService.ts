/**
 * Google ADK Client for MISE Production Memory
 * Connects to Google Cloud Run ADK Agent:
 * https://mise-agent-191734425128.europe-west4.run.app
 */

const STORAGE_KEYS = {
  USER_ID: 'mise_user_id',
  SESSION_ID: 'mise_session_id',
};

// Generates or retrieves stable browser user ID
export function getOrCreateUserId(): string {
  try {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      const rand = Math.random().toString(36).substring(2, 10);
      userId = `filmmaker-${rand}`;
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  } catch {
    return 'filmmaker-demo';
  }
}

// Generates or retrieves active session ID
export function getOrCreateSessionId(): string {
  try {
    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
      const rand = Math.random().toString(36).substring(2, 10);
      sessionId = `sess-prod-${rand}`;
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
  } catch {
    return 'sess-prod-default';
  }
}

// Start a fresh session
export function resetSession(): { userId: string; sessionId: string } {
  const userId = getOrCreateUserId();
  const rand = Math.random().toString(36).substring(2, 10);
  const sessionId = `sess-prod-${rand}`;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  } catch {
    // ignore
  }
  return { userId, sessionId };
}

let sessionInitialized = false;
let sessionInitPromise: Promise<boolean> | null = null;

/**
 * Initializes the ADK session if not already initialized
 */
export async function ensureSession(userId: string, sessionId: string): Promise<boolean> {
  if (sessionInitialized) return true;

  if (sessionInitPromise) {
    return sessionInitPromise;
  }

  sessionInitPromise = (async () => {
    try {
      const url = `/api/mise/apps/app/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok && response.status !== 409) {
        console.warn(`ADK session init returned status ${response.status}`);
      }

      sessionInitialized = true;
      return true;
    } catch (err) {
      console.error('Failed to initialize ADK session:', err);
      // Even if session creation throws (e.g. session already exists), we allow proceeding to /run
      sessionInitialized = true;
      return true;
    } finally {
      sessionInitPromise = null;
    }
  })();

  return sessionInitPromise;
}

export interface ADKPart {
  text?: string;
  thoughtSignature?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
  functionResponse?: {
    name: string;
    response: Record<string, unknown>;
  };
}

export interface ADKEvent {
  modelVersion?: string;
  content?: {
    parts?: ADKPart[];
    role?: string;
  };
  invocationId?: string;
  author?: string;
  actions?: Record<string, unknown>;
}

/**
 * Sends a message to the MISE ADK backend and extracts the final natural language answer.
 */
export async function sendQuestionToMise(
  userPrompt: string,
  activeSceneNumber?: number,
): Promise<string> {
  const userId = getOrCreateUserId();
  const sessionId = getOrCreateSessionId();

  // Ensure session exists
  await ensureSession(userId, sessionId);

  // If the query doesn't explicitly mention any scene number, prepend the active scene context
  // so the ADK tools (get_approved_assets, get_scene_decisions, get_scene_continuity) know which scene
  let formattedQuery = userPrompt.trim();
  const hasSceneMention = /(?:scene|sc\.?)\s*\d+/i.test(formattedQuery);
  if (!hasSceneMention && activeSceneNumber) {
    formattedQuery = `[Scene ${activeSceneNumber}] ${formattedQuery}`;
  }

  const payload = {
    appName: 'app',
    userId,
    sessionId,
    newMessage: {
      role: 'user',
      parts: [
        {
          text: formattedQuery,
        },
      ],
    },
    streaming: false,
  };

  const response = await fetch('/api/mise/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const events: ADKEvent[] = await response.json();

  if (!Array.isArray(events) || events.length === 0) {
    throw new Error('Invalid ADK response: empty events array');
  }

  // Extract final assistant response from the last event that contains content.parts[].text
  let finalAnswer = '';

  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    const parts = event?.content?.parts;
    if (parts && Array.isArray(parts)) {
      // Find text part that is not an internal tool call
      const textParts = parts
        .filter((part) => typeof part.text === 'string' && part.text.trim().length > 0 && !part.functionCall)
        .map((p) => p.text as string);

      if (textParts.length > 0) {
        finalAnswer = textParts.join('\n\n').trim();
        break;
      }
    }
  }

  if (!finalAnswer) {
    throw new Error('No assistant text response found in ADK events');
  }

  return finalAnswer;
}
