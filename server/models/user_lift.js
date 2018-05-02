'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Lift = sequelize.define('User_Lift', {
    lift_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    rep_count: DataTypes.INTEGER
  }, { tableName: user_lift } );
  User_Lift.associate = function(models) {
    // associations can be defined here
  };
  return User_Lift;
};