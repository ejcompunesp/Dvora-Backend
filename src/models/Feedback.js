const { Model, DataTypes } = require("sequelize");

class Feedback extends Model {
  static init(connection) {
    super.init(
      {
        satisfaction: DataTypes.INTEGER,
        productivity: DataTypes.INTEGER,
        mood: DataTypes.INTEGER,
        note: DataTypes.STRING,
        activity: DataTypes.STRING,
      },
      {
        sequelize: connection,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Duty, { foreignKey: "dutyId", as: "feedback" });
  }
}

module.exports = Feedback;
