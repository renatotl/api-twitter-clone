const router = require('express').Router();

const authController = require("./auth.controller");//trazendo nosso controler

router.post("/login", authController.loginController);

module.exports = router