import { Router } from 'express';
import * as SDK from '../dist/index.js';

const router = Router();

/**
 * POST /api/authenticate
 * body: { username, password }
 */
router.post('/api/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'username and password are required' });
    }

    const result = await SDK.authenticate(username, password);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

/**
 * POST /api/createTransaction
 * body: { token, payload }
 * - token: Merchant bearer token
 * - payload: CreatePaymentRequest object
 */
router.post('/api/createTransaction', async (req, res) => {
  try {
    const { token, payload } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!payload) return res.status(400).json({ ok: false, error: 'payload is required' });

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.createTransaction(payload);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

/**
 * POST /api/getTransaction
 * body: { token, paymentRequestId }
 */
router.post('/api/getTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.getTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

/**
 * POST /api/refundTransaction
 * body: { token, paymentRequestId, amount? }
 */
router.post('/api/refundTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId, amount } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.refundTransaction(paymentRequestId, amount);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

/**
 * POST /api/cancelTransaction
 * body: { token, paymentRequestId }
 * convenience wrapper: performs full refund
 */
router.post('/api/cancelTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });
    if (!paymentRequestId) return res.status(400).json({ ok: false, error: 'paymentRequestId is required' });

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.cancelTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
