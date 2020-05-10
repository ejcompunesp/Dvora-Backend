const { Model, DataTypes } = require('sequelize');

class Project extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
      value: DataTypes.FLOAT,
      startDate: DataTypes.DATE,
      deliveryDate: DataTypes.DATE,
    },
      {
        sequelize: connection,
      })
  }
  static associate(models) {
    this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'jes' });
    this.belongsToMany(models.Member, { foreignKey: 'memberId', through: 'memberProjects', as: 'members' });
  }
}

module.exports = Project;