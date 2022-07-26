const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    user: {// é quem está logado
        type: mongoose.Schema.Types.ObjectId,//id de usuário
          ref: "User",
          required : true,

    },
    message: {
        type: String,
          required : true,

    },
    likes: {
        type: Arrey,
          required : true,

    },
    comments: {
        type: Arrey,
          required : true,

    },
    retweets: {
        type: Array,
          required : true,

    },

});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;