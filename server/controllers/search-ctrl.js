'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

module.exports.renderSearchView = (req, res, next) => {
  res.render('search');
}

module.exports.searchLiftsTable = (req, res, next) => {

  sequelize.query(
    `SELECT lifts.name as title FROM lifts WHERE lifts.${req.query.column} ILIKE '%${req.query.term}%'`).spread((results, metadata) => {
    console.log(results);
    res.render('search', { term: req.query.term, results, state: "query" });
  })

}