const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/Auth.controller");
const authenticate = require("../Middleware/authentication");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);

module.exports = router;