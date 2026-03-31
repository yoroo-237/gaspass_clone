import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/auth.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

const router = express.Router();

// Validation helper
const validateProduct = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== 'string') errors.push('Name required (string)');
  if (!data.slug || typeof data.slug !== 'string') errors.push('Slug required (string)');
  if (data.thc && !/^\d+(\.\d+)?$/.test(data.thc)) errors.push('THC must be numeric');
  if (data.cbd && !/^\d+(\.\d+)?$/.test(data.cbd)) errors.push('CBD must be numeric');
  return errors;
};

const validateOrder = (data) => {
  const errors = [];
  if (!data.status || !['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(data.status)) 
    errors.push('Invalid status');
  if (!data.paymentStatus || !['pending', 'processing', 'completed', 'failed'].includes(data.paymentStatus)) 
    errors.push('Invalid payment status');
  return errors;
};

// GET /api/admin/dashboard
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total', { where: { paymentStatus: 'completed' } }) || 0;
    const totalUsers = await User.count();
    const todayOrders = await Order.count({ 
      where: { createdAt: { [Op.gte]: new Date(Date.now() - 24*60*60*1000) } } 
    });
    
    const recentOrders = await Order.findAll({ 
      limit: 5, 
      order: [['createdAt', 'DESC']] 
    });
    
    res.json({
      stats: { 
        totalOrders, 
        totalRevenue: parseFloat(totalRevenue).toFixed(2) || '0.00', 
        totalUsers,
        todayOrders
      },
      recentOrders
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Dashboard error' });
  }
});

// GET /api/admin/orders - With pagination and filtering
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { status, paymentStatus, page = 0, limit = 20, search } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where[Op.or] = [
        { orderNumber: { [Op.iLike]: `%${search}%` } },
        sequelize.where(sequelize.col('Order.shippingAddress'), Op.like, `%${search}%`)
      ];
    }
    
    const orders = await Order.findAll({
      where,
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await Order.count({ where });
    
    res.json({
      orders,
      count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ error: 'Erreur récupération commandes' });
  }
});

// GET /api/admin/orders/:id
router.get('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// PUT /api/admin/orders/:id - Update order status/payment
router.put('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    
    if (status) {
      const errors = validateOrder({ status });
      if (errors.length) return res.status(400).json({ errors });
      updateData.status = status;
    }
    
    if (paymentStatus) {
      const errors = validateOrder({ paymentStatus });
      if (errors.length) return res.status(400).json({ errors });
      updateData.paymentStatus = paymentStatus;
    }
    
    await Order.update(updateData, { where: { id: req.params.id } });
    res.json({ message: 'Order updated', data: updateData });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: 'Update error' });
  }
});

// GET /api/admin/products - With pagination
router.get('/products', verifyAdmin, async (req, res) => {
  try {
    const { page = 0, limit = 20, active, search } = req.query;
    const where = {};
    
    if (active !== undefined) where.active = active === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const products = await Product.findAll({
      where,
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await Product.count({ where });
    
    res.json({
      products,
      count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// POST /api/admin/products - Create product with validation
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ errors });
    
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Product creation error' });
  }
});

// PUT /api/admin/products/:id - Update product with validation
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const errors = validateProduct({ name: req.body.name || 'temp', slug: req.body.slug || 'temp', ...req.body });
    if (errors.length) {
      const filteredErrors = errors.filter(e => 
        (req.body.name && e.includes('Name')) || 
        (req.body.slug && e.includes('Slug')) ||
        (req.body.thc && e.includes('THC')) ||
        (req.body.cbd && e.includes('CBD'))
      );
      if (filteredErrors.length) return res.status(400).json({ errors: filteredErrors });
    }
    
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Product update error:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Update error' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await Product.destroy({ where: { id: req.params.id } });
    if (result === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ error: 'Delete error' });
  }
});

// GET /api/admin/users - With pagination
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { page = 0, limit = 20, role, verified, search } = req.query;
    const where = {};
    
    if (role) where.role = role;
    if (verified !== undefined) where.verified = verified === 'true';
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const users = await User.findAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await User.count({ where });
    
    res.json({
      users,
      count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// GET /api/admin/users/:id - User detail
router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const orders = await Order.findAll({
      where: { userId: req.params.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.json({ user, orders });
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
});

// PUT /api/admin/users/:id - Update user (promote to admin, etc)
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { role, verified } = req.body;
    const updateData = {};
    
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;
    if (verified !== undefined) updateData.verified = verified;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    await User.update(updateData, { where: { id: req.params.id } });
    res.json({ message: 'User updated', data: updateData });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ error: 'Update error' });
  }
});

export default router;
