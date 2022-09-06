const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');
const Auth = require('../models/auth');
const Otp = require('../models/otp');
const sequelize = require('../util/database');
const userValidation = require('../validation/users/schema');
const errorGenerator = require('../util/errors');
const otpGenerator = require('../util/otpGenerator');
const sendMail = require('../util/autoMailUtility');
const sendText = require('../util/autoTextUtility');

// sequelize.sync({force: true}).then(result => {
//     console.log("All is well! Result:",result)
// }).catch((err) => {
//     console.error("Error in userController sync attempt:", err)
// })

setInterval(async () => {
    const allInOtp = await Users.findAll({
        include: {
            model: Otp,
            required: true,
        },
    });
    // console.log(allInOtp);
    if(allInOtp.length !== 0) {
        // eslint-disable-next-line no-restricted-syntax
        for(const currentUser of allInOtp) {
            const currentToken = currentUser.dataValues.otp.jwt;
            // console.log(currentToken);
            jwt.verify(currentToken, process.env.JWT_SECRET_KEY, async (err) => {
                if(err && !err.name.localeCompare('TokenExpiredError')) {
                    await currentUser.destroy();
                    await currentUser.save();
                    console.log('deleted inactive');
                }
            });
        }
    } else {
        console.log(`I-I-I-I-I'm staying out`);
    }
}, 5 * 60 * 1000);

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
            phone_number: req.body.phone_number,
        });
        // console.log(req.body.name, req.body.email, req.body.password);

        // since email uniqueness auto-validates on insertion attempt, we shall check for
        // ph no. uniqueness. 2-part process:
        // PART 1: modifying phone_number to match required pattern
        const result = req.body.phone_number.match(/\+?(\d*)? ?-? ?\(?(\d{3})\)?[\s-]*(\d{3})[\s-]*(\d{4})/);
        console.log(result);
        let phNo = '';
        if(result[1] === undefined) {
            phNo += '+91';
        } else{
            phNo += `+${result[1]}`;
        }
        phNo += result[2].toString() + result[3].toString() + result[4].toString();
        // console.log('\n\n\nyaaaaaaaa' + result, typeof (result));
        console.log(`ILYYYYYYYYYYY ${phNo}`);

        // PART 2: checking if this phone_number is in the table
        const phoneAlreadyExists = await Auth.findOne({
            where: {
                phone_number: phNo,
            },
        });
        if(phoneAlreadyExists != null) {
            const myErr = new Error('Already in auth');
            myErr.name = 'Already in auth';
            throw myErr;
        }

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
        await myUser.save();

        // auto-insertion into auth
        await Auth.create({
            user_id: myUser.id,
            phone_number: phNo,
        });

        // otp generation and sending
        const myOtp = otpGenerator();
        console.log(myOtp);
        const msg = `Your OTP for Vukrim's CRUD application is: ${myOtp}`;
        sendMail(myUser.email, msg);
        // if(req.body.phone_number.charAt(0) !== '+') {
        //     phNo = '+91'.toString() + phNo;
        // }
        sendText(phNo, msg);

        // otp table insertion
        const userForJWT = {
            user_id: myUser.id,
            otp: myOtp,
        };
        const otpJwt = jwt.sign(userForJWT, process.env.JWT_SECRET_KEY, {
            expiresIn: '300000',
        });
        await Otp.create({
            user_id: myUser.id,
            otp: myOtp,
            jwt: otpJwt,
        });
        return res.status(200)
            .send(`Insertion successful. 
            Please enter OTP to complete the registration process`);
    } catch(err) {
        console.log('YAAAAAAAAAAAAAAAAAAA', err, 'HAIIIIIII', err.name);
        if(!err.name.localeCompare('ValidationError')) {
            if(!err.message.substr(-8).localeCompare('required')) {
                return res.status(400).send(errorGenerator(400));
            }
            return res.status(422).send(errorGenerator(422));
        }
        if(!err.name.localeCompare('Already in auth')) {
            console.log('Ghus gaya bhaaaaaaaaaaaaaaaai');
            return res.status(409).send(errorGenerator(409));
        }
        if(!err.name.localeCompare('SequelizeUniqueConstraintError')) {
            return res.status(409).send(errorGenerator(409));
        }
        console.log('BHAI KA NAAAAAAAAAM', err, 'AAAAAND', err.name);
        return res.status(500).send(errorGenerator(500));
    }
}; // SIMPLE CREATE

const otpVerification = async (req, res) => {
    try {
        await userValidation.otpVerif.validateAsync({
            jwt: req.headers.authorization.split(' ')[1],
            otp: req.body.otp,
        });
        const receivedToken = req.headers.authorization.split(' ')[1];
        let resultFromUsers;
        let resultFromOtp;
        await jwt.verify(receivedToken, process.env.JWT_SECRET_KEY, async (err, userForJWT) => {
            if(err) {
                console.log("YAAAAAAAAAAAAAAS", err.name, "AAAAND", err.message, "YPPPPP");
                throw err;
            }
            // console.log('PRINTING OUR GUUUUUUUUUUY', userForJWT);
            // it is definitely a valid token. But does it currently exist in the DB?
            resultFromUsers = await Users.findByPk(userForJWT.user_id);
            console.log('PEHLAAAAAAAAA', resultFromUsers);
            resultFromOtp = await Otp.findOne({
                where: {
                    user_id: resultFromUsers.id,
                },
            });
            console.log('DOOOOOOSRA', resultFromOtp.dataValues);
        });
        // console.log('DEBUGGINGGGG', resultFromOtp.dataValues.otp);
        // console.log('THE FETCHED TIIIIIIIIIIING', result);
        if(resultFromOtp.dataValues.otp.localeCompare(req.body.otp)) {
            const myErr = new Error('Incorrect OTP');
            myErr.name = 'Incorrect OTP';
            // console.log('GHUSAAAAAAAAAAAA PART 1');
            await resultFromOtp.destroy();
            await resultFromOtp.save();
            await resultFromUsers.destroy();
            await resultFromUsers.save();
            throw myErr;
        }
        // now OTP is correct, so...
        await resultFromOtp.destroy();
        await resultFromOtp.save();
        resultFromUsers.isVerified = true;
        await resultFromUsers.save();
        res.status(200).send('Verification complete! Your account has been successfully created');
    } catch(err) {
        console.error(err, 'BHAI KA NAAAAAAAAAAAM', err.name + "HAIIII" + err.message);
        // eslint-disable-next-line quotes
        if(!err.name.localeCompare('Incorrect OTP')) {
            // console.log("GHUS GAYA BHAI PARTYYYYYYYYYYY");
            return res.status(401).send(errorGenerator(401, 'Incorrect OTP. Re-register please.'));
        }
        if(!err.name.localeCompare('JsonWebTokenError')) {
            return res.status(401).send(errorGenerator(401));
        }
        if(!err.message.substr(0, 16).localeCompare('Unexpected token')) {
            return res.status(401).send(errorGenerator(401));
        }
        if(!err.message.localeCompare(`Cannot read properties of undefined (reading 'split')`)) {
            return res.status(401).send(errorGenerator(401, 'JWT can not be null'));
        }
        if(!err.name.localeCompare('ValidationError')) {
            if(!err.message.substr(-8).localeCompare('required')) {
                return res.status(400).send(errorGenerator(400));
            }
            return res.status(422).send(errorGenerator(422));
        }
        if(!err.name.localeCompare('TokenExpiredError')) {
            return res.status(401).send(errorGenerator(401, 'Your OTP has expired! Please register again.'
            + ' If you missed your 5 minute window to enter your OTP, you must wait for an '
            + 'additional 5 minutes until you can retry'));
        }
        if(!err.name.localeCompare('JsonWebTokenError')) {
            return res.status(401).send(errorGenerator(401));
        }
        return res.status(500).send(errorGenerator(500));
    }
};

const login = async (req, res) => {
    try {
        await userValidation.login.validateAsync({
            email: req.body.email,
            password: req.body.password,
        });
        const currentUser = await Users.findOne({
            where: {
                email: req.body.email,
            },
        });
        if(currentUser == null) {
            const err = new Error('This email ID has not been registered!');
            err.name = 'This email ID has not been registered!';
            throw err;
        }
        const passwordCorrect = await bcrypt.compare(req.body.password, currentUser.password);
        if(!passwordCorrect) {
            const e = new Error('Incorrect password');
            e.name = 'Incorrect password';
            throw e;
        }
        if(currentUser.isVerified === false) {
            const e = new Error('You cannot login until you have verified your account with OTP');
            e.name = 'You cannot login until you have verified your account with OTP';
            throw e;
        }
        const userForJWT = {
            id: currentUser.id,
            type: currentUser.type,
        };
        const currentSessionJWT = await jwt.sign(userForJWT, process.env.JWT_SECRET_KEY, {
            expiresIn: '600000',
        });
        currentUser.jwt = currentSessionJWT;
        await currentUser.save();
        return res.status(200).send('You have successfully logged in!');
    } catch(err) {
        console.log('THE ERROR ISSSSSSSSSSSSS', err, 'NAAAAAAAAAM', err.name);
        if(!err.name.localeCompare('Incorrect password')) {
            return res.status(403).send(errorGenerator(403));
        }
        if(!err.name.localeCompare('ValidationError')) {
            if(!err.message.substr(-8).localeCompare('required')) {
                return res.status(400).send(errorGenerator(400));
            }
            return res.status(422).send(errorGenerator(422));
        }
        if(!err.name.localeCompare('This email ID has not been registered!')) {
            return res.status(404).send(errorGenerator(404));
        }
        if(!err.name.localeCompare('You cannot login until you have verified your account with OTP')) {
            return res.status(405).send(errorGenerator(405));
        }
        return res.status(500).send(errorGenerator(500));
    }
};

const logout = async (req, res) => {
    try {
        await userValidation.logout.validateAsync({
            jwt: req.headers.authorization.split(' ')[1],
        });
        const receivedToken = req.headers.authorization.split(' ')[1];
        await jwt.verify(receivedToken, process.env.JWT_SECRET_KEY, async (err, userForJWT) => {
            if(err) {
                throw err;
            }
            const currentUser = await Users.findByPk(userForJWT.id);
            if(currentUser.jwt == null) {
                const e = new Error('already logged out');
                e.name = 'already logged out';
                throw e;
            }
            currentUser.jwt = null;
            await currentUser.save();
            return res.status(200).send('You are now logged out!');
        });
    } catch(err) {
        console.log('THE ERROR ISSSSSSSSSS', err, 'NAAAAAAAAAM', err.name);
        if(!err.name.localeCompare('TokenExpiredError')) {
            return res.status(401).send(errorGenerator(401, 'You have been auto-logged out. Please log in again'));
        }
        if(!err.name.localeCompare('ValidationError')) {
            if(!err.message.substr(-8).localeCompare('required')) {
                return res.status(400).send(errorGenerator(400));
            }
            return res.status(422).send(errorGenerator(422));
        }
        if(!err.name.localeCompare('already logged out')) {
            return res.status(401).send(errorGenerator(401, 'You are already logged out'));
        }
        return res.status(500).send(errorGenerator(500));
    }
};

module.exports = {
    getUsers,
    register,
    otpVerification,
    login,
    logout,
    // resendOTP,
};
