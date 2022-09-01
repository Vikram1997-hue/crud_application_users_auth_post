const bcrypt = require('bcryptjs');
const Joi = require('joi');
const Users = require('../models/users');
const sequelize = require('../util/database');
const userValidation = require('../validation/users/schema');
const errorGenerator = require('../util/errors');


// sequelize.sync({force: true}).then(result => {
//     console.log("All is well! Result:",result)
// }).catch((err) => {
//     console.error("Error in userController sync attempt:", err)
// })


const getUsers = async (req, res) => {
    console.log('PRINTING REQ.QUERY.ID ---->', req.query.id);

    try {
        await userValidation.get.validateAsync({ id: req.query.id });
    } catch(err) {
        console.error(`${err} \tBHAI KA NAAAAAM: ${err.name}`);
        if(err.isJoi === true) {
            return res.status(422).send('Please enter required params in proper format');
        }
        return res.status(400).send('Please enter a valid ID');
    }

    const ans = await Users.findAll();
    return res.status(200).send(ans);
}; // SIMPLE READ



const register = async (req, res) => {
    // if(!req.body || !req.body.name || !req.body.email || !req.body.password) {
    //     res.status(400).send('Send name, email, and password in req.body');
    // }

    try {
        await userValidation.register.validateAsync({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        // console.log(req.body.name, req.body.email, req.body.password);
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
        if(!err.name.localeCompare('ValidationError')) {
            if(!err.message.substr(-8).localeCompare('required')) {
                return res.status(400).send(errorGenerator(400));
            }
            return res.status(422).send(errorGenerator(422));
        }
        if(!err.name.localeCompare('SequelizeUniqueConstraintError')) {
            return res.status(409).send(errorGenerator(409));
        }
        return res.status(500).send(errorGenerator(500));
    }
}; // SIMPLE CREATE






//--------------------------------------------------------------------------------
// ADVANCED FUNCTIONS











module.exports = {
    getUsers,
    register,
};
