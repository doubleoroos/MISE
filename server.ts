import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const ADK_BASE_URL = 'https://mise-agent-191734425128.europe-west4.run.app';

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MISE Production Memory API',
    adkEndpoint: ADK_BASE_URL,
    timestamp: new Date().toISOString(),
  });
});

// Proxy session creation to Google ADK backend
app.post('/api/mise/apps/app/users/:userId/sessions/:sessionId', async (req, res) => {
  const { userId, sessionId } = req.params;
  const targetUrl = `${ADK_BASE_URL}/apps/app/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await upstreamRes.json();
    res.status(upstreamRes.status).json(data);
  } catch (error) {
    console.error('Error proxying session creation to ADK:', error);
    res.status(502).json({
      error: 'Failed to communicate with ADK session endpoint',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Proxy run query to Google ADK backend
app.post('/api/mise/run', async (req, res) => {
  const targetUrl = `${ADK_BASE_URL}/run`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstreamRes.json();
    res.status(upstreamRes.status).json(data);
  } catch (error) {
    console.error('Error proxying query to ADK /run:', error);
    res.status(502).json({
      error: 'Failed to communicate with ADK /run endpoint',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MISE Production Memory running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
