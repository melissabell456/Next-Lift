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
        return getSplitCondition(userLiftData)
        .then( ({ upper, lower }) => {
          return generateSuggestion(upper > lower ? "lower" : "upper", req.user.id )
          .then( suggestedLift => {
            console.log("YEEE after suggestor", suggestedLift);
            res.render('user-dash', { suggestedLift });
          })
        })
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
  const getSplitCondition = (previousUserLift) => {
    return new Promise( (resolve, reject) => {
      let upperRegion = [];
      let lowerRegion = [];
      previousUserLift.forEach( lift => {
        lift.region === "upper" ?
          upperRegion.push(lift.liftname) : lowerRegion.push(lift.liftname);
      });
      resolve({ upper: upperRegion.length, lower: lowerRegion.length });
    })
  }
  
  // if upper, query for 5 random lower, vice versa
  const generateSuggestion = (splitCondition, user_id) => {
    return new Promise( (resolve, reject) => {
      console.log("split condition", splitCondition);
      sequelize.query(
        `SELECT *
        FROM lift_and_equipment_combos lc
        LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
          AND lc.equip_id = ul.equipment_id
          AND ul.user_id = ${user_id}
        WHERE lc.region LIKE '%${splitCondition}%'
        ORDER BY RANDOM() LIMIT 5`
      ).spread( (results, metadata) => {
        console.log("ZZZ BEFORE ADJUSTMENTS", results);
        resolve(calculateLiftStats(results));
      })
    })
  }

  const calculateLiftStats = (suggestedLifts) => {
    return new Promise( (resolve, reject) => {
      resolve(suggestedLifts.map( lift => {
        if(lift.createdAt !== null) {
          lift.rep_count > 12 ? (
            lift.s_rep_count = 8, 
            lift.s_weight = (lift.weight + 5)) :
          (lift.s_rep_count = (lift.rep_count + 2), 
          lift.s_weight = lift.weight);
          return lift;
        }
        else{
          lift.s_rep_count = 0;
          lift.s_weight = 0;
          return lift;
        }
      }))
    })
  }

  // next I need to look at previous rep ranges and suggest new weights/reps based on that