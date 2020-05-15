"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Feedbacks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      dutyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Duties", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      satisfaction: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productivity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mood: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monitoring: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Feedbacks");
  },
};
