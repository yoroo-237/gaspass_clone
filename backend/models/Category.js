import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define('Category', {
  name:        { type: DataTypes.STRING, allowNull: false },
  slug:        { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  image:       { type: DataTypes.STRING },
  parentId:    { type: DataTypes.INTEGER, allowNull: true }, // pour sous-catégories
  active:      { type: DataTypes.BOOLEAN, defaultValue: true },
  order:       { type: DataTypes.INTEGER, defaultValue: 0 }  // tri d'affichage
});

// Auto-relation pour hiérarchie (parent → enfants)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

export default Category;
