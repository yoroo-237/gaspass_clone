import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Address = sequelize.define('Address', {
  label:      { type: DataTypes.STRING, defaultValue: 'Domicile' }, // ex: Maison, Bureau
  name:       { type: DataTypes.STRING, allowNull: false },
  address:    { type: DataTypes.STRING, allowNull: false },
  city:       { type: DataTypes.STRING, allowNull: false },
  zipcode:    { type: DataTypes.STRING, allowNull: false },
  country:    { type: DataTypes.STRING, defaultValue: 'France' },
  phone:      { type: DataTypes.STRING },
  isDefault:  { type: DataTypes.BOOLEAN, defaultValue: false }
});

Address.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Address,   { foreignKey: 'userId', as: 'addresses' });

export default Address;
