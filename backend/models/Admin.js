import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Admin = sequelize.define('Admin', {
  permissions: { 
    type: DataTypes.ARRAY(DataTypes.STRING), 
    defaultValue: ['read:orders', 'read:products', 'read:users'] 
  },
  notes: { type: DataTypes.TEXT },
  lastLogin: { type: DataTypes.DATE },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

Admin.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Admin, { foreignKey: 'userId' });

export default Admin;
