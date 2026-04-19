
import sequelize from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import TelegramLinkCode from '../models/TelegramLinkCode.js';
import AdminLog from '../models/AdminLog.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Address from '../models/Address.js';
import Cart from '../models/Cart.js';

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    await sequelize.sync({ alter: true });

    console.log('✅ Tables synchronisées:');
    console.log('   → User');
    console.log('   → Product       (+ tags, categoryId)');
    console.log('   → Order         (+ paymentIntentId)');
    console.log('   → Category      (nouvelle)');
    console.log('   → Review        (nouvelle)');
    console.log('   → Address       (nouvelle)');
    console.log('   → Cart          (nouvelle)');
    console.log('   → AdminLog      (nouvelle)');
    console.log('   → TelegramLinkCode');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    process.exit(1);
  }
};

syncDb();
