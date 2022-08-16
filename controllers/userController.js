const pool = require("../config/db.config")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()




function jwtDBUpdate(user, isLogin) {

    //actually creating our JWT token
    try {
        if(isLogin) { //in case of login
            const currentSessionJWT = jwt.sign(user, process.env.JWT_KEY_SECRET, {
                expiresIn: '600000' //10 minutes 
            })
            pool.query(`UPDATE users SET jwt = '${currentSessionJWT}' WHERE id = '${user.id}'`, (err) => {
                if(err) {
                    console.error("Error in jwtDBUpdate() helper function:", err)
                    return
                }
            })
        }

        else {//in case of log out
            pool.query(`UPDATE users SET jwt = null WHERE id = '${user.id}'`, err => {
                if(err) {
                    console.error("Error in jwtDBUpdate() helper function", err)
                    return
                }
            })
        }
    }
    catch(err) {
        console.error("Error in jwtDBUpdate() helper function:", err)
        return
    }
}

async function passwordUpdate(newPassword, jwt) {

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    pool.query(`UPDATE users SET password = '${hashedPassword}' WHERE jwt = '${jwt}'`, err => {
        if(err) {
            console.error("Error in passwordUpdate() helper function:", err)
            return
        }
    })
}


const registration = async (req, res) => {

    if(!req.query.name || !req.query.email || !req.body || !req.body.password || !req.body.confirmPassword) {
        console.error(new Error("One or more of the required params are missing"))
        return
    }

    if(req.body.password.localeCompare(req.body.confirmPassword) != 0) {
        console.error(new Error("password and confirmPassword must be the same!"))
        return
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10) 

    pool.query(`WITH auto_insert AS(INSERT INTO users(id, name, email, password) 
    VALUES(uuid_generate_v4(), '${req.query.name}', '${req.query.email}', '${hashedPassword}') returning id)
    INSERT INTO auth(id, user_id) VALUES(uuid_generate_v4(), (SELECT id FROM auto_insert))`, 
    (err, result) => {
        if(err) {
            console.error("Error in /users/register:", err)
            return
        }
        res.send("Registration successful!")
    })

}



const loginUser = async (req, res) => {

    if(!req.body || !req.body.email || !req.body.password) {
        console.error(new Error("email and password are both compulsory fields"))
        return
    }

    let result = await pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`)
    if(result.rowCount == 0) {
        console.error(new Error("This email has not been registered. Please register and try again"));
        return
    }
    else if(!(await bcrypt.compare(req.body.password, result.rows[0].password))) {
        console.error(new Error("Incorrect password! Access denied."))
        return
    }
    
    //now we create our payload for JWT
    let user = {id: result.rows[0].id, userType: result.rows[0].type}
    jwtDBUpdate(user, true) //writing current session JWT to DB

    
    
    res.send("You have successfully logged in!")
    //BEFORE CALLING post/viewPosts: in the 'View Posts (after login)' request in Postman/Posts folder, 
    //pass JWT in header as --> 
    //      Authorizaton: Bearer <token> 
}


const logoutUser = (req, res) => {

    //I must've had received JWT token in Authorization header at this point
    if(!req.headers.authorization) {
        console.error(new Error("Send appropriate data in Authorization header"))
        return
    }
    
    const receivedJWT = req.headers.authorization.split(' ')[1];
    
    if(receivedJWT == null) { //no token exists
        console.error(new Error("No pre-existing session found, therefore cannot logout"))
        return
    }

    //token exists, but is it a valid token?
    jwt.verify(receivedJWT, process.env.JWT_KEY_SECRET, async (err, user) => {
        if(err) {
            console.error("Error in /users/logout:", err)
            return
        }

        //okay, it's a valid token. but is it the valid token corresponding to *this* user?
        const result = await pool.query(`SELECT * FROM users WHERE jwt = '${receivedJWT}'`)
        if(result.rowCount == 0 || result.rows[0].id != user.id) {
            console.error(new Error("Invalid JWT -- does not correspond to either current user or current session"))
            return
        }

        //everything is fine if we've reached here.
        jwtDBUpdate(user, false)
        res.send(`User has successfully logged out!`)
    })

}


const resetPassword = (req, res) => {

    //reset is only an option once you're already logged in. Thus, JWT in header is expected
    if(!req.headers.authorization) {
        console.error(new Error("Send appropriate data in Authorization header"))
        return
    }

    
    const receivedJWT = req.headers.authorization.split(' ')[1];

    //no token exists
    if(receivedJWT == null) {
        console.error(new Error("Session expired, please log in and try again"))
        return
    }

    jwt.verify(receivedJWT, process.env.JWT_KEY_SECRET, async (err, user) => {
        if(err) {
            console.error("Error in /users/reset-password:", err)
            return
        }

        //okay, it's a valid token
        /* One could argue that we shouldn't ask for old password, since if you're logged in, 
        you already know old password. But most sites I use still ask you for the old password
        during reset, probably as an additional layer of security, so we're going to 
        go with that.
        */

        try {
            //access oldPassword, newPassword, newPasswordConfirmed from req.body
            if(!req.body || !req.body.oldPassword || !req.body.newPassword || !req.body.newPasswordConfirmed) {
                console.error(new Error("oldPassword, newPassword, and newPasswordConfirmed are all compulsory fields"))
                return
            }

            //credential validation
            const result = await pool.query(`SELECT * FROM users WHERE id = '${user.id}'`)
            if(result.rowCount == 0) {
                console.error(new Error("Received JWT does not correspond to current session"))
                return
            }
            const passwordMatch = await bcrypt.compare(req.body.oldPassword, result.rows[0].password)
            if(passwordMatch == false) {
                console.error(new Error("Incorrect password provided"))
                return
            } 
            else if(req.body.newPassword.localeCompare(req.body.newPasswordConfirmed) != 0) {
                console.error(new Error("New password and Confirm New Password fields must match"))
                return
            }
        }
        catch(err) {
            console.error("Error in /users/reset-password:", err)
            return
        }
        //everything is definitely right if we're here
        //now update
        passwordUpdate(req.body.newPassword, receivedJWT)
        res.send("Password has been reset successfully!")
    })
}


const forgotPassword = async (req, res) => {

    //no JWT received (cuz the user doesn't remember old password)
    if(!req.body || !req.body.email || !req.body.newPassword || !req.body.newPasswordConfirmed) {
        console.error(new Error("email, newPassword, and newPasswordConfirmed are all compulsory fields"))
        return
    }

    if(req.body.newPassword.localeCompare(req.body.newPasswordConfirmed) != 0) {
        console.error("newPassword and newPasswordConfirmed must be same")
        return
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
    pool.query(`UPDATE users SET password = '${hashedPassword}' WHERE email = '${req.body.email}'`, err => {
        if(err) {
            console.error("Error in /users/forgot-password:", err)
            return
        }
        res.send("Password successfully changed!")
    })
}




const createUser = async (req,res) => {

    //checks for compulsory (non-nullable) request parameters
    if(!req.body || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) { //more optimized order of if condn. checking based on order of likelihood, keeping in mind that OR finds the first truthy value
        console.error(new Error("email and password are mandatory fields"))
        return
    }

    //repeating email or invalid email -- error
    // const re = new RegExp('')
    // if(req.query.email)
    

    //password hashing with brcrypt
    console.log("Password is =",req.body.password)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword)
    // console.log("Request object =", req) 

    console.log("Printing req.body --->", req.body)

    pool.query(`WITH auto_insert AS(INSERT INTO users(id, name, email, password) 
    VALUES(uuid_generate_v4(), '${req.query.name}', '${req.body.email}', '${hashedPassword}') returning id)
    INSERT INTO auth(id, user_id) VALUES(uuid_generate_v4(), (SELECT id FROM auto_insert))`, 
    (err, result) => {
        if(err) {
            console.error("Error in /users/post:", err)
            return
        }
        res.send("Registration successful!")
    })
}


const getUser = (req, res) => {

    let q = "SELECT * FROM users ";
    if(req.query.searchId)
        q = q + "WHERE id = '" + req.query.searchId + "'"

    pool.query(q, (err, result) => {
        if(!result) 
            res.send("No matching user(s) could be found") //FLAG: should this be a response or an error
        if(err) {
            console.error("Error in /users/get:", err)
            return
        }
        res.send(result.rows)
    })
}


const updateUser=(req, res) => {

    //all validations here

    let q = "UPDATE users SET ";
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
    q = q + "WHERE id = '" + req.query.searchId + "'";
    console.log(q)


    pool.query(q, (err) => {
        if(err) {
            console.error("Error in /users/put:",err)
            return
        }
        res.redirect("/users/get")
    })    
}

const deleteUser = (req, res) => {
    // let q = "delete from users where searchId = '"
    pool.query(`DELETE FROM users WHERE id = '${req.query.searchId}'`, (err, result) => {
        if(err) {
            console.error("Error in /users/delete:", err)
            return
        }
        res.redirect("/users/get")
    })
}




module.exports={
    createUser,
    getUser,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
    loginUser,
    logoutUser,
    registration
}