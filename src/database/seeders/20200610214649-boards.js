'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Boards', [
      {
        jeId: 1,
        name: 'Presidencia'
      }, {
        jeId: 1,
        name: 'Adm'
      }, {
        jeId: 1,
        name: 'RH'
      }, {
        jeId: 1,
        name: 'Fin'
      }, {
        jeId: 1,
        name: 'Mkt'
      }, {
        jeId: 1,
        name: 'Proj'
      }, {
        jeId: 2,
        name: 'Presidencia'
      }, {
        jeId: 2,
        name: 'Adm'
      }, {
        jeId: 2,
        name: 'RH'
      }, {
        jeId: 2,
        name: 'Fin'
      }, {
        jeId: 2,
        name: 'Mkt'
      }, {
        jeId: 2,
        name: 'Proj'
      }, {
        jeId: 3,
        name: 'Presidencia'
      }, {
        jeId: 3,
        name: 'Adm'
      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Boards', null, {});
  }
};
