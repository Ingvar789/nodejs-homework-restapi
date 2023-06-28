const HttpError = require("../helpers/HttpError");
const { Contact} = require("../models/contact");
const controlWrapper = require("../decorators/controllWrapper");

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

const controllerGetContactById = async (req, res) => {
        const {contactId}=req.params;
        const contact = await Contact.findById(contactId);
        if (!contact){
            throw HttpError(404, "Not found")
        }
        res.json(contact);
}

const controllerAddContact = async (req, res) => {
        const {_id: owner} = req.user;
        const contact = await Contact.create({...req.body, owner});
        res.status(201).json(contact);
}

const controllerRemoveContact = async (req, res) => {
        const {contactId}=req.params;
        const response = await Contact.findByIdAndRemove(contactId);
        if (!response){
            throw HttpError(404, "Not found");
        }
        res.json({
            message: "contact deleted"
        });
}
const controllerUpdateContact = async (req, res) => {
        const {contactId} = req.params;
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
        if(contact === null){
            throw HttpError(404, "Not found");
        }
        res.json(contact);

}

const controllerUpdateStatusContact  = async (req, res) => {
        const {contactId} = req.params;
        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
        if(contact === null){
            throw HttpError(404, "Not found")
        }
        res.json(contact);
}

module.exports = {
    controllerListContacts: controlWrapper(controllerListContacts),
    controllerGetContactById: controlWrapper(controllerGetContactById),
    controllerAddContact: controlWrapper(controllerAddContact),
    controllerRemoveContact: controlWrapper(controllerRemoveContact),
    controllerUpdateContact: controlWrapper(controllerUpdateContact),
    controllerUpdateStatusContact: controlWrapper(controllerUpdateStatusContact),
}