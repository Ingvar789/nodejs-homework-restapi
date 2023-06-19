const HttpError = require("../helpers/HttpError");
const {joiAuthSchemas} = require("../models/user");

const validateRegister = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0){
            throw HttpError(400, "missing fields");
        }

        const validationResult = joiAuthSchemas.userSchemaRegisterJoi.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    } catch (e) {
        next(e);
    }
}

const validateLogin = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0){
            throw HttpError(400, "missing fields");
        }

        const validationResult = joiAuthSchemas.userSchemaLoginJoi.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    } catch (e) {
        next(e);
    }
}

const validateSubscription = async (req, res, next) =>{
    try {
        const validationResult = joiAuthSchemas.userSchemaSubscriptionJoi.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    } catch (e) {
        next(e);
    }
}
module.exports = {
    validateRegister,
    validateLogin,
    validateSubscription,
}