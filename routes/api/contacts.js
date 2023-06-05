const express = require('express')
const {validateContactUpdate, validateAddContact} = require("../../validators/contacts");
const {
  controllerUpdateContact,
  controllerListContacts,
  controllerGetContactById,
  controllerAddContact,
  controllerRemoveContact
} = require("../../controllers/contacts");
const router = express.Router()

router.get('/', controllerListContacts);

router.get('/:contactId', controllerGetContactById);

router.post('/', validateAddContact, controllerAddContact );

router.delete('/:contactId', controllerRemoveContact)

router.put('/:contactId', validateContactUpdate, controllerUpdateContact)

module.exports = router
