const { Model, DataTypes } = require('sequelize');

class Project extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
    },
      {
        sequelize: connection,
      })
  }
  static associate(models) {
    this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'je' });
    this.belongsToMany(models.Member, { foreignKey: 'memberId', through: 'memberProjects', as: 'members' });
  }
}

module.exports = Project;