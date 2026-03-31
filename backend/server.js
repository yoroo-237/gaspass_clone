import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import sequelize from './config/db.js';

import { limiter, strictLimiter } from './middleware/rateLimit.js';
import errorHandler from './middleware/errorHandler.js';

import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import ordersRouter from './routes/orders.js';
import telegramRouter from './routes/telegram.js';
import adminRouter from './routes/admin.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(fileUpload());

// Rate limiting
app.use('/api/auth', strictLimiter);
app.use('/api/', limiter);

// Routes API
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

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
    console.log('✅ Connexion PostgreSQL OK');
    // await sequelize.sync({ alter: true }); // décommenter pour sync auto
  } catch (error) {
    console.error('❌ Erreur connexion PostgreSQL:', error);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
