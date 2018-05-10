'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);
const formAttributes = [{column: "type", value:"isolation"}, {column:"type", value:"compound"}, {column: "motion", value:"pull"}, {column:"motion", value:"push"}, {column:"region", value:"upper"}, {column:"region", value:"lower"}];

module.exports.renderSearchView = (req, res, next) => {
  res.render('search', { formAttributes });
}

module.exports.searchLiftsTable = (req, res, next) => {
  sequelize.query(
    `SELECT * 
    FROM lift_and_equipment_combos ap
    LEFT JOIN user_log ul ON ul.ul_lift_id = ap.lift_id AND ul.ul_equip_id = ap.equipment_id
    LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
      AND ul.ul_lift_id = u.lift_id 
      AND ul.ul_equip_id = u.equipment_id 
      AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
    WHERE (ul.ul_user_id = ${req.user.id} OR ul.ul_user_id IS NULL)
      AND ap.${req.query.column} ILIKE '%${req.query.term}%'`
    ).spread((results, metadata) => {
      console.log(results);
    res.render('search', { formAttributes, term: req.query.term, results, state: "query", log_privilege: "true" });
  })

  // `SELECT * 
  // FROM lift_and_equipment_combos ap
  // LEFT JOIN user_log ul ON ul.ul_lift_id = ap.lift_id AND ul.ul_equip_id = ap.equipment_id
  // LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
	// AND ul.ul_lift_id = u.lift_id 
	// AND ul.ul_equip_id = u.equipment_id 
	// AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
  // WHERE (ul.user_id = ${req.user.id} OR ul.user_id IS NULL)
  // AND ap.${req.query.column} ILIKE '%${req.query.term}%'`
  // `SELECT * 
  // FROM lift_and_equipment_combos ap
  // LEFT JOIN user_log ul ON ul.ul_lift_id = ap.lift_id AND ul.ul_equip_id = ap.equipment_id
  // LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
	// AND ul.ul_lift_id = u.lift_id 
	// AND ul.ul_equip_id = u.equipment_id 
	// AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
  // WHERE (ul.user_id = ${req.user.id} OR ul.user_id IS NULL)
  // AND ap.${req.query.column} ILIKE '%${req.query.term}%'`
}

