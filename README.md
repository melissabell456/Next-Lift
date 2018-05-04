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

## API Endpoints

1. Use ```search``` route for filtering lift db: 
  - GET ```search?name="NAME"``` to search by name
  - GET ```search?type="COMPOUND/ISOLATION"``` to filter by type
  - GET ```search?region="UPPER/LOWER"``` to filter by region
  - GET ```search?motion="PUSH/PULL"``` to filter by motion
