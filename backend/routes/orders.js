import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { notifyClient, notifyAdmin } from '../services/telegramService.js';
import {
  msgCommandeClient,
  msgNouvelleCommandeAdmin,
  msgStatutClient,
  msgAnnulationAdmin
} from '../utils/telegramMessages.js';

const router = express.Router();

// Validation enrichie — productId et weight obligatoires
const validateOrderData = (data) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Items required (array, non-empty)');
  } else {
    data.items.forEach((item, idx) => {
      if (!item.productId) errors.push(`Item ${idx}: productId requis`);
      if (!item.name) errors.push(`Item ${idx}: name requis`);
      if (!item.weight) errors.push(`Item ${idx}: weight requis (ex: 3.5g, 7g)`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Item ${idx}: quantity doit être > 0`);
      if (!item.pricePerUnit || item.pricePerUnit <= 0) errors.push(`Item ${idx}: pricePerUnit doit être > 0`);
    });
  }

  if (!data.total || data.total <= 0) {
    errors.push('Total requis et doit être > 0');
  }

  // if (!data.shippingAddress) {
  //   errors.push('Adresse de livraison requise');
  // } else {
  //   const addr = data.shippingAddress;
  //   // if (!addr.name) errors.push('Adresse: name requis');
  //   // if (!addr.address) errors.push('Adresse: address requis');
  //   // if (!addr.city) errors.push('Adresse: city requis');
  //   // ✅ zipcode optionnel — pas tout le monde a de code postal
  // }

  return errors;
};

// Vérification et décrément stock — gère le format JSONB { '3.5g': 100, '7g': 80 }
const checkAndDecrementStock = async (items, transaction) => {
  for (const item of items) {
    const product = await Product.findByPk(item.productId, { transaction, lock: true });

    if (!product) {
      throw new Error(`Produit introuvable: ${item.name} (id: ${item.productId})`);
    }

    if (!product.active) {
      throw new Error(`Produit non disponible: ${product.name}`);
    }

    const stock = product.stock || {};
    const currentStock = stock[item.weight];

    if (currentStock === undefined) {
      throw new Error(`Format "${item.weight}" non disponible pour ${product.name}`);
    }

    if (currentStock < item.quantity) {
      throw new Error(
        `Stock insuffisant pour ${product.name} (${item.weight}): ` +
        `demandé ${item.quantity}, disponible ${currentStock}`
      );
    }

    // Vérifier que le prix correspond bien au pricing du produit
    const expectedPrice = product.pricing?.[item.weight];
    if (expectedPrice && Math.abs(expectedPrice - item.pricePerUnit) > 0.01) {
      throw new Error(
        `Prix invalide pour ${product.name} (${item.weight}): ` +
        `attendu ${expectedPrice}, reçu ${item.pricePerUnit}`
      );
    }

    // Décrémenter le stock
    const newStock = { ...stock, [item.weight]: currentStock - item.quantity };
    await product.update({ stock: newStock }, { transaction });
  }
};

// Génération numéro de commande unique
const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
};

// POST /api/orders — Création commande avec vérification stock
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        // Token invalide → commande anonyme
      }
    }

    const { items, total, shippingAddress, notes } = req.body;

    // Validation structure
    const errors = validateOrderData({ items, total, shippingAddress });
    if (errors.length) {
      await transaction.rollback();
      return res.status(400).json({ errors });
    }

    // Vérification + décrément stock (dans la transaction)
    try {
      await checkAndDecrementStock(items, transaction);
    } catch (stockErr) {
      await transaction.rollback();
      return res.status(400).json({ error: stockErr.message });
    }

    // Création commande avec retry sur collision orderNumber
    let order;
    let attempts = 0;
    while (!order && attempts < 3) {
      try {
        const orderNumber = generateOrderNumber();
        order = await Order.create({
          userId,
          orderNumber,
          items,
          total: parseFloat(total),
          shippingAddress,
          notes: notes || null,
          status: 'pending',
          paymentStatus: 'pending'
        }, { transaction });
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          attempts++;
          if (attempts >= 3) {
            await transaction.rollback();
            return res.status(500).json({ error: 'Impossible de générer un numéro de commande unique' });
          }
        } else {
          throw err;
        }
      }
    }

    await transaction.commit();

    // Notifications (non bloquantes — on ne attend pas)
    notifyAdmin(msgNouvelleCommandeAdmin(order)).catch(() => {});
    if (order.userId) {
      notifyClient(order.userId, msgCommandeClient(order)).catch(() => {});
    }

    logger.info(`Commande créée: ${order.orderNumber} — total: ${order.total}`);
    res.status(201).json(order);

  } catch (err) {
    await transaction.rollback();
    logger.error('Erreur création commande', { error: err.message });
    res.status(500).json({ error: 'Erreur création commande' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    if (order.userId) {
      if (!token) return res.status(401).json({ error: 'Token requis' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isOwner = decoded.id === order.userId;
        const isAdmin = decoded.role === 'admin' || decoded.role === 'superadmin';
        if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Accès refusé' });
      } catch {
        return res.status(401).json({ error: 'Token invalide' });
      }
    }

    res.json(order);
  } catch (err) {
    logger.error('Erreur fetch commande', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/orders/:id/status — Annulation uniquement par le client
router.put('/:id/status', verifyToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id, { transaction });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    if (order.userId !== req.userId) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Accès refusé' });
    }
    if (status !== 'cancelled') {
      await transaction.rollback();
      return res.status(403).json({ error: 'Vous ne pouvez qu\'annuler votre commande' });
    }
    if (order.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ error: `Impossible d'annuler une commande en statut "${order.status}"` });
    }

    // Remettre le stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: true });
      if (product) {
        const stock = product.stock || {};
        const current = stock[item.weight] || 0;
        const newStock = { ...stock, [item.weight]: current + item.quantity };
        await product.update({ stock: newStock }, { transaction });
      }
    }

    await order.update({ status: 'cancelled' }, { transaction });
    await transaction.commit();

    // Notifier le client de l'annulation
    if (order.userId) {
      notifyClient(order.userId, msgStatutClient({ ...order.dataValues, status: 'cancelled' })).catch(() => {});
    }

    logger.info(`Commande annulée: ${order.orderNumber} — stock restauré`);
    res.json({ message: 'Commande annulée et stock restauré' });
  } catch (err) {
    await transaction.rollback();
    logger.error('Erreur annulation commande', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
