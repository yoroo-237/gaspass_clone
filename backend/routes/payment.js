import express from 'express';
import Order from '../models/Order.js';
import { createPaymentIntent, verifyWebhook } from '../services/paymentService.js';

const router = express.Router();

// POST /api/payment/create-intent - Permet les paiements anonymes
router.post('/create-intent', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'OrderId et amount requis (amount > 0)' });
    }

    // Vérifier que la commande existe
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const intent = await createPaymentIntent(amount, orderId);
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('Erreur création payment intent:', err);
    res.status(500).json({ error: err.message || 'Erreur création payment intent' });
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
    console.error('Erreur webhook:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
