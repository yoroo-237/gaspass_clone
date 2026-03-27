import express from 'express';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, notes } = req.body;
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = await Order.create({
      userId: req.userId,
      orderNumber,
      items,
      total,
      shippingAddress,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création commande' });
  }
});

// GET /api/orders/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.update({ status }, { where: { id: req.params.id } });
    res.json({ message: 'Status mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

export default router;
