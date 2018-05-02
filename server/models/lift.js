'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift = sequelize.define('Lift', {
    name: DataTypes.STRING,
    motion: DataTypes.STRING,
    type: DataTypes.STRING
  }, { tableName: lifts, timestamps: false });
  Lift.associate = function(models) {
    // associations can be defined here
  };
  return Lift;
};