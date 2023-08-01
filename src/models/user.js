"use strict";
const { genSaltSync, hashSync } = require("bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(20), allowNull: false },
      password: {
        type: DataTypes.STRING(20),
        allowNull: false,
        set(val) {
          const salt = genSaltSync(10);
          const hashedPassword = hashSync(val, salt);
          this.setDataValue("password", hashedPassword);
        },
      },
      role: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
    }
  );
  return User;
};
