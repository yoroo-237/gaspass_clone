import express from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Avec filtres optionnels
router.get('/', async (req, res) => {
  try {
    const { category, grade, tag, search, page = 0, limit = 20 } = req.query;
    
    const where = { active: true };
    
    // Filtrer par catégorie (utiliser 'tier' ou 'type')
    if (category) {
      where[Op.or] = [
        { tier: { [Op.iLike]: `%${category}%` } },
        { type: { [Op.iLike]: `%${category}%` } }
      ];
    }
    
    // Filtrer par grade
    if (grade) {
      where.grade = grade;
    }

    // Filtrer par tag
    if (tag) {
      where.tags = { [Op.contains]: [tag] };
    }
    
    // Recherche par nom ou description
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const products = await Product.findAll({
      where,
      limit: Math.min(parseInt(limit), 100), // Max 100 par page
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await Product.count({ where });
    
    res.json({
      count,
      page: parseInt(page),
      limit: parseInt(limit),
      products
    });
  } catch (err) {
    logger.error('Erreur fetch produits', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/products/:id ou :slug
router.get('/:id', async (req, res) => {
  try {
    let product;
    
    // Essayer de trouver par ID d'abord
    product = await Product.findByPk(req.params.id);
    
    // Si pas trouvé, essayer par slug
    if (!product) {
      product = await Product.findOne({ where: { slug: req.params.id } });
    }
    
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    logger.error('Erreur fetch produit', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
