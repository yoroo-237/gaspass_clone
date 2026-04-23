import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './Category.js';
import logger from '../utils/logger.js'; // adaptez le chemin

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
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  description: { type: DataTypes.TEXT },
  stock: { type: DataTypes.JSONB },
  pricing: { type: DataTypes.JSONB },
  images: { type: DataTypes.ARRAY(DataTypes.STRING) },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'Product',
  underscored: true
});

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

export default Product;
