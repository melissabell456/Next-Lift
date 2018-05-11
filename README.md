# tr-obot

## What is tr-obot?

#### tr-obot is a web app that predicts/suggests workouts for a specific user including weight and rep-range for each lift.

## How does tr-obot know what to suggest for me?

#### tr-obot uses a standard weight lifting split/rep range and suggests workouts based on a user's previously logged workouts.

## Why tr-obot?

#### Many apps and websites suggest workouts/rep-ranges/weight based on what the 'average' person can do. What is average? Who defined that and how does it apply to an individual? These recommendations can cause injuries (if the suggested rep-range/weight is too much for the user) or a lack of progress(if the suggested rep-range/weight is too low for the user) which ultimately leads to feelings of discourgement and inadequacy. Because tr-obot only suggests workouts based on the current user, these custom work out plans will ensure progress and help to avoid injuries.

## To run tr-obot

1. Clone and pull down repository
1. Run npm install
1. Add Config directory and file in server directory (format below):

      ```
      {
        "development": {
          "username": "your username here",
          "password": "your password here",
          "database": "final-wrkout",
          "dialect": "postgres"
        },
        "test": {
          "username": "root",
          "password": null,
          "database": "database_test",
          "host": "127.0.0.1",
          "dialect": "mysql"
        },
        "production": {
          "username": "root",
          "password": null,
          "database": "database_production",
          "host": "127.0.0.1",
          "dialect": "mysql"
        }
      }

1. Run ``` node server/database/build_db.js ``` to build database (TODO: create script)
1. Set up below views in pgAdmin
  ```
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
```
```
CREATE VIEW user_log
AS
SELECT 
  user_id as ul_user_id, 
  lift_id as ul_lift_id, 
  equipment_id ul_equip_id, 
  MAX(to_char("createdAt", 'MM-DD-YYYY')) as liftDate
FROM user_lift ul
GROUP BY ul_user_id, ul_lift_id, ul_equip_id

```
```
CREATE VIEW latest_date
AS
SELECT user_id, MAX(to_char("createdAt", 'MM-DD-YYYY')) as latestLift
FROM user_lift
GROUP BY user_id
```

## API Endpoints

1. Use ```search``` route for filtering lift db: 
  -  to search by name: GET ```search?column=name&term=lift name```
  - to filter by type: GET ```search?column=type&term=compound or isolation```
  -  to filter by region: GET ```search?column=region&term=upper or lower```
  - to filter by motion: GET ```search?column=motion&term=push or pull```

