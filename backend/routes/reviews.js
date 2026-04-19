import express from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/adminLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/reviews/product/:productId — Reviews publiques d'un produit
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 0, limit = 10, rating } = req.query;
    const where = {
      productId: req.params.productId,
      approved:  true
    };
    if (rating) where.rating = parseInt(rating);

    const reviews = await Review.findAll({
      where,
      limit:   Math.min(parseInt(limit), 50),
      offset:  parseInt(page) * parseInt(limit),
      order:   [['createdAt', 'DESC']],
      include: [{
        model:      User,
        attributes: ['firstName', 'lastName']
      }]
    });

    const count = await Review.count({ where });

    // Moyenne des notes
    const avgRating = await Review.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
        [sequelize.fn('COUNT', sequelize.col('id')),   'total']
      ],
      where: { productId: req.params.productId, approved: true },
      raw: true
    });

    res.json({
      reviews,
      count,
      avgRating: parseFloat(avgRating?.avg || 0).toFixed(1),
      totalReviews: parseInt(avgRating?.total || 0),
      page:  parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    logger.error('Erreur fetch reviews', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/reviews — Poster une review (client authentifié)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'productId et rating requis' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating entre 1 et 5' });
    }

    // Vérifier que le produit existe
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });

    // Une seule review par produit par user
    const existing = await Review.findOne({
      where: { userId: req.userId, productId }
    });
    if (existing) {
      return res.status(400).json({ error: 'Vous avez déjà reviewé ce produit' });
    }

    // Vérifier si achat vérifié
    const hasPurchased = await Order.findOne({
      where: {
        userId:        req.userId,
        paymentStatus: 'completed',
        items:         sequelize.where(
          sequelize.cast(sequelize.col('items'), 'text'),
          { [Op.iLike]: `%"productId":${productId}%` }
        )
      }
    });

    const review = await Review.create({
      userId:    req.userId,
      productId,
      rating,
      title:    title   || null,
      comment:  comment || null,
      verified: !!hasPurchased,
      approved: false // modération avant publication
    });

    res.status(201).json({
      message: 'Review soumise — en attente de modération',
      review
    });
  } catch (err) {
    logger.error('Erreur création review', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/reviews/:id — Modifier sa review
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review introuvable' });
    if (review.userId !== req.userId) return res.status(403).json({ error: 'Accès refusé' });

    const { rating, title, comment } = req.body;
    const updateData = {};

    if (rating  !== undefined) {
      if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating entre 1 et 5' });
      updateData.rating = rating;
    }
    if (title   !== undefined) updateData.title   = title;
    if (comment !== undefined) updateData.comment = comment;

    // Repasser en modération si modifiée
    updateData.approved = false;

    await review.update(updateData);
    res.json({ message: 'Review mise à jour — en attente de modération' });
  } catch (err) {
    logger.error('Erreur update review', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/reviews/:id — Supprimer sa review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review introuvable' });
    if (review.userId !== req.userId) return res.status(403).json({ error: 'Accès refusé' });

    await review.destroy();
    res.json({ message: 'Review supprimée' });
  } catch (err) {
    logger.error('Erreur suppression review', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Modération admin ──────────────────────────────────────────────────────────

// GET /api/reviews/admin/pending — Reviews en attente
router.get('/admin/pending', verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where:   { approved: false },
      order:   [['createdAt', 'ASC']],
      limit:   50
    });
    res.json({ reviews, count: reviews.length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/reviews/admin/:id/approve — Approuver une review
router.put('/admin/:id/approve', verifyAdmin, logAdminAction('APPROVE_REVIEW', 'Review'), async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review introuvable' });

    await review.update({ approved: true });
    res.json({ message: 'Review approuvée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/reviews/admin/:id — Supprimer une review (admin)
router.delete('/admin/:id', verifyAdmin, logAdminAction('DELETE_REVIEW', 'Review'), async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review introuvable' });

    await review.destroy();
    res.json({ message: 'Review supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
