import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me - Profil actuel
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['passwordHash'] }
    });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error('Erreur fetch profil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/users/me/orders - Mes commandes
router.get('/me/orders', verifyToken, async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    
    const orders = await Order.findAll({
      where: { userId: req.userId },
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    
    const count = await Order.count({ where: { userId: req.userId } });
    
    res.json({
      orders,
      count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Erreur fetch commandes utilisateur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/me - Mettre à jour profil
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { phone, firstName, lastName, address } = req.body;
    const updateData = {};
    
    if (phone !== undefined) updateData.phone = phone;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (address !== undefined) updateData.address = address;
    
    await User.update(updateData, { where: { id: req.userId } });
    
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['passwordHash'] }
    });
    
    res.json({ message: 'Profil mis à jour', user });
  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/users/:id - Voir profil autre utilisateur (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash', 'telegramId', 'telegramChatId', 'telegramUsername'] }
    });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
