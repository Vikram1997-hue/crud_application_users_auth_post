const Joi = require('joi');

const createPost = Joi.object({
    user_id: Joi.string()
        .max(40)
        .required(),
    post_title: Joi.string()
        .max(30)
        .required(),
    image: Joi.string(),
});

module.exports = {
    createPost,
};
