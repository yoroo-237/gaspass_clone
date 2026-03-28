import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders - Permet les commandes anonymes et authentifiées
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    
    // Vérifier le token s'il existe
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token invalide, continuer sans userId
      }
    }

    const { items, total, shippingAddress, notes } = req.body;
    
    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requis' });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total invalide' });
    }
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.email) {
      return res.status(400).json({ error: 'Adresse de livraison incomplète' });
    }

    const orderNumber = `ORD-${Date.now()}`;
    
    const order = await Order.create({
      userId,
      orderNumber,
      items,
      total,
      shippingAddress,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Erreur création commande:', err);
    res.status(500).json({ error: 'Erreur création commande' });
  }
});

// GET /api/orders/:id - Accessible pour les commandes anonymes aussi
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// PUT /api/orders/:id/status - Admin seulement
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.update({ status }, { where: { id: req.params.id } });
    res.json({ message: 'Status mis à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
});

export default router;
