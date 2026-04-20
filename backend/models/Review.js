import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Product from './Product.js';

const Review = sequelize.define('Review', {
  rating:  {
    type:     DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  title:   { type: DataTypes.STRING },
  comment: { type: DataTypes.TEXT },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false }, // achat vérifié
  approved: { type: DataTypes.BOOLEAN, defaultValue: false }  // modération admin
});

Review.belongsTo(User,    { foreignKey: 'userId',    onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
User.hasMany(Review,      { foreignKey: 'userId' });
Product.hasMany(Review,   { foreignKey: 'productId' });

export default Review;
