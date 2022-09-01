const Joi = require('joi');

const get = Joi.object({
    id: Joi.string()
    .max(40),
});

const register = Joi.object({
    name: Joi.string()
        .regex(/[A-Z]?([a-z]+|[A-Z]+)( ([A-Z]|[a-z]))?([a-z]+)/)
        .max(30),
    email: Joi.string()
        .regex(/([a-z][0-9]?[_|.]?).+@appventurez.com$/)
        .min(17)
        .max(40)
        .lowercase()
        .required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .required(),
    type: Joi.string()
        .max(5)
        .uppercase()
        .valid('USER', 'ADMIN'),
});



// try {
//     const value = get.validateAsync()
// }
// catch(err){
//     console.error(err)
// }

module.exports = {
    get,
    register,
};
