// o service vai acessar os dados no mongodb

const Tweet = require("./Tweet")


const createTweetService = (message, userId) => {
  return Tweet.create({message, user: userId});//pode ser feito emline
};

 module.exports = {createTweetService}