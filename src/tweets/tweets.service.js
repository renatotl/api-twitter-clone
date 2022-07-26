// o service vai acessar os dados no mongodb

const Tweet = require("./Tweet")

//recebendo a message e o usuário que fez esse tweet
const createTweetService = (message, userId) => {
  return Tweet.create({message, user: userId});//pode ser feito emline
  // estamos inviado para o user em forma de objeto
};
//.sort({ _id: -1 }) ordena nossos tweets no front
//.populate("user") função padrão os tweets vem com o user
const findAllTweetsService = (offSet, limit) => Tweet.find().sort({ _id: -1 }).skip(offSet).limit(limit).populate("user");// o número do limit() mostra a quantidade de tweets a ser mostrado
// o sort ordena a lista jogando os ultimos itens para cima. o skip()pula os 5 tweets atuais e o limit mostra os próximos 5




//Tweet.find() = chama todos
//.sort({ _id: -1 }) = organiza do ultimo criado para o primeiro
// .skip(offSet) = pula 5
//.limit(limit) = traz o liite de 5
//.populate("user"); = popula com usero

//countDocuments é uma função do mongoose traz quantos docs exsitem
const countTweets = () => Tweet.countDocuments();


//$regex: `${message || ""}` /Fornece recursos de expressão regular para strings de correspondência de padrões em consultas.
const searchTweetService = (message) =>Tweet.find({// porque não fazer um findone porque eu posso ter mais de uma mensagem com o mesma message
    message: { $regex: `${message || ""}`, $options: "i" },
  })//regex é mongpdb puro dentro do backend/ o "i"  ele ignora letra maiuscula eminiscula isso é case senssitive
    .sort({ _id: -1 })
    .populate("user")



    // NIN eu quero saber se os "likes.userId" se nenhum usuário conector oucriou alguma coisa. se o usuário já não deu like nesse tweet
    const likesService = (id, userId) =>  
    Tweet.findOneAndUpdate({// forma correta de contar likes
        _id: id,
        "likes.userId": { $nin: [userId]}//varificand se nehum usuario criou algo com esse id como um like

    },
    {// Se for o primeiro like, vamos dar um push no array com o id do usuário e a data do like:

      $push: {// criamos o campo likes:
          likes: { userId, created: new Date() }// registra data que foi dado o like
      }
  },
  {//E, por fim, precisamos colocar um rawResult: true para o MongoDB retornar o resultado dos procedimentos acima:


    rawResult: true,// retotna o resultado bruto do mongoDB
},
);

const retweetsService = (id, userId) =>  
    Tweet.findOneAndUpdate({
        _id: id,
        "retweets.userId": { $nin: [userId]}
        /*Vamos buscar o id do tweet e se nenhum usuário tiver dado retweet nesse tweet vamos adicionar o campo retweets através da query $nin. Se esse usuário já tiver dado retweets, essa mesma query não deixará dar outro retweet:*/

    },
    {

      $push: {
          retweets: { userId, created: new Date() }
      }
  },
  {    

    rawResult: true,
},
);

const commentsService = (id, userId) =>  
Tweet.findOneAndUpdate({
    _id: id,
    // "comments.userId": { $nin: [userId]}

},
{

  $push: {
      retweets: { userId, created: new Date() }
  }
},
{    

rawResult: true,
},
);





 module.exports = { 
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService,
  commentsService,
  countTweets
 }