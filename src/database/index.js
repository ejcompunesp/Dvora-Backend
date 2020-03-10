const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Je = require('../models/Je');
const Member = require('../models/Member');

const connection = new Sequelize(dbConfig);

Je.init(connection);
Member.init(connection);

Je.associate(connection.models);
Member.associate(connection.models);

module.exports = connection;