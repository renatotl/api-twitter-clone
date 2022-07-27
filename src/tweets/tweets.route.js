const router = require("express").Router();

const tweetController = require("./tweets.controller");//onde fica os dados que pegamos
const authMiddleware = require("../auth/auth.middleware");// so vai poder criar um novo tweet quem está logado

//chamamos primeiro o autendicador e depois controller
router.post("/", authMiddleware, tweetController.createTweetController);
router.get("/", authMiddleware, tweetController.findAllTweetsController);
module.exports = router;

