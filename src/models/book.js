'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Author, { foreignKey: 'authorId', targetKey: 'id', as: 'authorData' })
      Book.belongsTo(models.Allcode, { foreignKey: 'categoryId', targetKey: 'keyMap', as: 'categoryData' })
      Book.hasOne(models.Book_Infor, { foreignKey: 'bookId', as: 'bookInforData' })
      Book.hasMany(models.History, { foreignKey: 'bookId', as: 'bookHistoryData' })
      Book.hasMany(models.Cart, { foreignKey: 'bookId', as: 'bookCartData' })
    }
  }
  Book.init({
    name: DataTypes.STRING,
    image: DataTypes.BLOB('medium'),
    categoryId: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    borrowed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
    freezeTableName: true

  });
  return Book;
};