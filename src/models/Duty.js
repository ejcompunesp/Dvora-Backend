const { Model, DataTypes } = require('sequelize');

class Duty extends Model {
  static init(connection) {
    super.init({
      status: DataTypes.STRING,
      completedAt: DataTypes.DATE,
    },
      {
        sequelize: connection,
      })
  }
  static associate(models) {
    this.belongsToMany(models.Member, { foreignKey: 'dutyId', through: 'memberDuties', as: 'members' });
  }
}

module.exports = Duty;