'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift_Equipment = sequelize.define('Lift_Equipment', {
    lift_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER
  }, { tableName: lift_equipment, timestamps: false });
  Lift_Equipment.associate = function(models) {
    Lift_Equipment.belongsTo(models.Lift, {
      foreignKey: 'lift_id'
    });
    Lift_Equipment.belongsTo(models.Equipment, {
      foreignKey: 'equipment_id'
    });
  };
  return Lift_Equipment;
};