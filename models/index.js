const sequelize = require('../util/database');
const Users = require('./users');
const Auth = require('./auth');
const Post = require('./post');
const Otp = require('./otp');

Users.hasOne(Auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'user_id',
        allowNull: false,
        unique: true,
    },
});
Users.hasMany(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'user_id',
        allowNull: false,
        primaryKey: true,
    },
});
Users.hasOne(Otp, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'user_id',
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
});

module.exports = {
    Users,
    Auth,
    Post,
    Otp,
};
