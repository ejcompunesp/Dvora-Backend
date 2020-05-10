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
      dutyDate: DataTypes.DATE,
      dutyTime: DataTypes.INTEGER,
    },
      {
        sequelize: connection
      })
  }
  static associate(models) {
    this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'jes' });
    this.hasMany(models.Duty, { foreignKey: 'memberId', as: 'duties' });
    this.belongsToMany(models.Project, { foreignKey: 'projectId', through: 'memberProjects', as: 'projects' });
  }
}

module.exports = Member;