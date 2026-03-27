import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/auth.js';
import sequelize from '../config/db.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total', { where: { paymentStatus: 'completed' } });
    const totalUsers = await User.count();
    
    const recentOrders = await Order.findAll({ 
      limit: 5, 
      order: [['createdAt', 'DESC']] 
    });
    
    res.json({
      stats: { totalOrders, totalRevenue, totalUsers },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur dashboard' });
  }
});

// GET /api/admin/orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { status, page = 0, limit = 20 } = req.query;
    const where = status ? { status } : {};
    
    const orders = await Order.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// GET /api/admin/products
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// POST /api/admin/products
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création produit' });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Produit mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// GET /api/admin/users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

export default router;
