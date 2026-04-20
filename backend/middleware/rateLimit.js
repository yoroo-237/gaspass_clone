import rateLimit from 'express-rate-limit';

// ── Par IP — général ──────────────────────────────────────────────────────────
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      500,  // Augmenté de 100 à 500 (caching côté client)
  message:  { error: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Par IP — auth strict ──────────────────────────────────────────────────────
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      10,
  message:  { error: 'Trop de tentatives, réessayez dans 1 heure' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Par user authentifié ──────────────────────────────────────────────────────
// Identifie par userId si token présent, sinon fallback sur IP
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      500,  // Augmenté de 200 à 500
  keyGenerator: (req) => {
    // Extraire userId du token si présent
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return `user_${decoded.id}`;
      }
    } catch {
      // pas de token valide → fallback IP
    }
    return req.ip;
  },
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Par user — actions sensibles (commandes, paiements) ───────────────────────
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      20,
  keyGenerator: (req) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return `order_user_${decoded.id}`;
      }
    } catch {}
    return `order_ip_${req.ip}`;
  },
  message: { error: 'Trop de commandes passées, réessayez dans 1 heure' },
  standardHeaders: true,
  legacyHeaders:   false
});

