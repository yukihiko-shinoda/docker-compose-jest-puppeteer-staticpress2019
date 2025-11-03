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
  "entities": [
    "testlibraries/entities/**/*.ts"
  ],
  "migrations": [
    "testlibraries/migration/**/*.ts"
  ],
  "subscribers": [
    "testlibraries/subscriber/**/*.ts"
  ],
}
export default dataSourceOptions;