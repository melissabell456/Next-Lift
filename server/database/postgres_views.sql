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