const tweetService = require("./tweets.service");



const createTweetController = async (req, res) => {
  try {
    const { message } = req.body;// recebendo a message de forma desistruturada trazendo so a message do body

    if (!message) {// validando se a message existe
      res.status(400).send({
        message: "Envie todos os dados necessário para a criação do tweet",
      });
    }
// pegando o id domususario logado e pegando na requisição o userId
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
let {limit, offSet} = req.quary
// precisamos alterar isso por isso recebemos por quary

// garantindo que limit e offSet são número vamos converté-lo para number
limit = Number(limit);
offSet = Number(offSet);
//Se não exisir limit
if(!limit){
  limit= 5// número de twitt que vai aparecer
}
// Se não existit offSet
if(!offSet){
  offSet= 0
}

  //logica
  const tweets = await tweetService.findAllTweetsService( offSet, limit);

  const total = await tweetService.countTweets();// ele vai contar quantos tweets a gente têm

//url atual do front end
  const currentUrl = req.baseUrl;


  const next = offSet + limit;
  //if ternário
  const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offSet=${next}` : null
// se next for menor que total constroi atraves de tenplente string a URL padão que tenho e manda um limite que vai ser o meu limit e offset recebendo um novo valor que é o next 

//ciclo
//offset = 0
// limit = 5

//offset = 5
// limit = 5

//offset = 10
// limit = 5


  const previous = offSet - limit < 0 ? null : offSet - limit;
  // offset - o limit. se for menor que 0 ele retorna nulo
  const previousUrl =
    previous != null
      ? `${currentUrl}?limit=${limit}&offSet=${previous}`
      : null;



if (tweets.length === 0) {
return res.status(400).send({ message: "Não existem tweets!" });
}

return res.send({
  nextUrl,
  previousUrl,
  limit,
  offSet,
  total,


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
    
  const userId = req.userId;// pegando o userId pelo parametro que vem do midware

  const tweetLiked = await tweetService.likesService(id, userId);

  if (tweetLiked.lastErrorObject.n === 0) {// erro do mongo e o "n" é um in se ele for igual a zero, quer dizer que o tweet já recebeu um like daquele usuário:
      return res.status(400).send({ message: "Você já deu like neste tweet!"})
  };
 // Por fim, devolvemos uma resposta:
 return res.send({
  message: "Like realizado com sucesso!"
});
};
// so pode retweetar uma vez so
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