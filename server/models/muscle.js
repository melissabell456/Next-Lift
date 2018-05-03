'use strict';
module.exports = (sequelize, DataTypes) => {
  var Muscle = sequelize.define('Muscle', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: DataTypes.STRING
  }, { tableName: muscles, timestamps: false });
  Muscle.associate = function(models) {
    Muscle.hasMany(models.lift_muscle, {
      foreignKey: 'muscle_id'
    })
  };
  return Muscle;
};