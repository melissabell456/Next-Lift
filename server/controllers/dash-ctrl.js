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
// TODO: what if a user's suggestion is already generated, but the user has logged a lift more recently?.. could check date on suggestion to see if it is newer than the suggested lift. if so, regenerate
// TODO: BOTH new and old suggestions need to be joined with user's logged lifts prior to printing
// TODO: new suggestions need to go get the user requested lifts too and should have access to that boolean.
module.exports.renderDashView = (req, res, next) => {
  evaluateExistingSuggestion(req.user.id)
  .then( appGeneratedSuggestion => {
    if(appGeneratedSuggestion.length > 0) {
      getCombinedSuggestion(req.user.id)
      .then( suggestedLift => {
        res.render('user-dash', { suggestedLift, status: "suggestion"  });
      })
    }
    else {
      return getLastLift(req.user.id)
      .then( userLiftData => {
        return getSplitCondition(userLiftData)
        .then( ({ upper, lower }) => {
          return generateSuggestion(upper > lower ? "lower" : "upper", req.user.id )
          .then( suggestedLift => {
            let liftPosts = [];
            suggestedLift.forEach( lift => {
              liftPosts.push(storeUserSuggestedLift(lift, false, req.user.id))
            })
            res.render('user-dash', { suggestedLift, status: "suggestion" });
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
      console.log(results, "WILL SEND TO DASH");
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
        WHERE lc.region LIKE '%${splitCondition}%'
        ORDER BY RANDOM() LIMIT 5`
      ).spread( (results, metadata) => {
        resolve(calculateLiftStats(results));
      })
    })
  }



  // calculates suggested rep and weight for lifts previously attempted
  const calculateLiftStats = (suggestedLifts) => {
    console.log(suggestedLifts);
    return new Promise( (resolve, reject) => {
      resolve(suggestedLifts.map( lift => {
        if(lift.createdAt !== null) {
          lift.rep_count >= 12 ? (
            lift.s_rep_count = 8, 
            lift.s_weight = (lift.weight + 5)) :
          (lift.s_rep_count = (lift.rep_count + 2), 
          lift.s_weight = lift.weight);
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