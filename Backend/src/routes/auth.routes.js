const express = require("express");

const {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  meController,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", authMiddleware, logoutController);
router.get("/me", authMiddleware, meController);

router.get("/verify-email/:token", verifyEmailController);

module.exports = router;
