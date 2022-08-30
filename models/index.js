const sequelize = require('../util/database')
const Users = require("./users")
const Auth = require("./auth")
const Post = require("./post")

Users.hasOne(Auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        allowNull: false,
        unique: true,
    }
})
Users.hasMany(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        allowNull: false,
        primaryKey: true,
    }
})



module.exports = {
    Users,
    Auth,
    Post,
}