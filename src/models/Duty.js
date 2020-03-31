const { Model, DataTypes } = require('sequelize');
//const Member = require('./Member')

class Duty extends Model {
  static init(connection) {
    super.init({
      //memberId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      updatedAt: DataTypes.DATE,
    }, {
      sequelize: connection
    })
  }

  static associate(models) {
    this.belongsTo(models.Member, { foreignKey: 'memberId', as: 'members' })
  }

  // static associate(models) {
  //   this.belongsToMany(models.Member, { foreignKey: 'dutyId', through: 'memberDuties', as: 'members' });
  // }
}



module.exports = Duty;