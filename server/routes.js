import { Router } from 'express';
import * as SDK from '../dist/index.js';

const router = Router();

// POST /api/createTransaction
// body: { token: string, payload: CreatePaymentRequest }
router.post('/api/createTransaction', async (req, res) => {
  try {
    const { token, payload } = req.body || {};

    if (!token) {
      return res.status(400).json({ ok: false, error: 'Missing token in request body' });
    }

    if (!payload) {
      return res.status(400).json({ ok: false, error: 'Missing payload in request body' });
    }

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.createTransaction(payload);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/getTransaction
// body: { token: string, paymentRequestId: string }
router.post('/api/getTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};

    if (!token) {
      return res.status(400).json({ ok: false, error: 'Missing token in request body' });
    }

    if (!paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'Missing paymentRequestId in request body' });
    }

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.getTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/refundTransaction
// body: { token: string, paymentRequestId: string, body?: { amount?: number } }
router.post('/api/refundTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId, body: refundBody } = req.body || {};

    if (!token) {
      return res.status(400).json({ ok: false, error: 'Missing token in request body' });
    }

    if (!paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'Missing paymentRequestId in request body' });
    }

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.refundTransaction(paymentRequestId, refundBody);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

// POST /api/cancelTransaction
// body: { token: string, paymentRequestId: string }
router.post('/api/cancelTransaction', async (req, res) => {
  try {
    const { token, paymentRequestId } = req.body || {};

    if (!token) {
      return res.status(400).json({ ok: false, error: 'Missing token in request body' });
    }

    if (!paymentRequestId) {
      return res.status(400).json({ ok: false, error: 'Missing paymentRequestId in request body' });
    }

    const sdk = new SDK.ClientSDK(token);
    const result = await sdk.PaymentRequest.cancelTransaction(paymentRequestId);

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

export default router;
