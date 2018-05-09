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
  `SELECT
    l.name as liftName, 
    e.name as equipment,
    to_char(ul."createdAt", 'MM-DD-YYYY') as liftDate,
    ul.weight as weightLifted, 
    ul.rep_count as reps,
    ul.lift_equipment_id as comboId,
    ul.id as refId
  FROM lift_equipment le
  LEFT JOIN user_lift ul ON le.id = ul.lift_equipment_id 
    AND ul.user_id = ${req.user.id}
    AND ul.most_recent = true
  LEFT JOIN lifts l ON l.id = le.lift_id
  LEFT JOIN equipment e ON e.id = le.equipment_id
  WHERE l.${req.query.column} ILIKE '%${req.query.term}%'`
    ).spread((results, metadata) => {
    res.render('search', { formAttributes, term: req.query.term, results, state: "query" });
  })

// don't forget, when adding lifts, first you need to change the boolean value on the latest lift to false and then add the new lift as true

}