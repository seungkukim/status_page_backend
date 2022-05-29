const Sequelize = require('sequelize');

module.exports = class Status extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            operational : {
                type: Sequelize.BOOLEAN
            },
            service : {
                type: Sequelize.STRING(63)
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Status',
            tableName: 'status',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {}
}