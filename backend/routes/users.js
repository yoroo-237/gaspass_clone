import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import sequelize from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

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
    logger.error('Erreur fetch profil', { error: err.message, stack: err.stack });
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
    logger.error('Erreur fetch commandes utilisateur', { error: err.message, stack: err.stack });
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
    logger.error('Erreur mise à jour profil', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/users/:id - Voir profil autre utilisateur (public minimal uniquement)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstName', 'lastName', 'createdAt']
      // Rien d'autre — email, phone, role, address, telegramConnected sont privés
    });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    logger.error('Erreur fetch user public', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// ADRESSES MULTIPLES
// ────────────────────────────────────────────────────────────────────────────

// GET /api/users/me/addresses — Toutes mes adresses
router.get('/me/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json({ addresses, count: addresses.length });
  } catch (err) {
    logger.error('Erreur fetch addresses', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/users/me/addresses — Ajouter une adresse
router.post('/me/addresses', verifyToken, async (req, res) => {
  try {
    const { label, name, address, city, zipcode, country, phone, isDefault } = req.body;

    if (!name || !address || !city || !zipcode) {
      return res.status(400).json({ error: 'name, address, city, zipcode requis' });
    }

    // Max 10 adresses par user
    const count = await Address.count({ where: { userId: req.userId } });
    if (count >= 10) {
      return res.status(400).json({ error: 'Maximum 10 adresses par compte' });
    }

    const transaction = await sequelize.transaction();
    try {
      // Si nouvelle adresse par défaut → retirer le flag des autres
      if (isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId: req.userId }, transaction }
        );
      }

      const newAddress = await Address.create({
        userId: req.userId,
        label:  label   || 'Domicile',
        name, address, city, zipcode,
        country: country || 'France',
        phone:   phone   || null,
        isDefault: isDefault || count === 0 // première adresse = défaut auto
      }, { transaction });

      await transaction.commit();
      res.status(201).json(newAddress);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    logger.error('Erreur création adresse', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/me/addresses/:id — Modifier une adresse
router.put('/me/addresses/:id', verifyToken, async (req, res) => {
  try {
    const addr = await Address.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!addr) return res.status(404).json({ error: 'Adresse introuvable' });

    const { label, name, address, city, zipcode, country, phone, isDefault } = req.body;
    const updateData = {};

    if (label   !== undefined) updateData.label   = label;
    if (name    !== undefined) updateData.name    = name;
    if (address !== undefined) updateData.address = address;
    if (city    !== undefined) updateData.city    = city;
    if (zipcode !== undefined) updateData.zipcode = zipcode;
    if (country !== undefined) updateData.country = country;
    if (phone   !== undefined) updateData.phone   = phone;

    const transaction = await sequelize.transaction();
    try {
      if (isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId: req.userId }, transaction }
        );
        updateData.isDefault = true;
      }

      await addr.update(updateData, { transaction });
      await transaction.commit();
      res.json({ message: 'Adresse mise à jour', address: addr });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    logger.error('Erreur update adresse', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/users/me/addresses/:id — Supprimer une adresse
router.delete('/me/addresses/:id', verifyToken, async (req, res) => {
  try {
    const addr = await Address.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!addr) return res.status(404).json({ error: 'Adresse introuvable' });

    await addr.destroy();

    // Si c'était l'adresse par défaut → mettre la plus récente en défaut
    if (addr.isDefault) {
      const next = await Address.findOne({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']]
      });
      if (next) await next.update({ isDefault: true });
    }

    res.json({ message: 'Adresse supprimée' });
  } catch (err) {
    logger.error('Erreur suppression adresse', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
