const express = require('express')
const {listContacts, getContactById, removeContact, addContact, updateContact} = require("../../models/contacts");
const HttpError = require("../../helpers/HttpError");
const Joi = require("joi");
const router = express.Router()

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.any().required(),
})

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  }
  catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
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
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if (error){
      throw HttpError(400, error.message);
    }
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  }
  catch (e) {
    next(e)
  }
})

router.delete('/:contactId', async (req, res, next) => {

  try {
    const response = await removeContact(req.params['contactId'])
    res.json(response);
  }
  catch (e) {
    console.log(e)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if (error){
      throw HttpError(400, error.message);
    }
    const {contactId} = req.params;
    const contact = await updateContact(contactId, req.body);
    if(!contact){
      throw HttpError(404, "Not found")
    }
    res.json(contact);
  }
  catch (e) {
    next(e)
  }
})

module.exports = router
