require('dotenv').config()
module.exports = {
  "type": "mysql",
  "host": process.env.DATABASE_HOST || "localhost",
  "port": 3306,
  "username": "exampleuser",
  "password": "examplepass",
  "database": "exampledb",
  "schema": "",
  "synchronize": false,
  "logging": false,
  "entities": [
    "testlibraries/entities/**/*.ts"
  ],
  "migrations": [
    "testlibraries/migration/**/*.ts"
  ],
  "subscribers": [
    "testlibraries/subscriber/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "testlibraries/entities",
    "migrationsDir": "testlibraries/migration",
    "subscribersDir": "testlibraries/subscriber"
  }
}
