import rateLimit from 'express-rate-limit';

// ── Par IP — général ──────────────────────────────────────────────────────────
// Permettre plus de requêtes car le cache côté client réduit drastiquement les appels réels
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max:      1000,            // 1000 requêtes par 15 min = ~67 requêtes/min (augmenté de 500)
  message:  { error: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders:   false,
  skip: (req) => {
    // Ne pas limiter les requêtes GET (sûres, cachées côté client)
    return req.method === 'GET';
  }
});

// ── Par IP — endpoints GET spécifiques (moins restrictif) ────────────────────
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      500,  // 500 GET par 15 min (pour éviter les abus)
  message:  { error: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Par IP — auth strict ──────────────────────────────────────────────────────
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      10,  // 10 tentatives par heure
  message:  { error: 'Trop de tentatives, réessayez dans 1 heure' },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Par user authentifié ──────────────────────────────────────────────────────
// Identifie par userId si token présent, sinon fallback sur IP
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      1000,  // 1000 requêtes par user par 15 min (augmenté de 500)
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
  max:      50,  // 50 commandes par heure par user (augmenté de 20)
  keyGenerator: (req) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return `order_${decoded.id}`;
      }
    } catch {
      //
    }
    return req.ip;
  },
  message: { error: 'Trop de commandes, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders:   false
});

