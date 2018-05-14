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
  // gets user's current suggestion and checks to ensure they are not all user added lifts
  console.log(req.user.id, "where is my user xxxxx");
  evaluateExistingSuggestion(req.user.id)
  .then( appGeneratedSuggestion => {
    if(appGeneratedSuggestion.length > 0) {
      getCombinedSuggestion(req.user.id)
      .then( combinedResults => {
        res.render('user-dash', combinedResults);
      })
    }
    else {
      // res.render('user-dash');
      return getLastLift(req.user.id)
      .then( userLiftData => {
        console.log(userLiftData);
      //   return parseLastLift(userLiftData)
      //   .then( splitCondition => {
      //     return generateSuggestion(splitCondition)
      //     .then( suggestedLift => {
      //       res.render('whatever', suggestedLift);
      //     })
      //   })
      })
    }
})
  // get suggested lift, if no suggested lift:
  // getLastLift(user_id) TODO: WHAT IF THERE IS NO LAST LIFT?
  // parseLastLift()
  // generateSuggestion and (lifts and rep range)
  // display to user
  // postSuggestion to DB
}


const evaluateExistingSuggestion = (user_id) => {
  console.log("is the user;s suggestion only user generated?");
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM suggested_user_lift sul
      WHERE user_id = ${user_id} AND sul.user_added = false`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
}

// gets all of suggested lifts including user added lifts for display in pug template
const getCombinedSuggestion = (user_id) => {
  console.log("going to get all suggestions not just app generated");
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM suggested_user_lift sul
      WHERE user_id = ${user_id}`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
}

// ****this gets all of users most recent lifts
const getLastLift = (user_id) => {
  console.log(user_id, "ZZZZ");
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM user_log ul
      JOIN latest_date ld ON ld.latestLift = ul.liftdate
      LEFT JOIN lift_and_equipment_combos lc ON lc.wkout_id = ul.ul_lift_id
        AND lc.equip_id = ul.ul_equip_id
      WHERE liftdate = ld.latestLift
        AND ld.user_id = ${user_id}`
    ).spread( (results, metadata) => {
      resolve(results);
    })
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