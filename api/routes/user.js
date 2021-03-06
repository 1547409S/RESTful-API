const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.users_signup);

router.post("/login", UserController.users_login);

router.delete("/:userId", checkAuth, UserController.users_delete_user);

module.exports = router;