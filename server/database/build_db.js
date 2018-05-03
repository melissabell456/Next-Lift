'use strict';

const sequelize = require('sequelize');
// const qui = require('sequelize/lib/query-interface'); TODO: remove if not needed
// const app = require('../app/app'); TODO: remove if not needed
const models = require('../models');

const lifts = require('./json/lifts');
const muscles = require('./json/muscle-groups');
const equipment = require('./json/equipment');
const lift_muscle = require('./json/lift_muscle');
const lift_equipment = require('./json/lift_equipment');

const createDb = qi => {
  return models.sequelize.sync({force: true})
    .then(qi => {
      return models.Lift.bulkCreate(lifts);
    })
    .then(qi => {
      return models.Muscle.bulkCreate(muscles);
    })
    .then(qi => {
      return models.Equipment.bulkCreate(equipment);
    })
    .then(qi => {
      return models.Lift_Muscle.bulkCreate(lift_muscle);
    })
    .then(qi => {
      return models.Lift_Equipment.bulkCreate(lift_equipment);
    })
    .then(qi => {
      return models.User.bulkCreate({
        first_name: "Melissa",
        last_name: "Bell",
        user_name: "MelBell",
        email: "melissabell456@gmail.com",
        password: "$2a$08$K1LoheHX1gkfDvInXGHiLuo3Fbi1AU/HM2K27I0foVKbVzYEHF5Ru",
        active: true
      });
    })
    .then(qi => {
      return models.User_Lift.bulkCreate({
        lift_id: 1,
        user_id: 1,
        equipment_id: 1,
        weight: 60,
        rep_count: 12
      },
    {
      lift_id: 1,
      user_id: 1,
      equipment_id: 2,
      weight: 200,
      rep_count: 6
    });
    })
    .then(response => {
      process.exit();
    })
    .catch(err => console.log(err));
};

createDb();