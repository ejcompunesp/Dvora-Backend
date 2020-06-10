"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Members",
      [
        {
          id: 1,
          jeId: 1,
          email: "viniciusvedovotto@ejcomp.com",
          password: "54812652654",
          name: "Vinicius Vedovotto",
          boardId: 1,
          position: "Projetos",
          sr: "171257499",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          jeId: 1,
          email: "leoyogurte@ejcomp.com",
          password: "5651545565",
          name: "Leonardo Yogurte",
          boardId: 1,
          position: "Projetos",
          sr: "171257333",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          jeId: 2,
          email: "joseplinio@ejcomp.com",
          password: "plinioze",
          name: "Jose Plinio",
          boardId: 1,
          position: "ADMIR DA POHA TODA",
          sr: "171254515",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          jeId: 1,
          email: "erickzadap@ejcomp.com",
          password: "69",
          name: "Erick Zada P",
          boardId: 1,
          position: "ADMIR DE PROJETOS",
          sr: "171254520",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          jeId: 2,
          email: "sushizada@ejcomp.com",
          password: "8",
          name: "Sushi Zada",
          boardId: 1,
          position: "ADMIR",
          sr: "171254211",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Members", null, {});
  },
};
