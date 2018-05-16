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
    res.render('user-dash', { userLogs, status: "userDash" });
  })
}

const getUserHistory = (user_id) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT lc.*, 
      to_char(ul."createdAt", 'MM-DD-YYYY') AS liftdate,
      ul.weight AS maxweight,
      ul.rep_count AS maxreps,
      ul.lift_id,
      ul.id AS user_lift_id,
      ul.user_id,
      ul.equipment_id
      FROM lift_and_equipment_combos lc
      LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
        AND lc.equip_id = ul.equipment_id
      WHERE ul.user_id = ${user_id}
      ORDER BY ul."updatedAt" desc`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
}

module.exports.renderEditForm = (req, res, next) => {
  console.log(req.query);
  getUserLiftEntry(req.query)
  .then( results => {
    console.log(results);
    res.render('edit-entry', { results, status: "editEntry" });
  })
}

const getUserLiftEntry = ( { user_lift_id} ) => {
  console.log(user_lift_id);
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT lc.*, 
      to_char(ul."createdAt", 'MM-DD-YYYY') AS liftdate,
      ul.weight AS maxweight,
      ul.rep_count AS maxreps,
      ul.lift_id,
      ul.id AS user_lift_id,
      ul.user_id,
      ul.equipment_id
      FROM lift_and_equipment_combos lc
      LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
        AND lc.equip_id = ul.equipment_id
      WHERE ul.id = ${user_lift_id}`
    ).spread( (results, metadata) => {
      resolve(results)
    })
  })
}

module.exports.updateUserEntry = (req, res, next) => {
  console.log(req.body);
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `UPDATE user_lift
      SET rep_count = ${req.body.rep_count},
        weight = ${req.body.weight}, 
        "createdAt" = (('${req.body.createdAt}') AT TIME ZONE 'UTC'),
        "updatedAt" = now()
      WHERE id = ${req.body.user_lift_id}`
    ).spread( (results, metadata) => {
      res.redirect('/dashboard');
    })
  })
}