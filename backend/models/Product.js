import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  grade: { type: DataTypes.STRING },
  tier: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING },
  thc: { type: DataTypes.STRING },
  cbd: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  lineage: { type: DataTypes.STRING },
  terpenes: { type: DataTypes.ARRAY(DataTypes.STRING) },
  description: { type: DataTypes.TEXT },
  stock: { type: DataTypes.JSONB },
  pricing: { type: DataTypes.JSONB },
  images: { type: DataTypes.ARRAY(DataTypes.STRING) },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Product;
