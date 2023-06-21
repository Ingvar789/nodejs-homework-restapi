const express = require('express')
const authentication = require("../../middlewares/authentication")
const isValidId = require("../../middlewares/isValidId");
const {validateAddContact, validateContactUpdate, validateContactFavoriteUpdate} = require("../../middlewares/contactsValidation");

const {
  controllerListContacts,
  controllerGetContactById,
  controllerAddContact,
  controllerRemoveContact,
  controllerUpdateContact,
  controllerUpdateStatusContact,
} = require("../../controllers/contacts");

const router = express.Router()

router.get('/', authentication, controllerListContacts);

router.get('/:contactId', authentication, isValidId, controllerGetContactById);

router.post('/', authentication, validateAddContact, controllerAddContact );

router.delete('/:contactId', authentication, isValidId, controllerRemoveContact)

router.put('/:contactId', authentication, isValidId, validateContactUpdate, controllerUpdateContact);

router.patch('/:contactId/favorite', authentication, isValidId, validateContactFavoriteUpdate, controllerUpdateStatusContact)

module.exports = router
