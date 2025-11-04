import { DataSourceOptions } from 'typeorm';
require('dotenv').config()
const dataSourceOptions: DataSourceOptions = {
  "type": "mysql",
  "host": process.env.DATABASE_HOST || "localhost",
  "port": 3306,
  "username": "exampleuser",
  "password": "examplepass",
  "database": "exampledb",
  "synchronize": false,
  "logging": false,
  // Empty entities array to avoid loading entities with decorators
  // We use raw queries instead to work around TypeScript 5.x decorator issues
  "entities": [],
  "migrations": [
    "testlibraries/migration/**/*.ts"
  ],
  "subscribers": [
    "testlibraries/subscriber/**/*.ts"
  ],
}
export default dataSourceOptions;