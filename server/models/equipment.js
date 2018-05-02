'use strict';
module.exports = (sequelize, DataTypes) => {
  var Equipment = sequelize.define('Equipment', {
    name: DataTypes.STRING
  }, {tableName: equipment, timestamps: false });
  Equipment.associate = function(models) {
    // associations can be defined here
  };
  return Equipment;
};