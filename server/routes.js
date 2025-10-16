import { Router } from 'express';
import * as SDK from '../dist/index.js';

const router = Router();

// Authenticate: expects { username, password }
router.post('/api/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'username and password are required' });
    }

    const result = await SDK.authenticate(username, password);
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// createTransaction: expects at least { token, ...paymentRequestPayload }
// The route will use token to instantiate the SDK client and the remaining
// body fields will be forwarded as the CreatePaymentRequest payload.
router.post('/api/createTransaction', async (req, res) => {
  try {
    const body = req.body || {};
    const { token } = body;

    if (!token) {
      return res.status(400).json({ ok: false, error: 'token is required in body' });
    }

    const { token: _t, ...payload } = body;

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.createTransaction(payload);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// getTransaction: expects { token, paymentRequestId }
router.post('/api/getTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token || !paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'token and paymentRequestId are required' });
    }

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.getTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// refundTransaction: expects { token, paymentRequestId, amount? } or { token, paymentRequestId, body: { amount } }
router.post('/api/refundTransaction', async (req, res) => {
  try {
    const body = req.body || {};
    const { token, paymentRequestId } = body;
    if (!token || !paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'token and paymentRequestId are required' });
    }

    // Support payload as either { amount } or nested { body: { amount } }
    const refundBody = body.body ?? (('amount' in body) ? { amount: body.amount } : {});

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.refundTransaction(paymentRequestId, refundBody);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// cancelTransaction: expects { token, paymentRequestId }
// Implemented as a full refund (no amount) according to the SDK behavior.
router.post('/api/cancelTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};
    if (!token || !paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'token and paymentRequestId are required' });
    }

    const client = new SDK.ClientSDK(token);
    const result = await client.PaymentRequest.cancelTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
