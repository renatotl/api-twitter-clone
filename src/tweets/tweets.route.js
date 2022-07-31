const router = require("express").Router();

const tweetController = require("./tweets.controller");//onde fica os dados que pegamos
const authMiddleware = require("../auth/auth.middleware");// so vai poder criar um novo tweet quem está logado

//chamamos primeiro o autendicador e depois controller
router.post("/create", authMiddleware, tweetController.createTweetController);
router.get("/", authMiddleware, tweetController.findAllTweetsController);
router.get("/search", authMiddleware, tweetController.searchTweetController);
//Vamos adicionar a rota do like:
router.patch("/:id/like", authMiddleware, tweetController.likeTweetController)
//Será um patch pois vamos modificar apenas um campo no documento e não ele inteiro.

router.patch("/:id/retweet", authMiddleware,tweetController.retweetTweetController);
//Será um patch pois vamos modificar apenas um campo no documento e não ele inteiro.



module.exports = router;

