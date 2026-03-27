import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  orderNumber: { type: DataTypes.STRING, unique: true },
  items: { type: DataTypes.JSONB },
  total: { type: DataTypes.FLOAT },
  tax: { type: DataTypes.FLOAT },
  shippingCost: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.STRING },
  shippingAddress: { type: DataTypes.JSONB },
  telegramUserId: { type: DataTypes.BIGINT },
  telegramChatId: { type: DataTypes.BIGINT },
  notes: { type: DataTypes.TEXT },
  completedAt: { type: DataTypes.DATE },
  estimatedDelivery: { type: DataTypes.DATE }
});

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

export default Order;
