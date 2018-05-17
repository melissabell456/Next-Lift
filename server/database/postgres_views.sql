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
  e.id AS equip_id,
  e.name AS equip
FROM lifts l
JOIN lift_equipment le ON le.lift_id = l.id
JOIN equipment e ON le.equipment_id = e.id


CREATE VIEW user_log
AS
SELECT 
  user_id as ul_user_id, 
  lift_id as ul_lift_id, 
  equipment_id ul_equip_id, 
  MAX(to_char("createdAt", 'MM-DD-YYYY')) as liftDate
FROM user_lift ul
GROUP BY ul_user_id, ul_lift_id, ul_equip_id

CREATE VIEW latest_date
AS
SELECT user_id, MAX(to_char("createdAt", 'MM-DD-YYYY')) as latestLift
FROM user_lift
GROUP BY user_id

CREATE VIEW lift_muscle_associations
AS
SELECT l.name as associated_lift, l.id as lift_m_id, array_agg(m.name) as associated_muscles
FROM muscles m
JOIN lift_muscle lm ON lm.muscle_id = m.id
JOIN lifts l ON l.id = lm.lift_id
GROUP BY associated_lift, lift_m_id 

CREATE VIEW lift_primary_muscle
AS
SELECT l.name as associated_lift, l.id as lift_m_id, m.name as primary_muscle
FROM muscles m
JOIN lift_muscle lm ON lm.muscle_id = m.id
JOIN lifts l ON l.id = lm.lift_id
WHERE lm.primary = true
