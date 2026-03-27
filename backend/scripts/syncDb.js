import sequelize from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Admin from '../models/Admin.js';

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    process.exit(1);
  }
};

syncDb();
