'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

// TODO: where do I add the rejects for all of these promises?
module.exports.renderDashView = (req, res, next) => {
  getExistingSuggestion(req.user.id)
  .then( suggestedLift => {
    console.log(suggestedLift);
    if(suggestedLift.length > 0) {
      console.log(suggestedLift);
      res.render('user-dash');
    }
    else {
      console.log('no current suggestion', suggestedLift);
      res.render('user-dash');
      // return getLastLift(req.user.id)
      // .then( userLiftData => {
      //   return parseLastLift(userLiftData)
      //   .then( splitCondition => {
      //     return generateSuggestion(splitCondition)
      //     .then( suggestedLift => {
      //       res.render('whatever', suggestedLift);
      //     })
      //   })
      // })
    }
})
  // get suggested lift, if no suggested lift:
  // getLastLift(user_id) TODO: WHAT IF THERE IS NO LAST LIFT?
  // parseLastLift()
  // generateSuggestion and (lifts and rep range)
  // display to user
  // postSuggestion to DB
}


const getExistingSuggestion = (user_id) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * FROM suggested_user_lift
      WHERE user_id = 1`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
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
  const parseLastLift = () => {

  }
  
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

  // next I need to look at previous rep ranges and suggest new weights/reps based on that