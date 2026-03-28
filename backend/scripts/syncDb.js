
import sequelize from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');


    // Supprimer la table Admin si elle existe
    await sequelize.getQueryInterface().dropTable('Admins').catch(() => {});

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    process.exit(1);
  }
};

syncDb();
