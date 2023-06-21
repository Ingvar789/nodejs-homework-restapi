const HttpError = require("../helpers/HttpError");
const { Contact} = require("../models/contact");

const controllerListContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 20, favorite = undefined} = req.query;
    const skip = (page - 1) * limit;
    let queryParams = {
        owner: owner
    }
    if (favorite){
        queryParams = {...queryParams, ...{favorite:favorite}};
    }
    const contacts = await Contact.find(queryParams, "-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
    res.json(contacts);
}

const controllerGetContactById = async (req, res, next) => {
    try {
        const {contactId}=req.params;
        const contact = await Contact.findById(contactId);
        if (!contact){
            throw HttpError(404, "Not found")
        }
        res.json(contact);
    }
    catch (e) {
        next(e);
    }
}

const controllerAddContact = async (req, res, next) => {
    try {
        const {_id: owner} = req.user;
        const contact = await Contact.create({...req.body, owner});
        res.status(201).json(contact);
    }
    catch (e) {
        next(e)
    }
}

const controllerRemoveContact = async (req, res, next) => {
    try {
        const {contactId}=req.params;
        const response = await Contact.findByIdAndRemove(contactId);
        if (!response){
            throw HttpError(404, "Not found");
        }
        res.json({
            message: "contact deleted"
        });
    }
    catch (e) {
        next(e)
    }
}
const controllerUpdateContact = async (req, res, next) => {
    try{
        const {contactId} = req.params;
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
        if(contact === null){
            throw HttpError(404, "Not found");
        }
        res.json(contact);
    }
    catch (e){
        next(e);
    }
}

const controllerUpdateStatusContact  = async (req, res, next) => {
    try{
        const {contactId} = req.params;
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
        if(contact === null){
            throw HttpError(404, "Not found");
        }
        res.json(contact);
    }
    catch (e){
        next(e);
    }
}

module.exports = {
    controllerListContacts,
    controllerGetContactById,
    controllerAddContact,
    controllerRemoveContact,
    controllerUpdateContact,
    controllerUpdateStatusContact,
}