'use strict';
module.exports = (sequelize, DataTypes) => {
  var Suggested_User_Lift = sequelize.define('Suggested_User_Lift', {
    user_id: DataTypes.INTEGER,
    lift_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    rep_count: DataTypes.INTEGER,
    user_added: DataTypes.BOOLEAN
  }, { tableName: 'suggested_user_lift'});
  Suggested_User_Lift.associate = function(models) {
      Suggested_User_Lift.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      Suggested_User_Lift.belongsTo(models.Lift, {
        foreignKey: 'lift_id'
      });
      Suggested_User_Lift.belongsTo(models.Equipment, {
        foreignKey: 'equipment_id'
      });
  };
  return Suggested_User_Lift;
};