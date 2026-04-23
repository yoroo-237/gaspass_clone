
import sequelize from '../config/db.js';

// ✅ Ordre correct : éviter dépendances circulaires
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Address from '../models/Address.js';
import Admin from '../models/Admin.js';
import Review from '../models/Review.js';
import AdminLog from '../models/AdminLog.js';
import TelegramLinkCode from '../models/TelegramLinkCode.js';

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    await sequelize.sync({ force: true }); // ⚠️ Force pour résoudre les conflits de colonnes

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
