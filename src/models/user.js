'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, { foreignKey: 'genderId', targetKey: 'keyMap', as: 'genderUserData' })
      User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' })
      User.hasMany(models.History, { foreignKey: 'userId', as: 'userData' })
      User.hasMany(models.Comment, { foreignKey: 'userId', as: 'userCommentData' })
      User.hasMany(models.Cart, { foreignKey: 'userId', as: 'userCartData' })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    genderId: DataTypes.STRING,
    roleId: DataTypes.STRING,
    image: DataTypes.BLOB('medium')
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};