const pool = require("../config/db.config")



const getAuth = (req, res) => {
    pool.query("select * from auth", (err, result) => {
        if(err) {
            console.error("Error in /auth/get:", err)
            return
        }
        res.send(result.rows)
    })
}

const updateAuth = (req, res) => {
    pool.query(`update auth set phone_number = ${req.query.phone_no} 
    where id='${req.query.searchId}'`, (err, result) => {
        if(err) {
            console.error("Error in /auth/put:", err)
            return
        }
        res.redirect("/auth/get")
    })   
}

module.exports = {
    getAuth,
    updateAuth
}