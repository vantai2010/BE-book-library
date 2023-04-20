'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book_Infor.belongsTo(models.Book, { foreignKey: 'bookId', targetKey: 'id', as: 'bookInforData' })
      Book_Infor.belongsTo(models.Shelf, { foreignKey: 'shelfId', targetKey: 'id', as: 'shelfData' })
    }
  }
  Book_Infor.init({
    bookId: DataTypes.INTEGER,
    shelfId: DataTypes.INTEGER,
    roomId: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Book_Infor',
    freezeTableName: true

  });
  return Book_Infor;
};