// const Post = require("../models/posts")
const sequelize = require('../util/database');

// sequelize.sync({force: true}).then(result => {
//     console.log(result)
// }).catch((err) => {
//     console.error("Error in Sequelize sync attempt", err)
// })

const createPost = (req, res) => {

};

module.exports = {
    createPost,
};
