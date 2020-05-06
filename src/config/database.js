require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "dialect": 'mysql',
    "host": 'localhost',
    "username": 'root',
    "password": '',
    "database": 'dvora',
    "define": {
      timestamp: true,  //created_at, updated_at
    },

  },
}