const Users = require("../models/users")
const sequelize = require("../util/database")
const bcrypt = require('bcryptjs')


// sequelize.sync({force: true}).then(result => {
//     console.log("All is well! Result:",result)
// }).catch(err => {
//     console.error("Error in userController sync attempt:", err)
// })


const getUsers = async (req, res) => {
    
    const ans = await Users.findAll()
    res.send(ans)
}//SIMPLE READ



const insertionOriginalScope = async (req, res) => {
    

    if(!req.body || !req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send("Send name, email, and password in req.body")
    }

    try {
        console.log(req.body.name, req.body.email, req.body.password)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log("PRINTING HASH:", hashedPassword)
        let myUser;

        if(!req.body.type) {
            myUser = await Users.create({name: req.body.name, email: req.body.email, password: hashedPassword})
        }

        else {
            myUser = await Users.create({name: req.body.name, email: req.body.email, password: hashedPassword, type: req.body.type})
        }


        //auto-insertion into auth 


        await myUser.save() 
        res.status(200).send("Insertion successful")
    }
    catch(err) {
        return res.status(500).send("Error: " + err)
    }
} //SIMPLE CREATE






//--------------------------------------------------------------------------------
//ADVANCED FUNCTIONS



module.exports = {
    getUsers,
    insertionOriginalScope
}