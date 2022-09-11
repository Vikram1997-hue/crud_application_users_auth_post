/* eslint-disable prefer-regex-literals */
const Joi = require('joi');

const get = Joi.object({
    id: Joi.string()
    .max(40),
});

const register = Joi.object({
    name: Joi.string()
        .regex(RegExp(/^[A-Z]?([a-z]+|[A-Z]+)( ([A-Z]|[a-z]))?([a-z]+)$/))
        // .pattern(new RegExp('[A-Z]?([a-z]+|[A-Z]+)( ([A-Z]|[a-z]))?([a-z]+)'))
        .max(30)
        .required(),
    email: Joi.string()
        .regex(/^([a-z]+(([^@]([0-9]|[a-z])+)([1-9]+)?)+)(@appventurez+(.com)+)$/)
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
    phone_number: Joi.string()
        .regex(/\+?(\d*)? ?-? ?\(?(\d{3})\)?[\s-]*(\d{3})[\s-]*(\d{4})/)
        .required(),
        /**
         * Supported phone number formats -
         *  1234567890
         *  123 456 7890
         *  123-456-7890
         *  123 - 456 - 7890
         *  (123) 456 7890
         *  +91 - 1234567890
         *  +1 - 1234567890
         *  +911-1234567890
         *  123     456     7890
         *  91 (995) 819 6614
         *  91 123 456 7890
         */
});

const otpVerif = Joi.object({
    jwt: Joi.string()
        .required(),
    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
});

const login = Joi.object({
    email: Joi.string()
        .regex(/([a-z][0-9]?[_|.]?).+@appventurez.com$/)
        .min(17)
        .max(40)
        .lowercase()
        .required(),
    password: Joi.string()
        // .min(8)
        // .max(20)
        .required(),
});

const logout = Joi.object({
    jwt: Joi.string()
    .required(),
});

module.exports = {
    get,
    register,
    otpVerif,
    login,
    logout,
};
