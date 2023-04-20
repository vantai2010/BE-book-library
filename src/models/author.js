'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Author.belongsTo(models.Allcode, { foreignKey: 'genderId', targetKey: 'keyMap', as: 'genderAuthorData' })
      Author.hasMany(models.Book, { foreignKey: 'authorId', as: 'authorData' })
    }
  }

  Author.init({
    name: DataTypes.STRING,
    birthDay: DataTypes.STRING,
    genderId: DataTypes.STRING,
    image: DataTypes.BLOB('medium'),
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Author',
    freezeTableName: true

  });
  return Author;
};