const HttpError = require("../helpers/HttpError");
const {joiSchemas} = require("../models/contact");


const validateAddContact = async (req, res, next) => {
    try {
        const validationResult = joiSchemas.contactSchemaJoi.validate(req.body, {abortEarly:false});
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

        const validationResult = joiSchemas.contactSchemaJoi.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400,validationResult.error.message);
        }
        next();
    } catch (e) {
        next(e);
    }
}

const validateContactFavoriteUpdate = async (req, res, next) =>{
    try {
        const validationResult = joiSchemas.updateFavoriteSchemaJoi.validate(req.body, { abortEarly: false });
        if (validationResult.error){
            throw HttpError(400, "missing field favorite");
        }
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    validateAddContact,
    validateContactUpdate,
    validateContactFavoriteUpdate,
}