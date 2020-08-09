const { Model, DataTypes } = require('sequelize');

class Member extends Model {
  static init(connection) {
    super.init({
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      position: DataTypes.STRING,
      sr: DataTypes.STRING,
      image: DataTypes.STRING,
      isDutyDone: DataTypes.TINYINT,
      description: DataTypes.STRING,
    },
      {
        sequelize: connection
      })
  }
  static associate(models) {
    this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'je' }); //Pertence a uma JE
    this.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board' }); //Pertence a uma Direx
    this.hasMany(models.Duty, { foreignKey: 'memberId', as: 'duties' });
  }
}

module.exports = Member;