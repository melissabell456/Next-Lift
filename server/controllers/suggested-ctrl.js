'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);
const { storeUserSuggestedLift } = require('./log-ctrl');

// TODO: where do I add the rejects for all of these promises? does this need a res.end? JOE 
module.exports.renderView = (req, res, next) => {
  evaluateExistingSuggestion(req.user.id)
  .then( appGeneratedSuggestion => {
    if(appGeneratedSuggestion.length > 0) {
      getCombinedSuggestion(req.user.id)
      .then( combinedSuggestedLift => {
        calculateLiftStats(combinedSuggestedLift)
        .then( suggestedLift => {
          res.render('next-suggested', { suggestedLift, status: "suggestion"  });
        })
      })
    }
    else {
      return getLastLift(req.user.id)
      .then( userLiftData => {
        return getSplitCondition(userLiftData)
        .then( ({ upper, lower }) => {
          console.log("upper", upper, "lower", lower);
          return generateSuggestion(upper > lower ? "lower" : "upper", req.user.id )
          .then( suggestedLift => {
            let liftPosts = [];
            suggestedLift.forEach( lift => {
              liftPosts.push(storeUserSuggestedLift(lift, false, req.user.id))
            })
            res.render('next-suggested', { suggestedLift, status: "suggestion" });
            Promise.all(liftPosts)
            .then( results => {
              // res.end();
            })
          })
        })
      })
    }
  })
  .catch( err => {
    next(err);
  })
}

// gets user's current suggestion and checks to ensure they are not user added lifts
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
      LEFT JOIN lift_and_equipment_combos lc ON sul.lift_id = lc.wkout_id
        AND sul.equipment_id = lc.equip_id
	    LEFT JOIN user_log ul ON sul.lift_id = ul.ul_lift_id 
	      AND sul.equipment_id = ul.ul_equip_id
	      AND sul.user_id = ul.ul_user_id
      WHERE user_id = ${user_id}`
    ).spread( (results, metadata) => {
      resolve(results);
    })
  })
}

// afterthis gets all data from users most recent lift to determine suggested split of next lift
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
  
  // evaluates last lift to define split condition for suggested lift
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
  
  // TODO: Conditional should only be getting the user_lift with the max date...
  // suggests 5 random lifts based on split condition
  const generateSuggestion = (splitCondition, user_id) => {
    return new Promise( (resolve, reject) => {
      sequelize.query(
        `SELECT *
        FROM lift_and_equipment_combos lc
        LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
          AND lc.equip_id = ul.equipment_id
          AND ul.user_id = ${user_id}
        LEFT JOIN user_log ulo ON lc.wkout_id = ulo.ul_lift_id
          AND lc.equip_id = ulo.ul_equip_id
          AND ulo.ul_user_id = ${user_id}
        WHERE lc.region LIKE '%${splitCondition}%'
        ORDER BY RANDOM() LIMIT 5`
      ).spread( (results, metadata) => {
        resolve(calculateLiftStats(results));
      })
    })
  }



  // calculates suggested rep and weight for lifts previously attempted
  const calculateLiftStats = (suggestedLifts) => {
    return new Promise( (resolve, reject) => {
      resolve(suggestedLifts.map( lift => {
        if(lift.createdAt !== null) {
          lift.maxreps >= 12 ? (
            lift.s_rep_count = 8, 
            lift.s_weight = (lift.maxweight + 5)) :
          (lift.s_rep_count = (lift.maxreps + 2), 
          lift.s_weight = lift.maxweight);
          return lift;
        }
        else{
          lift.s_rep_count = null;
          lift.s_weight = null;
          return lift;
        }
      }))
    })
  }

module.exports.renderSimilarLiftsView = (req, res, next) => {
  console.log(req.query);
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM lift_and_equipment_combos ap
      LEFT JOIN user_log ul ON ul.ul_lift_id = ap.wkout_id AND ul.ul_equip_id = ap.equip_id
      LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
        AND ul.ul_lift_id = u.lift_id 
        AND ul.ul_equip_id = u.equipment_id 
        AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
      WHERE (ul.ul_user_id = ${req.user.id} OR ul.ul_user_id IS NULL)
        AND ap.liftname ILIKE '%${req.query.liftName}%'`
      ).spread((results, metadata) => {
      res.render('similar-lifts', { results, state: "similar", term: req.query.liftName });
      })
  })
}