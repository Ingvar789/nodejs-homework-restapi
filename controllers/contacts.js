const HttpError = require("../helpers/HttpError");
const {listContacts, updateContact, getContactById, addContact, removeContact} = require("../models/contacts");

const controllerListContacts = async (req, res, next) => {
    const contacts = await listContacts();
    res.json(contacts);
}

const controllerGetContactById = async (req, res, next) => {
    try {
        const {contactId}=req.params;
        const contact = await getContactById(contactId);
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
        const contact = await addContact(req.body);
        res.status(201).json(contact);
    }
    catch (e) {
        next(e)
    }
}

const controllerRemoveContact = async (req, res, next) => {
    try {
        const {contactId}=req.params;
        const response = await removeContact(contactId);
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
        const contact = await updateContact(contactId, req.body);
        console.log(contact);
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
    controllerAddContact,
    controllerUpdateContact,
    controllerListContacts,
    controllerGetContactById,
    controllerRemoveContact
}