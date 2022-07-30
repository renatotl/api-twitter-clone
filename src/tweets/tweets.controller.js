const tweetService = require("./tweets.service");

const createTweetController = async (req, res) => {
  try {
    const { message } = req.body;// recebendo a message de forma desistruturada

    if (!message) {
      res.status(400).send({
        message: "Envie todos os dados necessário para a criação do tweet",
      });
    }
// pegando o id domususario logado
    const { id } = await tweetService.createTweetService(message, req.userId);
// estamos dentro de um try e precisamos de um return
    return res.send({
      message: "Tweet criado com sucesso!",
      tweet: { id, message },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAllTweetsController = async (req, res) => {
  try {
  //logica
  const tweets = await tweetService.findAllTweetsService();

if (tweets.length === 0) {
return res.status(400).send({ message: "Não existem tweets!" });
}

return res.send({
results: tweets.map((tweet) => ({//pegando tweet por tweet e fazendo um novoobjeto
        id: tweet._id,// mandando o id do tweet
        message: tweet.message,// mandandoas msm desse tweet
        likes: tweet.likes.length,// mandando os likes do tweet
        comments: tweet.comments.length,// mandando o tamanho do array de likes
        retweets: tweet.retweets.length,// mandando 
        name: tweet.user.name,// mandando o name do usuario
        username: tweet.user.username,// mandando o username do usuari dentro de tweet
        avatar: tweet.user.avatar,// mandando a foto do usuário
      })),
})

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchTweetController = async (req, res) => {
   // esse query é porque nossa message está chegando pela tota 3000 or 3001
  const { message } = req.query;// desconstruimos a message que chega lá do cliente

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existem tweets com essa mensagem!" });
  }
  return res.send({
    tweets: tweets.map((tweet) => ({//pegando tweet por tweet e fazendo um novoobjeto
            id: tweet._id,// mandando o id do tweet
            message: tweet.message,// mandandoas msm desse tweet
            likes: tweet.likes.length,// mandando os likes do tweet
            comments: tweet.comments.length,// mandando o tamanho do array de likes
            retweets: tweet.retweets.length,// mandando 
            name: tweet.user.name,// mandando o name do usuario
            username: tweet.user.username,// mandando o username do usuari dentro de tweet
            avatar: tweet.user.avatar,// mandando a foto do usuário
          })),
        })

};



const likeTweetController = async (req, res) => {
  const { id } = req.params;// recebendo o id por parametro
    
  const userId = req.userId;// pegando o userId pelo parametro

  const tweetLiked = await tweetService.likesService(id, userId);

  if (tweetLiked.lastErrorObject.n === 0) {
      return res.status(400).send({ message: "Você já deu like neste tweet!"})
  };
 // Por fim, devolvemos uma resposta:
 return res.send({
  message: "Like realizado com sucesso!"
});
};

const retweetTweetController = async (req, res) => {
  const { id } = req.params;// recebendo o id por parametro
    
  const userId = req.userId;// pegando o userId pelo parametro

  const tweetRetweeted = await tweetService.likesService(id, userId);

  if (tweetRetweeted.lastErrorObject.n === 0) {
      return res.status(400).send({ message: "Você já deu retweet neste tweet!"})
  };
 // Por fim, devolvemos uma resposta:
 return res.send({
  message: "Retweet realizado com sucesso!"
});
};


const commentsTweetController = async (req, res) => {
  const { id } = req.params;// recebendo o id por parametro
    
  const userId = req.userId;// pegando o userId pelo parametro

  const tweetCommented = await tweetService.commentsService(id, userId);

  // if (tweetCommented.lastErrorObject.n === 0) {
  //     return res.status(400).send({ message: "Você já comentou neste tweet!"})
  // };
 // Por fim, devolvemos uma resposta:
 return res.send({
  message: "Commentário realizado com sucesso!"
});
};

module.exports = {
  createTweetController,
  findAllTweetsController,
  searchTweetController,
  likeTweetController,
  retweetTweetController,
  commentsTweetController
}