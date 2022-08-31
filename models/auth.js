const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Auth = sequelize.define('auth', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    phone_number: {
        type: Sequelize.NUMERIC(10, 0),
    },
    user_id: {
        type: Sequelize.UUID,
        /* NO POINT WRITING THIS HERE; INSTEAD, DEFINE THIS IN INDEX.JS (WHERE YOU'RE DEFINING
        YOUR ASSOCIATIONS)
        */
        // allowNull: false,
        // unique: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
});


module.exports = Auth;
