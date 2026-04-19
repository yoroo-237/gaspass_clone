import express from 'express';
import { Op } from 'sequelize';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { verifyAdmin } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/adminLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/categories — Liste publique avec enfants
router.get('/', async (req, res) => {
  try {
    const { parentOnly = 'false' } = req.query;

    const where = { active: true };
    if (parentOnly === 'true') where.parentId = null;

    const categories = await Category.findAll({
      where,
      include: [{ model: Category, as: 'children', where: { active: true }, required: false }],
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.json({ categories, count: categories.length });
  } catch (err) {
    logger.error('Erreur fetch categories', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/categories/:slug — Catégorie + ses produits
router.get('/:slug', async (req, res) => {
  try {
    const { page = 0, limit = 20 } = req.query;

    const category = await Category.findOne({
      where: { slug: req.params.slug, active: true },
      include: [{ model: Category, as: 'children', required: false }]
    });

    if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });

    // Inclure aussi les produits des sous-catégories
    const childIds = (category.children || []).map(c => c.id);
    const categoryIds = [category.id, ...childIds];

    const products = await Product.findAll({
      where: {
        categoryId: { [Op.in]: categoryIds },
        active: true
      },
      limit:  Math.min(parseInt(limit), 100),
      offset: parseInt(page) * parseInt(limit),
      order:  [['createdAt', 'DESC']]
    });

    const count = await Product.count({
      where: { categoryId: { [Op.in]: categoryIds }, active: true }
    });

    res.json({ category, products, count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    logger.error('Erreur fetch category', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── Routes admin ──────────────────────────────────────────────────────────────

// POST /api/categories/admin — Créer catégorie
router.post('/admin', verifyAdmin, logAdminAction('CREATE_CATEGORY', 'Category'), async (req, res) => {
  try {
    const { name, slug, description, image, parentId, order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'name et slug requis' });
    }

    const existing = await Category.findOne({ where: { slug } });
    if (existing) return res.status(400).json({ error: 'Slug déjà utilisé' });

    const category = await Category.create({
      name, slug, description, image,
      parentId: parentId || null,
      order:    order    || 0
    });

    res.status(201).json(category);
  } catch (err) {
    logger.error('Erreur création category', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/categories/admin/:id — Modifier catégorie
router.put('/admin/:id', verifyAdmin, logAdminAction('UPDATE_CATEGORY', 'Category'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });

    const { name, slug, description, image, parentId, active, order } = req.body;
    const updateData = {};

    if (name        !== undefined) updateData.name        = name;
    if (slug        !== undefined) updateData.slug        = slug;
    if (description !== undefined) updateData.description = description;
    if (image       !== undefined) updateData.image       = image;
    if (parentId    !== undefined) updateData.parentId    = parentId;
    if (active      !== undefined) updateData.active      = active;
    if (order       !== undefined) updateData.order       = order;

    await category.update(updateData);
    res.json({ message: 'Catégorie mise à jour', category });
  } catch (err) {
    logger.error('Erreur update category', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/categories/admin/:id
router.delete('/admin/:id', verifyAdmin, logAdminAction('DELETE_CATEGORY', 'Category'), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });

    // Vérifier qu'aucun produit n'est lié
    const productCount = await Product.count({ where: { categoryId: category.id } });
    if (productCount > 0) {
      return res.status(400).json({
        error: `Impossible — ${productCount} produit(s) lié(s) à cette catégorie`
      });
    }

    await category.destroy();
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    logger.error('Erreur suppression category', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
