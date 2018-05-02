'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift_Muscle = sequelize.define('Lift_Muscle', {
    lift_id: DataTypes.INTEGER,
    muscle_id: DataTypes.INTEGER,
    primary: DataTypes.BOOLEAN
  }, { tableName: lift_muscle, timestamps: false });
  Lift_Muscle.associate = function(models) {
    // associations can be defined here
  };
  return Lift_Muscle;
};