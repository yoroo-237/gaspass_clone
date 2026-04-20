import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AdminLog = sequelize.define('AdminLog', {
  adminId:    { type: DataTypes.INTEGER, allowNull: false },
  action:     { type: DataTypes.STRING,  allowNull: false },  // ex: 'UPDATE_ORDER', 'DELETE_PRODUCT'
  entity:     { type: DataTypes.STRING,  allowNull: false },  // ex: 'Order', 'Product'
  entityId:   { type: DataTypes.STRING },                     // ID de la ressource modifiée
  before:     { type: DataTypes.JSONB },                      // état avant
  after:      { type: DataTypes.JSONB },                      // état après
  ip:         { type: DataTypes.STRING },
  userAgent:  { type: DataTypes.STRING }
});

export default AdminLog;
