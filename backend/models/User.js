import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  telegramId: { type: DataTypes.BIGINT, unique: true },
  telegramUsername: { type: DataTypes.STRING },
  telegramChatId: { type: DataTypes.BIGINT },
  telegramConnected: { type: DataTypes.BOOLEAN, defaultValue: false },
  address: { type: DataTypes.JSONB },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export default User;
