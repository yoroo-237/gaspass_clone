import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Validate order data
const validateOrderData = (data) => {
  const errors = [];
  
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Items required (array, non-empty)');
  } else {
    data.items.forEach((item, idx) => {
      if (!item.name) errors.push(`Item ${idx}: name required`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Item ${idx}: quantity must be > 0`);
      if (!item.pricePerUnit || item.pricePerUnit <= 0) errors.push(`Item ${idx}: pricePerUnit must be > 0`);
    });
  }
  
  if (!data.total || data.total <= 0) {
    errors.push('Total required and must be > 0');
  }
  
  if (!data.shippingAddress) {
    errors.push('Shipping address required');
  } else {
    const addr = data.shippingAddress;
    if (!addr.name) errors.push('Address: name required');
    if (!addr.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email)) errors.push('Address: valid email required');
    if (!addr.address) errors.push('Address: address required');
    if (!addr.city) errors.push('Address: city required');
    if (!addr.zipcode) errors.push('Address: zipcode required');
  }
  
  return errors;
};

// POST /api/orders - Create order (anonymous or authenticated)
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    
    // Verify token if provided
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token invalid, continue as anonymous
      }
    }

    const { items, total, shippingAddress, notes } = req.body;
    
    // Validation
    const errors = validateOrderData({ items, total, shippingAddress });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const order = await Order.create({
      userId,
      orderNumber,
      items,
      total: parseFloat(total),
      shippingAddress,
      notes: notes || null,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Order creation error' });
  }
});

// GET /api/orders/:id - Get order (accessible to anonymous too)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// PUT /api/orders/:id/status - Update order status (user can update their own)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });
    
    if (!['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await Order.update({ status }, { where: { id: req.params.id } });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

export default router;
