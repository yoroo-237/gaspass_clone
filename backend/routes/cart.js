import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

const CART_TTL_DAYS = 7;

const refreshExpiry = () =>
  new Date(Date.now() + CART_TTL_DAYS * 24 * 60 * 60 * 1000);

// Récupérer ou créer le panier du user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], expiresAt: refreshExpiry() });
  }
  return cart;
};

// GET /api/cart — Mon panier
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);

    // Vérifier la validité des prix et stocks en temps réel
    const items = cart.items || [];
    const enriched = await Promise.all(items.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.active) {
        return { ...item, unavailable: true, reason: 'Produit non disponible' };
      }
      const currentStock = product.stock?.[item.weight] || 0;
      const currentPrice = product.pricing?.[item.weight];

      return {
        ...item,
        currentPrice,
        priceChanged: currentPrice !== item.pricePerUnit,
        stockAvailable: currentStock,
        outOfStock: currentStock < item.quantity
      };
    }));

    const total = enriched
      .filter(i => !i.unavailable)
      .reduce((sum, i) => sum + (i.pricePerUnit * i.quantity), 0);

    res.json({
      items: enriched,
      total: parseFloat(total.toFixed(2)),
      itemCount: enriched.length,
      expiresAt: cart.expiresAt
    });
  } catch (err) {
    logger.error('Erreur fetch cart', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/cart/items — Ajouter au panier
router.post('/items', verifyToken, async (req, res) => {
  try {
    const { productId, weight, quantity = 1 } = req.body;

    if (!productId || !weight) {
      return res.status(400).json({ error: 'productId et weight requis' });
    }

    const product = await Product.findByPk(productId);
    if (!product || !product.active) {
      return res.status(404).json({ error: 'Produit introuvable ou indisponible' });
    }

    const price = product.pricing?.[weight];
    if (price === undefined) {
      return res.status(400).json({ error: `Format "${weight}" non disponible` });
    }

    const stock = product.stock?.[weight] || 0;
    if (stock < quantity) {
      return res.status(400).json({
        error: `Stock insuffisant: ${stock} disponible(s)`
      });
    }

    const cart  = await getOrCreateCart(req.userId);
    const items = cart.items || [];

    // Si item déjà présent → incrémenter
    const existingIdx = items.findIndex(
      i => i.productId === productId && i.weight === weight
    );

    if (existingIdx >= 0) {
      const newQty = items[existingIdx].quantity + quantity;
      if (newQty > stock) {
        return res.status(400).json({ error: `Stock max: ${stock}` });
      }
      items[existingIdx].quantity = newQty;
    } else {
      if (items.length >= 50) {
        return res.status(400).json({ error: 'Panier limité à 50 articles' });
      }
      items.push({
        productId,
        name:         product.name,
        weight,
        quantity,
        pricePerUnit: price,
        image:        product.images?.[0] || null
      });
    }

    await cart.update({ items, expiresAt: refreshExpiry() });
    res.json({ message: 'Article ajouté', items, total: items.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0).toFixed(2) });
  } catch (err) {
    logger.error('Erreur ajout cart', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/cart/items — Modifier quantité
router.put('/items', verifyToken, async (req, res) => {
  try {
    const { productId, weight, quantity } = req.body;

    if (!productId || !weight || quantity === undefined) {
      return res.status(400).json({ error: 'productId, weight et quantity requis' });
    }

    const cart  = await getOrCreateCart(req.userId);
    let   items = cart.items || [];

    if (quantity <= 0) {
      // Supprimer l'item si quantity = 0
      items = items.filter(i => !(i.productId === productId && i.weight === weight));
    } else {
      const product = await Product.findByPk(productId);
      const stock   = product?.stock?.[weight] || 0;

      if (quantity > stock) {
        return res.status(400).json({ error: `Stock max disponible: ${stock}` });
      }

      const idx = items.findIndex(i => i.productId === productId && i.weight === weight);
      if (idx === -1) return res.status(404).json({ error: 'Article introuvable dans le panier' });
      items[idx].quantity = quantity;
    }

    await cart.update({ items, expiresAt: refreshExpiry() });
    res.json({ message: 'Panier mis à jour', items });
  } catch (err) {
    logger.error('Erreur update cart', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/cart/items — Supprimer un article
router.delete('/items', verifyToken, async (req, res) => {
  try {
    const { productId, weight } = req.body;
    if (!productId || !weight) {
      return res.status(400).json({ error: 'productId et weight requis' });
    }

    const cart  = await getOrCreateCart(req.userId);
    const items = (cart.items || []).filter(
      i => !(i.productId === productId && i.weight === weight)
    );

    await cart.update({ items, expiresAt: refreshExpiry() });
    res.json({ message: 'Article supprimé', items });
  } catch (err) {
    logger.error('Erreur suppression item cart', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/cart — Vider le panier
router.delete('/', verifyToken, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    await cart.update({ items: [], expiresAt: refreshExpiry() });
    res.json({ message: 'Panier vidé' });
  } catch (err) {
    logger.error('Erreur vidage cart', { error: err.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
