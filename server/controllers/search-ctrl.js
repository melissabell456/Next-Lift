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
    `SELECT lifts.name as title FROM lifts WHERE lifts.${req.query.column} ILIKE '%${req.query.term}%'`).spread((results, metadata) => {
    res.render('search', { formAttributes, term: req.query.term, results, state: "query" });
  })

}