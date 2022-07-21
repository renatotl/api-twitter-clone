const mongoose = require("mongoose");//exportando pra cá nosso mongoose

const UserSchema = new mongoose.Schema({// ele é um objeto
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,// fala que só posso ter 1 username igual a este em todo meu banco de dados
  },
  email: {
    type: String,
    required: true,
    unique: true,// fala que só posso ter 1 email igual a este em todo meu banco de dados
    lowercase: true,// deixa tudo em letras minúsculas
  },
  password: {
    type: String,
    required: true,
    select: false,//quando criar um novo usuário ele não retorna o password
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;