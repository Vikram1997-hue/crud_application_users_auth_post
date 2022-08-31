const Joi = require('joi');

const get = Joi.object({
    id: Joi.string()
    .max(40),
});


// try {
//     const value = get.validateAsync()
// }
// catch(err){
//     console.error(err)
// }

module.exports = {
    get,
};
