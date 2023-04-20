'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Book, { foreignKey: "bookId", as: "bookCartData", targetKey: "id" })
      Cart.belongsTo(models.User, { foreignKey: "userId", as: "userCartData", targetKey: "id" })

    }
  }
  Cart.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    statusId: DataTypes.STRING,
    time: DataTypes.STRING,
    returnDate: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true

  });
  return Cart;
};