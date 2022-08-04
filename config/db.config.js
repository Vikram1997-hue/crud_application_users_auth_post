require('dotenv').config()
const {Pool} = require('pg')


// //ALTERNATELY - 
// const credentials = {
//     host: process.env.HOST,
//     port: process.env.PORT,
//     user: process.env.user,
//     database: process.env.DATABASE,
//     password: process.env.PASSWORD
// }

// const pool = new Pool(credentials)

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.user,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

module.exports = pool;