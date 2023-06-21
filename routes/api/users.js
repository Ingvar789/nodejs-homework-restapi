const express = require("express");
const {controllerRegister, controllerLogin, controllerGetCurrent, controllerLogout, controllerUpdateSubscription} = require("../../controllers/users");
const {validateRegister, validateLogin, validateSubscription} = require("../../middlewares/userValidation");
const authentication = require("../../middlewares/authentication");

const router = express.Router();

// sighup
router.post("/register", validateRegister, controllerRegister);
// sigh in
router.post("/login", validateLogin, controllerLogin);
// logout
router.post("/logout", authentication, controllerLogout);
// current info
router.get("/current", authentication, controllerGetCurrent);
// subscription
router.patch("/", authentication, validateSubscription, controllerUpdateSubscription )

module.exports = router;
