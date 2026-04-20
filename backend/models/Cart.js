import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Cart = sequelize.define('Cart', {
  items:      { type: DataTypes.JSONB, defaultValue: [] },
  // items = [{ productId, name, weight, quantity, pricePerUnit, image }]
  expiresAt:  { type: DataTypes.DATE } // panier expire après 7 jours d'inactivité
});

Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Cart,    { foreignKey: 'userId', as: 'cart' });

export default Cart;
