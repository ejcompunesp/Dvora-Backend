const { Model, DataTypes } = require('sequelize');

class Je extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      university: DataTypes.STRING,
      image: DataTypes.STRING,
      creationYear: DataTypes.STRING,
    },
      {
        sequelize: connection,
      })
  }

  // static generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

  // static validPassword = (password, hash) => bcrypt.compareSync(password, hash);
}

module.exports = Je;