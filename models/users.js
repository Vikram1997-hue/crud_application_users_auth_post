const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Auth = require('./auth');
const Post = require('./post');

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: Sequelize.STRING(30),
    },
    email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING(61),
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING(5),
        defaultValue: 'USER',
    },
    jwt: {
        type: Sequelize.TEXT,
    },
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
});

module.exports = Users;
