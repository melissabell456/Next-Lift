'use strict'

module.exports.renderDashView = (req, res, next) => {
  res.render('user-dash');
} 
// SELECT *
// FROM lift_and_equipment_combos lc
// LEFT JOIN user_lift ul ON lc.wkout_id = ul.lift_id
//   AND lc.equip_id = ul.equipment_id
// WHERE ul.user_id = 1