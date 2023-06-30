const express = require('express')
const authentication = require("../../middlewares/authentication")
const isValidId = require("../../middlewares/isValidId");
const {
  validateAddContact,
  validateContactUpdate,
  validateContactFavoriteUpdate
 } = require("../../middlewares/contactsValidation");

const {
  controllerListContacts,
  controllerGetContactById,
  controllerAddContact,
  controllerRemoveContact,
  controllerUpdateContact,
  controllerUpdateStatusContact,
} = require("../../controllers/contacts");

const router = express.Router()

router.use(authentication);

router.get('/', controllerListContacts);

router.get('/:contactId', isValidId, controllerGetContactById);

router.post('/', validateAddContact, controllerAddContact );

router.delete('/:contactId', isValidId, controllerRemoveContact)

router.put('/:contactId', isValidId, validateContactUpdate, controllerUpdateContact);

router.patch('/:contactId/favorite', isValidId, validateContactFavoriteUpdate, controllerUpdateStatusContact)

module.exports = router
