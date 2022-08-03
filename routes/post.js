const express = require('express')
const router = express.Router();
const pool = require("../config/db.config")



//agenda - simple CRUD skeleton.



router.get("/get", (req, res) => {
    pool.query("select * from post", (err, result) => {
        if(err) {
            console.error("Error in /post/get:", err)
            return
        }
        res.send(result.rows)
    })
}) //READ


router.post("/post", (req, res) => { //USE COALESCE
    pool.query(`insert into post(id, user_id, post_title, image) 
    values(${req.query.id}, '${req.query.user_id}', '${req.query.post_title ?? "null"}', '${req.query.image ?? "null"}')`,
    (err, result) => {
        if(err) {
            console.error("Error in /post/post:",err)
            return
        }
        res.redirect("/post/get")
    })
}) //CREATE


router.put("/put", (req, res) => {
    let myQuery = "update post set ";
    let commaNeeded = false
    if(req.query.hasOwnProperty('post_title')) {
        myQuery = myQuery + "post_title = '" + req.query.post_title + "' " 
        commaNeeded = true
    }
    if(req.query.hasOwnProperty('image')) {
        if(commaNeeded)
            myQuery = myQuery + ", "
        myQuery = myQuery + "image = '" + req.query.image + "' "
    }
    myQuery = myQuery + "where id = " + req.query.id + " AND user_id = '" + req.query.user_id + "'";
    // res.send(myQuery)

    pool.query(myQuery, (err, result) => {
        if(err) {
            console.error("Error in /post/put:", err)
            return
        }
        res.redirect("/post/get")
    })
}) //UPDATE


router.delete("/delete", (req, res) => {
    console.log(req.query)
    pool.query(`delete from post where id=${req.query.id} AND user_id='${req.query.user_id}'`, (err, result) => {
        if(err) {
            console.error("Error in /post/delete:", err)
            return
        }
        res.redirect("/post/get")
    })
}) //DELETE




module.exports = router

