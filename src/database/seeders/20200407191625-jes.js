'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Jes', [
      {
        id: 1,
        name: 'EJComp',
        email: 'ejcomp@ejcomp.com',
        password: '12345678',
        university: 'FCT/UNESP',
        image: 'img1',
        city: 'Presidente Prudente - SP',
        creationYear: '2006',
        createdAt: new Date(),
        updatedAt: new Date(),
        dutyTime: 2
      }, 
      {
        id: 2,
        name: 'EJECart',
        email: 'ejecart@ejcomp.com',
        password: '87654321',
        university: 'FCT/UNESP',
        image: 'img2',
        city: 'Presidente Prudente - SP',
        creationYear: '2009',
        createdAt: new Date(),
        updatedAt: new Date(),
        dutyTime: 2
      }, 
      {
        id: 3,
        name: 'Opera Krios',
        email: 'ok@ejcomp.com',
        password: '2525456',
        university: 'FCT/UNESP',
        image: 'img3',
        city: 'Presidente Prudente - SP',
        creationYear: '2007',
        createdAt: new Date(),
        updatedAt: new Date(),
        dutyTime: 2
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Jes', null, {});
  }
};
