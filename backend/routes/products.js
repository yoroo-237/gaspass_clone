import express from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product.js';
import logger from '../utils/logger.js'; // adaptez le chemin

const router = express.Router();

// GET /api/products - Avec filtres optionnels
router.get('/', async (req, res) => {
  let where = { active: true };
  try {
    const { category, grade, tag, search, page = 0, limit = 20 } = req.query;
    
    const orConditions = [];
    
    // Filtrer par catégorie (utiliser 'tier' ou 'type')
    if (category) {
      orConditions.push(
        { tier: { [Op.iLike]: `%${category}%` } },
        { type: { [Op.iLike]: `%${category}%` } }
      );
    }
    
    // Recherche par nom ou description
    if (search) {
      orConditions.push(
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      );
    }
    
    // Ajouter les conditions OR au where si nécessaire
    if (orConditions.length > 0) {
      where[Op.or] = orConditions;
    }
    
    // Filtrer par grade
    if (grade) {
      where.grade = grade;
    }

    // Filtrer par tag
    if (tag) {
      where.tags = { [Op.contains]: [tag] };
    }
    
    const products = await Product.findAll({
      where,
      limit: Math.min(parseInt(limit), 100), // Max 100 par page
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await Product.count({ where });
    res.json({ products, total: count });
  } catch (err) {
    console.error('SQL WHERE clause:', JSON.stringify(where, null, 2));
    console.error('Full error:', err);
    logger.error('Erreur fetch produits', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// GET /api/products/:id ou :slug
router.get('/:id', async (req, res) => {
  try {
    let product;
    const param = req.params.id;

    // Si c'est un nombre → chercher par PK, sinon directement par slug
    if (/^\d+$/.test(param)) {
      product = await Product.findByPk(param);
    } else {
      product = await Product.findOne({ where: { slug: param } });
    }

    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    logger.error('Erreur fetch produit', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
