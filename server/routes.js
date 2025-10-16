import { Router } from 'express';
import * as SDK from '../dist/index.js';

const router = Router();

// POST /api/authenticate
// body: { username: string, password: string }
router.post('/api/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'username and password are required in the request body' });
    }

    const result = await SDK.authenticate(username, password);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/getAppConfig
// body: {} (ignored)
router.post('/api/getAppConfig', async (req, res) => {
  try {
    const result = await SDK.getAppConfig();
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/setAppConfig
// body: Partial<AppConfigType> e.g. { apiUrl, debug, userAgent, env }
router.post('/api/setAppConfig', async (req, res) => {
  try {
    const payload = req.body || {};

    // setAppConfig is synchronous in the SDK but may be exported as a function
    // We call it and then return the updated config
    if (typeof SDK.setAppConfig !== 'function') {
      return res.status(500).json({ ok: false, error: 'setAppConfig is not available in the SDK' });
    }

    await SDK.setAppConfig(payload);

    const updated = await SDK.getAppConfig();

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

export default router;
