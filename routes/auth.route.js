const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.midlleware")
const { verifyEmail, signup, login, logout } = require("../controllers/auth.controller");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimit");
const bruteForceProtection = require("../middlewares/bruteForce");


router.post("/signup", signup,signupLimiter);
router.post("/login", login,loginLimiter,bruteForceProtection);
router.post("/logout", logout);

router.get("/verify-email", verifyEmail)


module.exports = router;