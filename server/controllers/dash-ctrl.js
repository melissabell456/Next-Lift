'use strict'

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

module.exports.renderDashView = (req, res, next) => {
  getUserHistory(req.user.id)
  .then( userLogs => {
    res.render('user-dash', { userLogs });
  })
}

const getUserHistory = (user_id) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT *
      FROM lift_and_equipment_combos lc
      LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
        AND lc.equip_id = ul.equipment_id
      WHERE ul.user_id = ${user_id}
      ORDER BY liftname`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
}