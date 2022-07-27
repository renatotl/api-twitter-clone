const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    user: {// é quem está logado// relacionando tabela no mongoose
        type: mongoose.Schema.Types.ObjectId,//id de usuário
          ref: "User",// referencia a tabela user
          required : true,

    },
    message: {
        type: String,
          required : true,

    },
    likes: {
        type: Array,
          required : true,

    },
    comments: {
        type: Array,
          required : true,

    },
    retweets: {
        type: Array,
          required : true,

    },

});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;