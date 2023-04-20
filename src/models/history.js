'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' })
      History.belongsTo(models.Book, { foreignKey: 'bookId', targetKey: 'id', as: 'bookHistoryData' })
    }
  }

  History.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    borrowDate: DataTypes.STRING,
    returnDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'History',
    freezeTableName: true

  });
  return History;
};