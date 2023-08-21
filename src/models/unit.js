"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unit: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(20), allowNull: false },
      note: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Unit",
      timestamps: true,
    }
  );

  return Unit;
};
