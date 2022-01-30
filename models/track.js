"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Track.belongsTo(models.Artist, {
        foreignKey: "artist_id",
        as: "artist",
        onDelete: "cascade"
      });
    }
  }
  Track.init(
    {
      isrc: DataTypes.STRING,
      title: DataTypes.STRING,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Track"
    }
  );
  return Track;
};