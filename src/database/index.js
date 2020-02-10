const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const Je = require('../models/Je');

const connection = new Sequelize(dbConfig);

Je.init(connection);

module.exports = connection;