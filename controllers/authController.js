const pool = require("../config/db.config")



const getAuth = (req, res) => {
    
    let q = "SELECT * FROM auth "
    if(req.query.searchId)
        q = q + "WHERE id = '" + req.query.searchId + "'"
        
    pool.query(q, (err, result) => {
        if(!result)
            res.send("No matching user(s) could be found")
        if(err) {
            console.error("Error in /auth/get:", err)
            return
        }
        res.send(result.rows)
    })
}

const updateAuth = (req, res) => {
    pool.query(`UPDATE auth SET phone_number = ${req.query.phone_no} 
    WHERE id='${req.query.searchId}'`, (err, result) => {
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