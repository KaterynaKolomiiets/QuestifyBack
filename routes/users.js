const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const validationMiddelware = require("../middlewares/auth/validationMiddelware");
const authMiddelware = require("../middlewares/auth/authMiddleware");

router.post("/registration", validationMiddelware.userValidation, authController.registration);
router.post("/login", validationMiddelware.userValidation, authController.login);
router.post("/logout", authMiddelware, authController.logout);
router.get("/activate/:link", authController.activate);
router.get("/refresh", authController.refresh);
router.get("/reset-password", authController.resetPassword);
router.post("/change-password/:link", authController.changePassword);
router.get("/confirm-new-host/:link", authController.confirmHost);

module.exports = router;
