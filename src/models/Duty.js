const { Model, DataTypes } = require('sequelize');

class Duty extends Model {
  static init(connection) {
    super.init({
      status: DataTypes.INTEGER,
      elapsedTime: DataTypes.INTEGER
    }, {
      sequelize: connection
    })
  }

  static associate(models) {
    this.belongsTo(models.Member, { foreignKey: 'memberId', as: 'members' })
  }

}


module.exports = Duty;