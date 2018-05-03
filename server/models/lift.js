'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift = sequelize.define('Lift', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: DataTypes.STRING,
    motion: DataTypes.STRING,
    type: DataTypes.STRING
  }, { tableName: 'lifts', timestamps: false });
  Lift.associate = function(models) {
    Lift.hasMany(models.Lift_Equipment, {
      foreignKey: "lift_id"
    })
    Lift.hasMany(models.Lift_Muscle, {
      foreignKey: "lift_id"
    })
    Lift.hasMany(models.User_Lift, {
      foreignKey: "lift_id"
    })
  };
  return Lift;
};