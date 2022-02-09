const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const validationMiddelware = require("../middlewares/auth/validationMiddelware");
const authMiddelware = require("../middlewares/auth/authMiddleware");

router.post(
  "/registration",
  validationMiddelware.userValidation,
  authController.registration
);
router.post(
  "/login",
  validationMiddelware.userValidation,
  authController.login
);
router.get("/logout", authMiddelware, authController.logout);
router.get("/activate/:link", authController.activate);
router.get("/refresh", authController.refresh);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password/:link", authController.changePasswordController);
router.get("/confirm-new-host/:link", authController.confirmHost);

module.exports = router;
