import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TelegramLinkCode = sequelize.define('TelegramLinkCode', {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  telegramId: { type: DataTypes.BIGINT, allowNull: false },
  chatId: { type: DataTypes.BIGINT, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  used: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export default TelegramLinkCode;
