'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

module.exports.getSuggestedWorkout = (req, res, next) => {
  // is there already a suggested workout stored? if so, render it to dom. if not, send to getLastLift (userId) to begin generation logic
}

// ****this gets all of users most recent lifts
const getLastLift = (user_id) => {
  sequelize.query(
    `SELECT * 
    FROM user_log ul
    JOIN latest_date ld ON ld.latestLift = ul.liftdate
    LEFT JOIN lift_and_equipment_combos lc ON lc.wkout_id = ul.ul_lift_id
      AND lc.equip_id = ul.ul_equip_id
    WHERE liftdate = ld.latestLift
      AND ld.user_id = ${user_id}`
  ).spread( (results, metadata) => {
    
  })
}
  
  // ****next I need to determine whether they were upper or lower region
  // if upper, query for 5 random lower, vice versa
  const generateSuggestion = () => {
    sequelize.query(
      `SELECT *
      FROM lift_and_equipment_combos lc
      LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
        AND lc.equip_id = ul.equipment_id
        AND ul.user_id = ${userid}
      WHERE lc.region LIKE '%lower%'
      ORDER BY RANDOM() LIMIT 5`
    ).spread( (results, metadata) => {
      console.log(results);
    })
  }