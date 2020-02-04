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
        instanceMethods: {

        }
      })
  }

  static generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  //   this.methods.generateHash = function (password) {
  //   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  // };

  static validPassword = password => bcrypt.compareSync(password, this.local.password);
  // this.methods.validPassword = function (password) {
  //   return bcrypt.compareSync(password, this.local.password);
  // };
}

module.exports = Member;