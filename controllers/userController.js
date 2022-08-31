const bcrypt = require('bcryptjs');
const Joi = require('joi');
const Users = require('../models/users');
const sequelize = require('../util/database');
const userValidation = require('../validation/users/schema');



// sequelize.sync({force: true}).then(result => {
//     console.log("All is well! Result:",result)
// }).catch((err) => {
//     console.error("Error in userController sync attempt:", err)
// })


const getUsers = async (req, res) => {
    console.log('PRINTING REQ.QUERY.ID ---->', req.query.id);

    try {
        const validateAns = await userValidation.get.validateAsync({ id: req.query.id });
    } catch(err) {
        console.error(err);
        return res.status(400).send('Please enter a valid ID');
    }

    const ans = await Users.findAll();
    return res.status(200).send(ans);
}; // SIMPLE READ



const insertionOriginalScope = async (req, res) => {

    if(!req.body || !req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send('Send name, email, and password in req.body');
    }

    try {
        console.log(req.body.name, req.body.email, req.body.password);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('PRINTING HASH:', hashedPassword);
        let myUser;

        if(!req.body.type) {
            myUser = await Users.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            });
        } else {
            myUser = await Users.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                type: req.body.type,
            });
        }


        // auto-insertion into auth


        await myUser.save();
        return res.status(200).send('Insertion successful');
    } catch(err) {
        return res.status(500).send(`Error: ${err}`);
    }
}; // SIMPLE CREATE






//--------------------------------------------------------------------------------
// ADVANCED FUNCTIONS



module.exports = {
    getUsers,
    insertionOriginalScope,
};
