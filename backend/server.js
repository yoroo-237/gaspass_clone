import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import logger from './utils/logger.js';

import { limiter, strictLimiter, userLimiter, orderLimiter } from './middleware/rateLimit.js';
import errorHandler from './middleware/errorHandler.js';

import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import ordersRouter from './routes/orders.js';
import telegramRouter from './routes/telegram.js';
import adminRouter from './routes/admin.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';
import categoriesRouter from './routes/categories.js';
import reviewsRouter from './routes/reviews.js';
import cartRouter from './routes/cart.js';
import contentRouter from './routes/content.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));

// CORS dynamique - Support www/non-www et variantes
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [];

// Ajouter automatiquement les variantes www si domaine racine existe
const corsOrigins = new Set(allowedOrigins);
allowedOrigins.forEach(origin => {
  if (origin.includes('://')) {
    const parts = origin.split('://');
    const protocol = parts[0];
    const domain = parts[1];
    // Ajouter www si absent
    if (!domain.startsWith('www.')) {
      corsOrigins.add(`${protocol}://www.${domain}`);
    }
    // Ajouter sans www si présent
    if (domain.startsWith('www.')) {
      corsOrigins.add(`${protocol}://${domain.slice(4)}`);
    }
  }
});

const finalOrigins = Array.from(corsOrigins);

if (finalOrigins.length === 0) {
  logger.warn('⚠️  FRONTEND_URL non défini — CORS bloqué pour toutes les origines');
}

if (process.env.NODE_ENV === 'production') {
  logger.info('✅ CORS Production autorisé pour:', finalOrigins.join(', '));
}

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile, curl) en dev uniquement
    if (!origin) {
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      } else {
        // En production, rejeter les requêtes sans origin
        return callback(new Error('CORS: origin requise en production'));
      }
    }
    
    // Vérifier si l'origin est autorisée
    if (finalOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Rejeter avec log détaillé
    const errorMsg = `CORS: origine non autorisée [${origin}]. Autorisées: [${finalOrigins.join(', ')}]`;
    logger.warn(errorMsg);
    return callback(new Error(errorMsg));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24h
}));

// Custom middleware to handle raw body for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Rate limiting
app.use('/api/auth',    strictLimiter);
app.use('/api/orders',  orderLimiter);   // limite les créations de commande
app.use('/api/cart',    userLimiter);    // limite par user sur le panier
app.use('/api/reviews', userLimiter);    // limite par user sur les reviews
app.use('/api/',        limiter);        // fallback global IP

// Routes API
app.use('/api/products',    productsRouter);
app.use('/api/auth',        authRouter);
app.use('/api/users',       usersRouter);
app.use('/api/payment',     paymentRouter);
app.use('/api/orders',      ordersRouter);
app.use('/api/telegram',    telegramRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/upload',      uploadRouter);
app.use('/api/categories',  categoriesRouter);
app.use('/api/reviews',     reviewsRouter);
app.use('/api/cart',        cartRouter);
app.use('/api/content',     contentRouter);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.send('Gas Pass API is running 🚀');
});

// Error handling
app.use(errorHandler);

// Database connection
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connexion PostgreSQL OK');
    // await sequelize.sync({ alter: true }); // décommenter pour sync auto
  } catch (error) {
    logger.error('Erreur connexion PostgreSQL', { error: error.message, stack: error.stack });
  }
})();

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// ✅ Fix Windows nodemon SIGTERM issue
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu — fermeture du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu — fermeture du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});
