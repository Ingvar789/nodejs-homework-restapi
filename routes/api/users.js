const express = require("express");
const {controllerRegister, controllerLogin, controllerGetCurrent, controllerLogout, controllerUpdateSubscription, controllerUpdateAvatar} = require("../../controllers/users");
const {validateRegister, validateLogin, validateSubscription} = require("../../middlewares/userValidation");
const authentication = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");

const router = express.Router();

// sighup
router.post("/register", upload.single('avatar'), validateRegister, controllerRegister);
// sigh in
router.post("/login", validateLogin, controllerLogin);
// logout
router.post("/logout", authentication, controllerLogout);
// current info
router.get("/current", authentication, controllerGetCurrent);
// subscription
router.patch("/", authentication, validateSubscription, controllerUpdateSubscription);
// avatar
router.patch("/avatars", authentication, upload.single('avatar'), controllerUpdateAvatar);

module.exports = router;
