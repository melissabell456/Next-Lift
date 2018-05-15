'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

module.exports.renderLiftForm = (req, res, next) => {
  const liftId = +(req.query.lift_id);
  const equipId = +(req.query.equip_id);
  sequelize.query(
    `SELECT * 
    FROM lift_and_equipment_combos ap
    LEFT JOIN user_log ul ON ul.ul_lift_id = ap.wkout_id AND ul.ul_equip_id = ap.equip_id
    LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
      AND ul.ul_lift_id = u.lift_id 
      AND ul.ul_equip_id = u.equipment_id 
      AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
    WHERE (ul.ul_user_id = ${req.user.id} OR ul.ul_user_id IS NULL)
      AND ap.wkout_id = ${liftId}
	    AND ap.equip_id = ${equipId}`
  ).spread( (results, metadata) => {
    res.render('log-lift-form', { results } );
  })
}

module.exports.renderSuggestedLiftForm = (req, res, next) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM suggested_user_lift sul
      LEFT JOIN lift_and_equipment_combos lc ON sul.lift_id = lc.wkout_id 
      AND sul.equipment_id = lc.equip_id
      WHERE user_id = ${req.user.id}`
    ).spread( (results, metadata) => {
      console.log(results, "XXYYZZ");
      res.render('log-lift-form', { results, status: "logSuggested" } );
    })
  })
}

// TODO: prevent future dates from being logged
module.exports.recordLift = (req, res, next) => {
  sequelize.query(
    `INSERT INTO user_lift (id, lift_id, lift_equipment_id, user_id, equipment_id, weight, rep_count, "createdAt", "updatedAt")
    VALUES (DEFAULT, ${req.body.lift_id}, DEFAULT, ${req.user.id}, ${req.body.equipment_id}, ${req.body.weight}, ${req.body.rep_count}, (('${req.body.createdAt}') AT TIME ZONE 'UTC'), current_date)`
  ).spread( (results, metadata) => {
    // TODO give feedback, redirect user
    console.log(results);
    console.log(metadata);
  })
}

module.exports.storeUserSuggestedLift = (lift, userSourcedBool, user_id) => {
  return new Promise( (resolve, reject) => {
      sequelize.query(
        `INSERT INTO suggested_user_lift (id, user_id, lift_id, equipment_id, weight, rep_count, user_added, "createdAt", "updatedAt")
        VALUES (DEFAULT, ${user_id}, ${lift.wkout_id}, ${lift.equip_id}, ${lift.s_weight}, ${lift.s_rep_count}, ${userSourcedBool}, current_date, current_date)`
      ).spread( (results, metadata) => {
        resolve(results);
      })
    // })
  })
}