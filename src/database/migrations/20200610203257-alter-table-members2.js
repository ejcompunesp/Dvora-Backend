'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>{
      return Promise.all([
        queryInterface.changeColumn('Members', 'board', {
          type: Sequelize.INTEGER,
          allowNull: true
        }, { transaction: t }),
        queryInterface.renameColumn('Members', 'board', 'boardId', { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('Members', 'boardId', {
          type: Sequelize.STRING,
          allowNull: false
        }, { transaction: t }),
        queryInterface.renameColumn('Members', 'boardId', 'board', { transaction: t })
      ])
    })
  }
};
