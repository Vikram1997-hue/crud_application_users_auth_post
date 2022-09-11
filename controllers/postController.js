const jwt = require('jsonwebtoken');
require('dotenv').config();

const Post = require('../models/post');
const sequelize = require('../util/database');
const postValidation = require('../validation/post/schema');

// sequelize.sync({force: true}).then(result => {
//     console.log(result)
// }).catch((err) => {
//     console.error("Error in Sequelize sync attempt", err)
// })

const createPost = async (req, res) => {
    try {
        await postValidation.createPost.validateAsync({
            user_id: req.body.user_id,
            post_title: req.body.post_title,
            image: req.body.image,
        });
        // now we check for login (cuz only a logged in user can create posts)
        const receivedToken = req.headers.authorization.split(' ')[1];
        await jwt.verify(receivedToken, process.env.JWT_SECRET_KEY, (err, userForJwt) => {
            if(err) {
                console.log('ERROR IN JWT VERIFFFFFF', err);
                throw err;
            }
            if(req.body.user_id.localeCompare(userForJwt.id)) {
                const e = new Error('user_id in req.body does not match id in jwt');
                e.name = 'user_id param mismatch error';
                throw e;
            }
            if(userForJwt.type.localeCompare('USER')) {
                const e = new Error();
                e.name = 'Only role type USER may create a post';
                throw e;
            }
        });
        const newPost = await Post.create({
            user_id: req.body.user_id,
            post_title: req.body.post_title,
            image: req.body.image,
        });
        await newPost.save();
        return res.status(200).send('New post has been successfully created!');
    } catch(err) {
        console.log('PAAANGA HO GAYA', err.name, 'HAAAAAAAI', err.message);
        return res.status(500).send(err.name);
    }
};

module.exports = {
    createPost,
};
