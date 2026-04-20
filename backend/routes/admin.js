import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';
import { verifyAdmin } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/adminLogger.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { notifyClient, notifyAdmin } from '../services/telegramService.js';
import {
  msgStatutClient,
  msgRemboursementAdmin,
  msgAnnulationAdmin
} from '../utils/telegramMessages.js';
import { Parser } from 'json2csv';

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
    const { period = '30d' } = req.query;

    // Calculer la date de début selon la période
    const periodMap = {
      '7d':  7,
      '30d': 30,
      '90d': 90,
      '1y':  365
    };
    const days = periodMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // ── Stats globales ──────────────────────────────────────────────
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      todayOrders,
      pendingOrders,
      // Période actuelle
      periodOrders,
      periodRevenue,
      // Période précédente (pour comparaison)
      prevPeriodOrders,
      prevPeriodRevenue
    ] = await Promise.all([
      Order.count(),
      Order.sum('total', { where: { paymentStatus: 'completed' } }),
      User.count(),
      Order.count({
        where: { createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      }),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { createdAt: { [Op.gte]: startDate } } }),
      Order.sum('total', {
        where: { paymentStatus: 'completed', createdAt: { [Op.gte]: startDate } }
      }),
      Order.count({
        where: { createdAt: { [Op.gte]: prevStartDate, [Op.lt]: startDate } }
      }),
      Order.sum('total', {
        where: {
          paymentStatus: 'completed',
          createdAt: { [Op.gte]: prevStartDate, [Op.lt]: startDate }
        }
      })
    ]);

    // ── Revenus par jour sur la période ────────────────────────────
    const revenueByDay = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: startDate }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // ── Top produits vendus ─────────────────────────────────────────
    // On agrège depuis le JSONB items des commandes complétées
    const completedOrders = await Order.findAll({
      attributes: ['items'],
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: startDate }
      },
      raw: true
    });

    const productSales = {};
    completedOrders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.productId || item.name;
        if (!productSales[key]) {
          productSales[key] = {
            productId: item.productId,
            name: item.name,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        productSales[key].totalQuantity += item.quantity;
        productSales[key].totalRevenue += item.pricePerUnit * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
      .map(p => ({
        ...p,
        totalRevenue: parseFloat(p.totalRevenue.toFixed(2))
      }));

    // ── Répartition des statuts ─────────────────────────────────────
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // ── Nouveaux users par jour ─────────────────────────────────────
    const newUsersByDay = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { createdAt: { [Op.gte]: startDate } },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // ── Panier moyen ────────────────────────────────────────────────
    const avgOrder = totalRevenue && totalOrders
      ? (totalRevenue / totalOrders).toFixed(2)
      : '0.00';

    // ── Variation période vs période précédente ─────────────────────
    const revenueGrowth = prevPeriodRevenue
      ? (((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100).toFixed(1)
      : null;
    const ordersGrowth = prevPeriodOrders
      ? (((periodOrders - prevPeriodOrders) / prevPeriodOrders) * 100).toFixed(1)
      : null;

    // ── Commandes récentes ──────────────────────────────────────────
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      period,
      stats: {
        totalOrders,
        totalRevenue:   parseFloat(totalRevenue || 0).toFixed(2),
        totalUsers,
        todayOrders,
        pendingOrders,
        avgOrderValue:  avgOrder,
        periodOrders,
        periodRevenue:  parseFloat(periodRevenue || 0).toFixed(2),
        revenueGrowth:  revenueGrowth ? `${revenueGrowth}%` : 'N/A',
        ordersGrowth:   ordersGrowth  ? `${ordersGrowth}%`  : 'N/A'
      },
      charts: {
        revenueByDay,
        newUsersByDay,
        ordersByStatus,
        topProducts
      },
      recentOrders
    });

  } catch (err) {
    logger.error('Dashboard error', { error: err.message });
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
        // Recherche dans le JSONB via cast PostgreSQL
        sequelize.where(
          sequelize.cast(sequelize.col('shipping_address'), 'text'),
          { [Op.iLike]: `%${search}%` }
        )
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
    logger.error('Orders error', { error: err.message, stack: err.stack });
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
router.put('/orders/:id', verifyAdmin, logAdminAction('UPDATE_ORDER', 'Order'), async (req, res) => {
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

    // Récupérer la commande mise à jour pour les notifications
    const updatedOrder = await Order.findByPk(req.params.id);

    // Notifier le client si son statut a changé et qu'il est lié Telegram
    if (updatedOrder?.userId) {
      notifyClient(updatedOrder.userId, msgStatutClient(updatedOrder)).catch(() => {});
    }

    // Notifier l'admin si annulation
    if (updateData.status === 'cancelled') {
      notifyAdmin(msgAnnulationAdmin(updatedOrder)).catch(() => {});
    }

    res.json({ message: 'Order updated', data: updateData });
  } catch (err) {
    logger.error('Order update error', { error: err.message, stack: err.stack });
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
    logger.error('Products error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// POST /api/admin/products - Create product with validation
router.post('/products', verifyAdmin, logAdminAction('CREATE_PRODUCT', 'Product'), async (req, res) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ errors });
    
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    logger.error('Product creation error', { error: err.message, stack: err.stack });
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Product creation error' });
  }
});

// PUT /api/admin/products/:id - Update product with validation
router.put('/products/:id', verifyAdmin, logAdminAction('UPDATE_PRODUCT', 'Product'), async (req, res) => {
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
    logger.error('Product update error', { error: err.message, stack: err.stack });
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Update error' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', verifyAdmin, logAdminAction('DELETE_PRODUCT', 'Product'), async (req, res) => {
  try {
    const result = await Product.destroy({ where: { id: req.params.id } });
    if (result === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    logger.error('Product delete error', { error: err.message, stack: err.stack });
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
    logger.error('Users error', { error: err.message, stack: err.stack });
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
router.put('/users/:id', verifyAdmin, logAdminAction('UPDATE_USER', 'User'), async (req, res) => {
  try {
    const { role, verified } = req.body;
    const updateData = {};

    // Récupérer le rôle de l'admin qui fait la requête
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requesterRole = decoded.role;

    if (role) {
      const allowedRoles = ['customer', 'admin'];
      // Seul un superadmin peut promouvoir en superadmin
      if (requesterRole === 'superadmin') allowedRoles.push('superadmin');

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: `Vous ne pouvez pas attribuer le rôle "${role}"` });
      }
      updateData.role = role;
    }

    if (verified !== undefined) updateData.verified = verified;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    await User.update(updateData, { where: { id: req.params.id } });
    res.json({ message: 'User updated', data: updateData });
  } catch (err) {
    logger.error('User update error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Update error' });
  }
});

// POST /api/admin/products/:id/images — Ajouter une image
router.post('/products/:id/images', verifyAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL image requise' });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    const images = product.images || [];

    if (images.includes(url)) {
      return res.status(400).json({ error: 'Image déjà présente' });
    }
    if (images.length >= 10) {
      return res.status(400).json({ error: 'Maximum 10 images par produit' });
    }

    const newImages = [...images, url];
    await product.update({ images: newImages });

    res.json({ message: 'Image ajoutée', images: newImages });
  } catch (err) {
    logger.error('Erreur ajout image', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/products/:id/images — Supprimer une image
router.delete('/products/:id/images', verifyAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL image requise' });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    const images = product.images || [];
    if (!images.includes(url)) {
      return res.status(404).json({ error: 'Image introuvable sur ce produit' });
    }

    const newImages = images.filter(img => img !== url);
    await product.update({ images: newImages });

    res.json({ message: 'Image supprimée', images: newImages });
  } catch (err) {
    logger.error('Erreur suppression image', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/products/:id/images/reorder — Réordonner les images
router.put('/products/:id/images/reorder', verifyAdmin, async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'images doit être un tableau' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    const currentImages = product.images || [];

    // Vérifier que le tableau contient exactement les mêmes URLs
    const same = images.length === currentImages.length &&
      images.every(url => currentImages.includes(url));

    if (!same) {
      return res.status(400).json({ error: 'Les URLs ne correspondent pas aux images existantes' });
    }

    await product.update({ images });
    res.json({ message: 'Ordre mis à jour', images });
  } catch (err) {
    logger.error('Erreur réordonnancement images', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// EXPORTS & ANALYTICS
// ────────────────────────────────────────────────────────────────────────────

// GET /api/admin/export/orders — Export CSV commandes
router.get('/export/orders', verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate, status, paymentStatus } = req.query;
    const where = {};

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate)   where.createdAt[Op.lte] = new Date(endDate);
    }

    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
      raw: true
    });

    // Aplatir les données pour le CSV
    const rows = orders.map(o => ({
      orderNumber:    o.orderNumber,
      date:           new Date(o.createdAt).toLocaleDateString('fr-FR'),
      status:         o.status,
      paymentStatus:  o.paymentStatus,
      paymentMethod:  o.paymentMethod || '',
      total:          parseFloat(o.total).toFixed(2),
      tax:            parseFloat(o.tax || 0).toFixed(2),
      shippingCost:   parseFloat(o.shippingCost || 0).toFixed(2),
      itemsCount:     (o.items || []).length,
      customerName:   o.shippingAddress?.name || '',
      customerEmail:  o.shippingAddress?.email || '',
      city:           o.shippingAddress?.city || '',
      zipcode:        o.shippingAddress?.zipcode || '',
      notes:          o.notes || ''
    }));

    const fields = [
      'orderNumber', 'date', 'status', 'paymentStatus', 'paymentMethod',
      'total', 'tax', 'shippingCost', 'itemsCount',
      'customerName', 'customerEmail', 'city', 'zipcode', 'notes'
    ];

    const parser = new Parser({ fields, delimiter: ';' });
    const csv = parser.parse(rows);

    const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM UTF-8 pour Excel

  } catch (err) {
    logger.error('Export orders CSV error', { error: err.message });
    res.status(500).json({ error: 'Erreur export' });
  }
});

// GET /api/admin/export/products — Export CSV produits + stock
router.get('/export/products', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.findAll({ raw: true });

    const rows = products.flatMap(p => {
      const stock   = p.stock   || {};
      const pricing = p.pricing || {};
      const formats = Object.keys(pricing);

      if (formats.length === 0) {
        return [{
          name: p.name, slug: p.slug, grade: p.grade,
          tier: p.tier, type: p.type, thc: p.thc, cbd: p.cbd,
          active: p.active, format: '', price: '', stock: ''
        }];
      }

      return formats.map(fmt => ({
        name:   p.name,
        slug:   p.slug,
        grade:  p.grade,
        tier:   p.tier,
        type:   p.type,
        thc:    p.thc,
        cbd:    p.cbd,
        active: p.active,
        format: fmt,
        price:  pricing[fmt] ?? '',
        stock:  stock[fmt]   ?? 0
      }));
    });

    const fields = [
      'name', 'slug', 'grade', 'tier', 'type',
      'thc', 'cbd', 'active', 'format', 'price', 'stock'
    ];

    const parser  = new Parser({ fields, delimiter: ';' });
    const csv     = parser.parse(rows);
    const filename = `products_${new Date().toISOString().split('T')[0]}.csv`;

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);

  } catch (err) {
    logger.error('Export products CSV error', { error: err.message });
    res.status(500).json({ error: 'Erreur export' });
  }
});

// GET /api/admin/logs — Historique activité admin
router.get('/logs', verifyAdmin, async (req, res) => {
  try {
    const { page = 0, limit = 50, adminId, action, entity } = req.query;
    const where = {};

    if (adminId) where.adminId = adminId;
    if (action)  where.action  = action;
    if (entity)  where.entity  = entity;

    const logs = await AdminLog.findAll({
      where,
      limit: Math.min(parseInt(limit), 200),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const count = await AdminLog.count({ where });

    res.json({ logs, count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    logger.error('Logs fetch error', { error: err.message });
    res.status(500).json({ error: 'Erreur récupération logs' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// TAGS MANAGEMENT
// ────────────────────────────────────────────────────────────────────────────

// POST /api/admin/products/:id/tags — Ajouter un tag
router.post('/products/:id/tags', verifyAdmin, async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Tag requis (string)' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    const tags = product.tags || [];
    if (tags.includes(tag.toLowerCase())) {
      return res.status(400).json({ error: 'Tag déjà présent' });
    }

    const newTags = [...tags, tag.toLowerCase().trim()];
    await product.update({ tags: newTags });

    res.json({ message: 'Tag ajouté', tags: newTags });
  } catch (err) {
    logger.error('Erreur ajout tag', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/products/:id/tags — Supprimer un tag
router.delete('/products/:id/tags', verifyAdmin, async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ error: 'Tag requis' });

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    const newTags = (product.tags || []).filter(t => t !== tag.toLowerCase());
    await product.update({ tags: newTags });

    res.json({ message: 'Tag supprimé', tags: newTags });
  } catch (err) {
    logger.error('Erreur suppression tag', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/tags — Liste tous les tags utilisés
router.get('/tags', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['tags'],
      raw: true
    });

    const allTags = [...new Set(
      products.flatMap(p => p.tags || [])
    )].sort();

    res.json({ tags: allTags, count: allTags.length });
  } catch (err) {
    logger.error('Erreur fetch tags', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
