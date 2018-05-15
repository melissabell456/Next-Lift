'use strict';

const Sequelize = require('sequelize');
const models = require('../models/');
const sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

const lifts = require('./json/lifts');
const muscles = require('./json/muscle-groups');
const equipment = require('./json/equipment');
const lift_muscle = require('./json/lift_muscle');
const lift_equipment = require('./json/lift_equipment');
const user_lifts = require('./json/user_lifts');
const users = require('./json/users');

const createDb = () => {
  return models.sequelize.sync({force: true})
    .then( () => {
      return models.Lift.bulkCreate(lifts);
    })
    .then( () => {
      return models.Muscle.bulkCreate(muscles);
    })
    .then( () => {
      return models.Equipment.bulkCreate(equipment);
    })
    .then( () => {
      return models.Lift_Muscle.bulkCreate(lift_muscle);
    })
    .then( () => {
      return models.Lift_Equipment.bulkCreate(lift_equipment);
    })
    .then( () => {
      return models.User.bulkCreate(users);
    })
    .then( () => {
      return models.User_Lift.bulkCreate(user_lifts);
    })
    .then( () => {
      return models.Suggested_User_Lift.create();
    })
    .then(response => {
      process.exit();
    })
    .catch(err => console.log(err));
};

// TODO: add functionality to automate adding views when building DB

createDb();