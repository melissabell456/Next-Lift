'use strict';
module.exports = (sequelize, DataTypes) => {
  var Muscle = sequelize.define('Muscle', {
    name: DataTypes.STRING
  }, { tableName: muscles, timestamps: false });
  Muscle.associate = function(models) {
    // associations can be defined here
  };
  return Muscle;
};