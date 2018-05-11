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
  console.log(req.query);
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
    console.log(results);
    res.render('log-lift-form', { results } );
  })
  // res.json(liftStats);
} 

module.exports.recordLift = (req, res, next) => {
  console.log(req.body);
  sequelize.query(
    `INSERT INTO user_lift (id, lift_id, lift_equipment_id, user_id, equipment_id, weight, rep_count, "createdAt", "updatedAt")
    VALUES (DEFAULT, ${req.body.lift_id}, DEFAULT, ${req.user.id}, ${req.body.equipment_id}, ${req.body.weight}, ${req.body.rep_count}, (('${req.body.createdAt}') AT TIME ZONE 'UTC'), current_date)`
  ).spread( (results, metadata) => {
    console.log(results);
    console.log(metadata);
  })
}