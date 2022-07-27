// o service vai acessar os dados no mongodb

const Tweet = require("./Tweet")


const createTweetService = (message, userId) => {
  return Tweet.create({message, user: userId});//pode ser feito emline
};
//.sort({ _id: -1 }) ordena nossos tweets no front
//.populate("user") função padrão os tweets vem com o user
const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");


 module.exports = {createTweetService,findAllTweetsService }