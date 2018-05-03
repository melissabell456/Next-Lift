'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, { tableName: users } );
  User.associate = function(models) {
    User.hasMany(models.User_Lift, {
      foreignKey: "user_id"
    })
  };
  return User;
};