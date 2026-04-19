import express from 'express';
import Order from '../models/Order.js';
import { createPaymentIntent, verifyWebhook, createRefund } from '../services/paymentService.js';
import { verifyAdmin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

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

    // Sauvegarder le paymentIntentId sur la commande
    await order.update({ paymentIntentId: intent.id });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    logger.error('Erreur création payment intent', { error: err.message });
    res.status(500).json({ error: err.message || 'Erreur création payment intent' });
  }
});

// POST /api/payment/webhook
router.post('/webhook', async (req, res) => {
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
    logger.error('Erreur webhook', { error: err.message });
    res.status(400).json({ error: err.message });
  }
});

// POST /api/payment/refund — Admin uniquement
router.post('/refund', verifyAdmin, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId requis' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    if (order.paymentStatus !== 'completed') {
      return res.status(400).json({ error: 'Commande non payée — remboursement impossible' });
    }

    if (!order.paymentIntentId) {
      return res.status(400).json({ error: 'Aucun paymentIntentId trouvé sur cette commande' });
    }

    // Remboursement partiel ou total
    const refund = await createRefund(order.paymentIntentId, amount || null);

    // Mettre à jour le statut de la commande
    const newPaymentStatus = amount && amount < order.total ? 'partially_refunded' : 'refunded';
    await order.update({
      paymentStatus: newPaymentStatus,
      status: 'cancelled'
    });

    logger.info(`Remboursement créé: commande ${order.orderNumber} — ${refund.id}`);
    res.json({
      message: 'Remboursement effectué',
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
    });
  } catch (err) {
    logger.error('Erreur remboursement', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

export default router;
