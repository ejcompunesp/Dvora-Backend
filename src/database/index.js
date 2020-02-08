const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const Ej = require('../models/Ej');

const connection = new Sequelize(dbConfig);

Ej.init(connection);

module.exports = connection;