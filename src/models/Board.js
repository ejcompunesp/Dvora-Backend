const { Model, DataTypes } = require('sequelize') 

class Board extends Model {
    static init(connection) {
        super.init({
            name: DataTypes.STRING,
        }, 
        { sequelize: connection })
    }

    static associate(models) {
        this.hasMany(models.Member, { foreignKey: 'boardId', as: 'members' })
        this.belongsTo(models.Je, { foreignKey: 'jeId', as: 'je'})
    }
}

module.exports = Board
