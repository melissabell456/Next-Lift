'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift_Equipment = sequelize.define('Lift_Equipment', {
    lift_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER
  }, {});
  Lift_Equipment.associate = function(models) {
    // associations can be defined here
  };
  return Lift_Equipment;
};