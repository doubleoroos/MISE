export interface Scene {
  id: string;
  number: number;
  title: string;
  location: string;
  status: 'Production' | 'Pre-Production' | 'Post-Production' | 'Approved';
  sceneIdCode: string;
  summary: string;
  timeOfDay: 'Day' | 'Night' | 'Dusk' | 'Dawn';
  intExt: 'INT' | 'EXT';
}

export interface ApprovedAsset {
  id: string;
  name: string;
  version: string;
  type: 'Video' | 'Audio' | 'VFX Plate' | 'Color LUT' | 'Document';
  status: 'Approved' | 'In Review' | 'Pending';
  uri?: string;
  sceneNumber: number;
  format?: string;
  updatedAt?: string;
}

export interface ProductionDecision {
  id: string;
  category: 'Camera' | 'Lighting' | 'Direction' | 'Editorial' | 'Sound' | 'VFX';
  decision: string;
  reason: string;
  decidedBy: string;
  decidedAt: string;
  sceneNumber: number;
}

export interface ContinuityNote {
  id: string;
  category: 'Wardrobe' | 'Story' | 'Props' | 'Hair/Makeup' | 'Set Dec';
  note: string;
  source: string;
  sceneNumber: number;
  priority?: 'Critical' | 'Standard';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'thinking' | 'done' | 'error';
  isError?: boolean;
  sceneContext?: number;
}
