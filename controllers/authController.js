const Auth = require('../models/auth');
// const Post = require("../models/post")
const sequelize = require('../util/database');


// sequelize.sync({force: true}).then(result => {
//     console.log(result)
// }).catch((err) => {
//     console.error("Error in Sequelize syncing attempt", err)
// })




const getAuth = (req, res) => {
    res.send('All auth details will be printed here');
};



module.exports = {
    getAuth,
};
