'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('Feedbacks', 'monitoring', {
          type: Sequelize.TINYINT,
          allowNull: false
        }, { transaction: t }),
        queryInterface.renameColumn('Feedbacks', 'monitoring', 'isMonitoringDone', { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('Feedbacks', 'isMonitoringDone', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.renameColumn('Feedbacks', 'isMonitoringDone', 'monitoring', { transaction: t })
      ])
    })
  }
};
