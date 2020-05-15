'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Duties', [{
      id: 1,
      memberId: 1,
      status: 1,
      elapsedTime: 7200,
      updatedAt: new Date,
      createdAt: new Date()
    },
    {
      id: 2,
      memberId: 1,
      status: 1,
      elapsedTime: 0,
      updatedAt: new Date,
      createdAt: new Date()
    }, {
      id: 3,
      memberId: 2,
      status: 1,
      elapsedTime: 5000,
      updatedAt: new Date,
      createdAt: new Date()
    }, {
      id: 4,
      memberId: 3,
      status: 0,
      elapsedTime: 0,
      updatedAt: new Date,
      createdAt: new Date()
    }, {
      id: 5,
      memberId: 3,
      status: 1,
      elapsedTime: 7200,
      updatedAt: new Date,
      createdAt: new Date()
    }, {
      id: 6,
      memberId: 3,
      status: 1,
      elapsedTime: 3000,
      updatedAt: new Date,
      createdAt: new Date()
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Duties', null, {});
  }
};
