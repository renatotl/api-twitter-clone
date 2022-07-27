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

module.exports = {createTweetController}