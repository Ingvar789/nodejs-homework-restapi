const HttpError = require("../helpers/HttpError");
const Joi = require("joi");
const {addContact} = require("../models/contacts");

const contactSchema = Joi.object({
    name: Joi.string().required().messages({'any.required':`missing required name field`}),
    email: Joi.string().required().messages({'any.required':`missing required email field`}),
    phone: Joi.any().required().messages({'any.required':`missing required phone field`}),
})

const validateAddContact = async (req, res, next) => {
    try {
        const validationResult = contactSchema.validate(req.body, {abortEarly:false});
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    }
    catch (e) {
        next(e)
    }
}
const validateContactUpdate = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0){
            throw HttpError(400, "missing fields");
        }

        const validationResult = contactSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    validateAddContact,
    validateContactUpdate
}