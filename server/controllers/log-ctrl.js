'use strict';

module.exports.renderLiftForm = (req, res, next) => {
  console.log(req.query);
  res.render('log-lift-form', req.query);
} 

module.exports.recordLift = (req, res, next) => {

}