'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lift_Muscle = sequelize.define('Lift_Muscle', {
    primary: DataTypes.BOOLEAN
  }, { tableName: lift_muscle, timestamps: false });
  Lift_Muscle.associate = function(models) {
    Lift_Muscle.belongsTo(models.Lift, {
      foreignKey: 'lift_id'
    });
    Lift_Muscle.belongsTo(models.muscle, {
      foreignKey: 'muscle_id'
    });
  };
  return Lift_Muscle;
};