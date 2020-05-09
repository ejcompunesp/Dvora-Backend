const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Je = require("../models/Je");
const Member = require("../models/Member");
const Duty = require("../models/Duty");
const Feedback = require("../models/Feedback");

const connection = new Sequelize(dbConfig);

Je.init(connection);
Member.init(connection);
Duty.init(connection);
Feedback.init(connection);

Je.associate(connection.models);
Member.associate(connection.models);
Duty.associate(connection.models);
Feedback.associate(connection.models);

module.exports = connection;
