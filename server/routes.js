import { Router } from 'express';
import * as SDK from '../dist/index.js';

const router = Router();

// POST /api/authenticate
// Body: { username: string, password: string }
router.post('/api/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'username and password are required' });
    }

    const result = await SDK.authenticate(username, password);
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/createTransaction
// Body: { token: string, payment: { ... } }
router.post('/api/createTransaction', async (req, res) => {
  try {
    const { token, payment } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!payment) return res.status(400).json({ ok: false, error: 'payment body is required' });

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.createTransaction(payment);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/getTransaction
// Body: { token: string, paymentRequestId: string }
router.post('/api/getTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.getTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/refundTransaction
// Body: { token: string, paymentRequestId: string, refund?: { amount?: number } }
router.post('/api/refundTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId, refund } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.refundTransaction(paymentRequestId, refund);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/cancelTransaction
// Body: { token: string, paymentRequestId: string }
router.post('/api/cancelTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.cancelTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

export default router;
