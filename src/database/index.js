const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Je = require('../models/Je');
const Member = require('../models/Member');
const Project = require('../models/Project');
const Duty = require('../models/Duty');

const connection = new Sequelize(dbConfig);

Je.init(connection);
Member.init(connection);
Project.init(connection);

Je.associate(connection.models);
Member.associate(connection.models);
Project.associate(connection.models);
Duty.init(connection);

module.exports = connection;