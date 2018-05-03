'use strict';
module.exports = (sequelize, DataTypes) => {
  var Muscle = sequelize.define('Muscle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: DataTypes.STRING
  }, { tableName: 'muscles', timestamps: false });
  Muscle.associate = function(models) {
    Muscle.hasMany(models.Lift_Muscle, {
      foreignKey: 'muscle_id'
    })
  };
  return Muscle;
};