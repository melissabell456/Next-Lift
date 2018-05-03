'use strict';
module.exports = (sequelize, DataTypes) => {
  var Equipment = sequelize.define('Equipment', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: DataTypes.STRING
  }, {tableName: equipment, timestamps: false });
  Equipment.associate = function(models) {
    Equipment.hasMany(models.Lift_Equipment, {
      foreignKey: "equipment_id"
    });
    Equipment.hasMany(models.User_Lift, {
      foreignKey: 'equipment_id'
    });
  };
  return Equipment;
};