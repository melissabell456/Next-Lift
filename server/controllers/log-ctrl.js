'use strict';

const Sequelize = require('sequelize');
var sequelize = new Sequelize({
  "username": "Melis",
  "password": "postgres",
  "database": "final-wrkout",
  "dialect": "postgres"
  }
);

module.exports.renderLiftForm = (req, res, next) => {
  const liftId = +(req.query.lift_id);
  const equipId = +(req.query.equip_id);
  sequelize.query(
    `SELECT * 
    FROM lift_and_equipment_combos ap
    LEFT JOIN user_log ul ON ul.ul_lift_id = ap.wkout_id AND ul.ul_equip_id = ap.equip_id
    LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
      AND ul.ul_lift_id = u.lift_id 
      AND ul.ul_equip_id = u.equipment_id 
      AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
    WHERE (ul.ul_user_id = ${req.user.id} OR ul.ul_user_id IS NULL)
      AND ap.wkout_id = ${liftId}
      AND ap.equip_id = ${equipId}
      ORDER BY ul.liftDate desc
      LIMIT 1`
  ).spread( (results, metadata) => {
    res.render('log-lift-form', { results } );
  })
}

module.exports.renderSuggestedLiftForm = (req, res, next) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `SELECT * 
      FROM suggested_user_lift sul
      LEFT JOIN lift_and_equipment_combos lc ON sul.lift_id = lc.wkout_id
        AND sul.equipment_id = lc.equip_id
	    LEFT JOIN user_log ul ON sul.lift_id = ul.ul_lift_id 
	      AND sul.equipment_id = ul.ul_equip_id
	      AND sul.user_id = ul.ul_user_id
      WHERE user_id = ${req.user.id}`
    ).spread( (results, metadata) => {
      res.render('suggested-lift-form', { results, status: "logSuggested" } );
    })
  })
}

const removeFromSuggested = ({ lift_id, user_id, equip_id }) => {
  sequelize.query(
    `DELETE FROM suggested_user_lift sul
      WHERE sul.user_id = ${user_id}
        AND sul.equipment_id = ${equip_id}
        AND sul.lift_id = ${lift_id}`
  ).spread( (results, metadata) => {
    console.log(results, "of deletionx");
    console.log(metadata, "of metadata deletionx");
  })
}

// TODO: prevent future dates from being logged
module.exports.recordLift = (req, res, next) => {
  return new Promise( (resolve, reject) => {
    sequelize.query(
      `INSERT INTO user_lift (id, lift_id, lift_equipment_id, user_id, equipment_id, weight, rep_count, "createdAt", "updatedAt")
      VALUES (DEFAULT, ${req.body.lift_id}, DEFAULT, ${req.user.id}, ${req.body.equipment_id}, ${req.body.weight}, ${req.body.rep_count}, (('${req.body.createdAt}') AT TIME ZONE 'UTC'), now())`
    ).spread( (results, metadata) => {
      console.log(results, "added?");
      resolve(results);
      res.redirect('/dashboard');
    })
  })
}

module.exports.storeUserSuggestedLift = (lift, userSourcedBool, user_id) => {
  return new Promise( (resolve, reject) => {
      sequelize.query(
        `INSERT INTO suggested_user_lift (id, user_id, lift_id, equipment_id, s_weight, s_rep_count, user_added, "createdAt", "updatedAt")
        VALUES (DEFAULT, ${user_id}, ${lift.wkout_id}, ${lift.equip_id}, ${lift.s_weight}, ${lift.s_rep_count}, ${userSourcedBool}, current_date, current_date)`
      ).spread( (results, metadata) => {
        resolve(results);
      })
  })
}

module.exports.parseSuggestedFormEntry = (req, res, next) => {
  console.log(req.body);
  let liftIds = req.body.lift_id;
  let recordEntries = [];
  let removeSuggestedRecords = [];
  for(let i=0; i<liftIds.length; i++) {
    let liftStats = {
      "lift_id": liftIds[i],
      "user_id": req.user.id,
      "equip_id": req.body.equipment_id[i],
      "rep_count": req.body.rep_count[i],
      "weight": req.body.weight[i],
      "createdAt": req.body.createdAt
    };
    recordEntries.push(recordSuggestedLift(liftStats));
    removeSuggestedRecords.push(removeFromSuggested(liftStats));
  }
  Promise.all(recordEntries)
  .then( results => {
    Promise.all(removeSuggestedRecords)
    .then( results => {
      console.log("deleted", results);
    })
  })
}

const recordSuggestedLift = ( { lift_id, user_id, equip_id, weight, rep_count, createdAt } ) => {
  sequelize.query(
    `INSERT INTO user_lift (id, lift_id, lift_equipment_id, user_id, equipment_id, weight, rep_count, "createdAt", "updatedAt")
    VALUES (DEFAULT, ${lift_id}, DEFAULT, ${user_id}, ${equip_id}, ${weight}, ${rep_count}, (('${createdAt}') AT TIME ZONE 'UTC'), current_date)`
  ).spread( (results, metadata) => {
    // TODO give feedback, redirect user
    return results;
    // console.log(metadata);
  })
}
