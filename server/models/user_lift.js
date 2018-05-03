'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Lift = sequelize.define('User_Lift', {
    lift_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    rep_count: DataTypes.INTEGER
  }, { tableName: user_lift } );
  User_Lift.associate = function(models) {
    User_Lift.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
    User_Lift.belongsTo(models.Lift, {
      foreignKey: 'lift_id'
    });
    User_Lift.belongsTo(models.Equipment, {
      foreignKey: 'equipment_id'
    });
  };
  return User_Lift;
};