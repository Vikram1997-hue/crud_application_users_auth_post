const {Pool} = require('pg')
const credentials = {
    host: 'localhost',
    port: 5432,
    user: 'user_1',
    database: 'crud_users_post_auth',
    password: 'test123'
}

const pool = new Pool(credentials)
module.exports = pool;