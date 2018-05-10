CREATE VIEW lift_and_equipment_combos
AS
SELECT 
  l.id AS lift_id,
  l.name AS liftName,
  l.motion,
  l.type,
  l.region,
  e.id AS equipment_id,
  e.name AS equip
FROM lifts l
JOIN lift_equipment le ON le.lift_id = l.id
JOIN equipment e ON le.equipment_id = e.id

SELECT * FROM lift_and_equipment_combos
DROP VIEW lift_and_equipment_combos

CREATE VIEW user_log
AS
SELECT 
  user_id, 
  lift_id, 
  equipment_id, 
  MAX(to_char("createdAt", 'MM-DD-YYYY')) as liftDate
FROM user_lift
GROUP BY user_id, lift_id, equipment_id

SELECT * FROM user_log
DROP VIEW user_log

/////
CREATE VIEW lift_and_equipment_combos
AS
SELECT 
  l.id AS lift_id,
  l.name AS liftName,
  l.motion,
  l.type,
  l.region,
  e.id AS equipment_id,
  e.name AS equip
FROM lifts l
JOIN lift_equipment le ON le.lift_id = l.id
JOIN equipment e ON le.equipment_id = e.id

SELECT * FROM lift_and_equipment_combos

CREATE VIEW user_log
AS
SELECT 
  user_id as ul_user_id, 
  lift_id as ul_lift_id, 
  equipment_id ul_equip_id, 
  MAX(to_char("createdAt", 'MM-DD-YYYY')) as liftDate
FROM user_lift ul
GROUP BY ul_user_id, ul_lift_id, ul_equip_id

SELECT * FROM user_log
DROP VIEW user_log
//// V3

CREATE VIEW lift_and_equipment_combos
AS
SELECT 
  l.id AS wkout_id,
  l.name AS liftName,
  l.motion,
  l.type,
  l.region,
  e.id AS equipment_id,
  e.name AS equip
FROM lifts l
JOIN lift_equipment le ON le.lift_id = l.id
JOIN equipment e ON le.equipment_id = e.id

SELECT * FROM lift_and_equipment_combos
DROP VIEW lift_and_equipment_combos

CREATE VIEW user_log
AS
SELECT 
  user_id as ul_user_id, 
  lift_id as ul_lift_id, 
  equipment_id ul_equip_id, 
  MAX(to_char("createdAt", 'MM-DD-YYYY')) as liftDate
FROM user_lift ul
GROUP BY ul_user_id, ul_lift_id, ul_equip_id

SELECT * FROM user_log
DROP VIEW user_log

SELECT * 
    FROM lift_and_equipment_combos ap
    LEFT JOIN user_log ul ON ul.ul_lift_id = ap.wkout_id AND ul.ul_equip_id = ap.equipment_id
    LEFT JOIN user_lift u ON ul.ul_user_id = u.user_id 
      AND ul.ul_lift_id = u.lift_id 
      AND ul.ul_equip_id = u.equipment_id 
      AND ul.liftDate = to_char(u."createdAt", 'MM-DD-YYYY')
    WHERE (ul.ul_user_id = 1 OR ul.ul_user_id IS NULL)
--       AND ap.${req.query.column} ILIKE '%${req.query.term}%'