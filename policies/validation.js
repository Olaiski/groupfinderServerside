// VALIDATION
// FIXME//: Blir ikke brukt akkurat nå, problem med Joi.validate() ikke finnes.
const Joi = require('joi');

// Registrering validering
const registerValidation = (data) => {
    const schema = {
        firstname: Joi.string()
            .min(1)
            .required(),
        lastname: Joi.string()
            .min(1)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        phonenumber: Joi.string()
            .min(8),
        password: Joi.string()
            .min(6)
            .required()
    };
    return Joi.validate(data, schema);
};

const loginValidation = (data) => {
    const schema = {

        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;