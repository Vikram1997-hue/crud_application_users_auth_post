const Joi = require('joi');

const createPost = Joi.object({
    user_id: Joi.string()
        .max(40),
    // post_title: 
});

module.exports = {
    createPost,
};
