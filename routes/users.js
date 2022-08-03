const express = require('express')
const router = express.Router()
const pool = require("../config/db.config")



router.post("/post", (req,res) => {
    
    pool.query(`WITH auto_insert AS(insert into users(id, name, email) 
    values(uuid_generate_v4(), '${req.query.name}', '${req.query.email}') returning id)
    insert into auth(id, user_id) values(uuid_generate_v4(), (select id from auto_insert))`, 
    (err, result) => {
        if(err) {
            console.error("Error in /users/post:", err)
            return
        }
        res.redirect("/users/get")
    })
}) //CREATE


router.get("/get", (req, res) => {

    pool.query("select * from users", (err, result) => {
        if(err) {
            console.error("Error in /users/get:", err)
            return
        }
        res.send(result.rows)
    })
}) //READ


router.put("/put", (req, res) => {
    let q = "update users set ";
    let commaNeeded = false
    if(req.query.hasOwnProperty('name')) {
        q = q + "name = '" + req.query.name + "' "
        commaNeeded = true
    }
    if(req.query.hasOwnProperty('email')) {
        if(commaNeeded)
            q = q + ", "
        q = q + "email = '" + req.query.email + "' "
    }
    q = q + "where id = '" + req.query.searchId + "'";
    console.log(q)

    pool.query(q, (err) => {
        if(err) {
            console.error("Error in /users/put:",err)
            return
        }
        res.redirect("/users/get")
    })    
}) //UPDATE


router.delete("/delete", (req, res) => {
    // let q = "delete from users where searchId = '"
    pool.query(`delete from users where id = '${req.query.searchId}'`, (err, result) => {
        if(err) {
            console.error("Error in /users/delete:", err)
            return
        }
        res.redirect("/users/get")
    })
})//DELETE

module.exports = router



