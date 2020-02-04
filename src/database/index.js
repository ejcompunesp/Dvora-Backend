const Sequelize = require('sequelize');

const dbConfig = require('../config/database');

const Member = require('../models/Member');

const connection = new Sequelize(dbConfig);

module.exports = connection;