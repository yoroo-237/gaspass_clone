import express from 'express';
import Order from '../models/Order.js';
import { createPaymentIntent, verifyWebhook } from '../services/paymentService.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/payment/create-intent
router.post('/create-intent', verifyToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const intent = await createPaymentIntent(amount, orderId);
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = verifyWebhook(req);
    
    if (event.type === 'payment_intent.succeeded') {
      const { metadata } = event.data.object;
      await Order.update(
        { paymentStatus: 'completed', status: 'processing' },
        { where: { id: metadata.orderId } }
      );
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
