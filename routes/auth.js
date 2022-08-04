const express = require('express')
const router = express.Router()

const authController = require("../controllers/authController")


router.get("/get", authController.getAuth) //READ


// //DELETE -  NOT PART OF PROBLEM STATEMENT
// router.delete("/delete", (req, res) => {
//     pool.query(`delete from auth where user_id='${req.query.searchId}'`, (err) => {
//         if(err) {
//             console.error("Error in /auth/delete:", err)
//             return
//         }
//         res.redirect("/auth/get")
//     })
// })



// //CREATE - technicaly outside project scope, but -
// //1. If user_id corresponds to some ID in users table - works
// //2. If said user_id already exists in auth - error 
// //3. If user_id not found in id column of users table - error.
// //Normally, no need for this since row is created automatically when a new row in users table is created.
// router.post("/post", (req, res) => {
//     pool.query(`insert into auth(id, phone_number, user_id) 
//     values(uuid_generate_v4(), '${req.query.phone_no}', '${req.query.userId}')`, (err, result) => {
//         if(err) {
//             console.error("Error in /auth/post:", err);
//             return
//         }
//         res.redirect("/auth/get");
//     })
// })


router.put("/put", authController.updateAuth)



module.exports = router;
