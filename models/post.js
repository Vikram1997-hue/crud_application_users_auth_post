const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        // primaryKey: 'huehuehue',
    },
    user_id: {
        type: Sequelize.UUID,
        /**
         * NO POINT WRITING THIS HERE; INSTEAD, DEFINE THIS IN INDEX.JS (WHERE YOU'RE
         * DEFINING YOUR ASSOCIATIONS)
         */

        // allowNull: false,
        primaryKey: true,
    },
    post_title: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    image: {
        type: Sequelize.TEXT,
    },
    post_status: {
        type: Sequelize.STRING(8),
        defaultValue: 'PENDING',
    },
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    // indexes: [
    //     {
    //         fields: ['user_id', 'id'],
    //         unique: true,
    //         primaryKey: true,
    //     }
    // ]
});

module.exports = Post;
