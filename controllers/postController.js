const pool = require("../config/db.config")
const jwt = require("jsonwebtoken")
require('dotenv').config()



const viewPosts = (req, res) => {

    if(!req.headers.authorization) {
        console.error(new Error("Send appropriate data in Authorization header"))
        return
    }

    //access the token
    const receivedJWT = req.headers.authorization.split(' ')[1];
    // console.log("attempting to print JWT:", receivedJWT)
    
    //check if it even exists
    if(receivedJWT == null) {//means no JWT was provided
        console.error(new Error("Session expired, log in again to gain access"))
        return
    }
    
    jwt.verify(receivedJWT, process.env.JWT_KEY_SECRET, async (err, user) => {
        if(err) {
            console.error("Something went wrong:", err);
            return
        }
        // console.log(user)

        //authentication complete
        try {
            
            if(user.userType == 'USER') {
            
                const result = await pool.query(`SELECT * FROM post WHERE user_id = '${user.id}' 
                AND post_status <> 'DELETED'`);
                
                const result2 = await pool.query(`SELECT * FROM post WHERE user_id <> '${user.id}'
                AND post_status ilike 'approved'`);

                // console.log(result.rows)
                // console.log(result2.rows)
                const result3 = [...result.rows, ...result2.rows];
                res.send(result3.length == 0 ? "No posts to show!" : result3)
            }

            else if(user.userType == 'ADMIN') {

                const result = await pool.query(`SELECT * FROM post`)
                res.send(result.rows)
            }
        }
        catch(err) {
            console.error("Error in viewPosts:", err)
        }
        
    });

    // let q = `SELECT * FROM post WHERE user_id = '${re}'`;
    // if(req.query.searchId)
    //     q = q + `where id = ${req.query.searchId}`
    // pool.query(q, (err, result) => {
    //     if(!result || result.rowCount == 0) 
    //         res.send("No matching user(s) could be found")
    //     else if(err) {
    //         console.error("Error in /post/get:", err)
    //         return
    //     }
    //     else
    //         res.send(result.rows)
    // })
} //viewPosts



//ORIGINAL GET METHOD OF CRUD, IF ANYONE IS INTERESTED
const getPost = (req, res) => {

    let q = "SELECT * FROM post "
    if(req.query.searchId)
        q = q + `WHERE id = ${req.query.searchId}`
    pool.query(q, (err, result) => {
        if(!result || result.rowCount == 0) 
            res.send("No matching user(s) could be found")
        else if(err) {
            console.error("Error in /post/get:", err)
            return
        }
        else
            res.send(result.rows)
    })
}

const getPostWithStatusFilter = (req, res) => { //allows filtering with searchId as well

    //check for admin only
    if(!req.headers.authorization) {
        console.error(new Error("Send appropriate data in Authorization header"))
        return
    }

    const receivedJWT = req.headers.authorization.split(' ')[1]
    if(receivedJWT == null) {
        console.error(new Error("Session expired, please log in and try again"))
        return
    }

    jwt.verify(receivedJWT, process.env.JWT_KEY_SECRET, (err, user) => {
        if(err) {
            console.error("Error in /post/post-with-status:", err)
            return
        }

        // now it's valid
        if(!user.userType || user.userType != 'ADMIN') {
            res.send("You don't have administrative privileges for this action!")
        }
    })



    if(!req.query || !req.query.status) {
        console.error(new Error("You must provide the status fiter"))
        return
    }

    

    let q = `SELECT * FROM post WHERE post_status ilike '${req.query.status}' `
    if(req.query.searchId)
        q = q + `AND user_id = '${req.query.searchId}'`

    console.log(q)
    pool.query(q, (err, result) => {
        if(!result || result.rowCount == 0) 
            res.send("No matching user(s) could be found")
        else if(err) {
            console.error("Error in /post/post-with-status:", err)
            return
        }
        else
            res.send(result.rows)
    })
}


const createPost = (req, res) => { 
    pool.query(`INSERT INTO post(id, user_id, post_title, image) 
    VALUES(${req.query.id}, '${req.query.user_id}', '${req.query.post_title ?? "null"}', '${req.query.image ?? "null"}')`,
    (err, result) => {
        if(err) {
            console.error("Error in /post/post:",err)
            return
        }
        res.redirect("/post/get")
    })
}


const updatePost = (req, res) => {
    
    if(!req.query.id || !req.query.user_id) {
        console.error(new Error("id and user_id are both required parameters"))
        return    
    }

    
    
    let myQuery = "UPDATE post SET ";
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
    

    myQuery = myQuery + "WHERE id = " + req.query.id + " AND user_id = '" + req.query.user_id + "'";
    // res.send(myQuery)

    pool.query(myQuery, (err, result) => {
        if(err) {
            console.error("Error in /post/put:", err)
            return
        }
        res.redirect("/post/get")
    })
}



const deletePost = (req, res) => {
    console.log(req.query)
    pool.query(`DELETE FROM post WHERE id=${req.query.id} AND user_id='${req.query.user_id}'`, (err, result) => {
        if(err) {
            console.error("Error in /post/delete:", err)
            return
        }
        res.redirect("/post/get")
    })
}


const postStatusChange = (req, res) => {

    if(!req.headers.authorization) {
        console.error(new Error("Send appropriate data in Authorization header"))
        return
    }
    //check if guy is admin using JWT
    const receivedJWT = req.headers.authorization.split(' ')[1]

    if(receivedJWT == null) {
        console.error("No JWT received")
        return
    }

    jwt.verify(receivedJWT, process.env.JWT_KEY_SECRET, async err => {
        if(err) {
            console.error("Error in /users/postApproval", err)
            return
        }


        const result = await pool.query(`SELECT * FROM users WHERE jwt = '${receivedJWT}'`)
        // console.log(result.ro)
        if(result.rowCount == 0 || result.rows[0].type == 'USER') {
            console.error(new Error("You don't have the necessary permissions for this action"))
            return
        }

        //if we're here -- guy is admin
        //in req.query params, we expect post_id, user_id, and desired status
        if(!req.query || !req.query.user_id || !req.query.post_id || !req.query.setStatus) {
            console.error(new Error("post_id, user_id, and desired status are compulsory parameters"))
            return
        }

        const editThisPost = await pool.query(`SELECT * FROM post WHERE id = ${req.query.post_id} AND user_id = '${req.query.user_id}'`)
        if(editThisPost.rowCount == 0) {
            console.error(new Error("No such post found!"))
            return
        }

        pool.query(`UPDATE post SET post_status = '${req.query.setStatus}' WHERE 
        id = ${req.query.post_id} AND user_id = '${req.query.user_id}'`, (err) => {
            if(err) {
                console.error("Error in /post/post-status-change:", err)
                return
            }
            res.send("Status changed!")
        })






        
        // //do the following as a select
        // if(!user.userType || user.userType != 'ADMIN') {
        //     console.error(new Error("You don't have the necessary permissions for this action"))
        //     return
        // }


    })

}

module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost,
    viewPosts,
    postStatusChange,
    getPostWithStatusFilter
}