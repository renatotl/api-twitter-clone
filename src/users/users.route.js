const router = require("express").Router()//essa parte do jogo .Router() é pra já executar 
const userController = require("./users.controller")

router.post("/", userController.createUserController);
router.get("/", userController.findAllUserController);


module.exports = router;
