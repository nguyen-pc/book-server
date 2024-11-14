const express = require("express");

const router = express.Router();
const authControllers = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");

router.post("/login", authControllers.login);

router.post("/login_admin", authControllers.login_admin)

router.post("/register", authControllers.register);

router.post("/logout", authControllers.logout);

router.post("/refresh", authControllers.refresh);

router.post("/createAuth", authControllers.create);

router.get("/getAllUser", authControllers.getAllUser);

router.get("/user", authMiddleware, authControllers.user);

router.get("/user/:userId", authControllers.getUserById);

router.put("/user/:userId", authControllers.updateUser);

router.delete("/user/:userId", authControllers.deleteUser);

module.exports = router;
