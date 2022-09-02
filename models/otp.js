const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Otp = sequelize.define('otp', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
        type: Sequelize.UUID,
        // allowNull: false, // we'll have to define this during associations, so don't do it here
        // primaryKey: true,
        // unique: true,
    },
    otp: {
        type: Sequelize.STRING(6),
        allowNull: false,
    },
    jwt: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
});

module.exports = Otp;
