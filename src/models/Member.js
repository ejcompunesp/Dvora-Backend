const { Model, DataTypes } = require('sequelize');

class Member extends Model {
  static init(connection) {
    super.init({
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      board: DataTypes.STRING,
      position: DataTypes.STRING,
      sr: DataTypes.STRING,
      image: DataTypes.STRING,
    },
      {
        sequelize: connection,
      })
  }
  static associate(models) {
    this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'je' });
  }
}

module.exports = Member;