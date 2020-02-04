const { Model, Datatypes } = require('sequelize');

class Member extends Model {
  static init(connection) {
    super.init({
      ra: Datatypes.INTEGER,
      name: Datatypes.STRING,
      email: Datatypes.STRING,
      role: Datatypes.STRING,
      image: Datatypes.STRING,
      board: Datatypes.STRING,
      about: Datatypes.STRING,
      password: Datatypes.STRING,
    },
      {
        sequelize: connection,
      })
  }
}

module.exports = Member;