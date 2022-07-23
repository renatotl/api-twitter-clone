const mongoose = require("mongoose");//exportando pra cá nosso mongoose

const bcrypt = require("bcryptjs")

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
    select: false,//quando criar um novo usuário ele não retorna o password não vai mostar o password no findAll
  },
  avatar: {
    type: String,
    required: true,
  },
});

// o código de baixo não aceita aerofunction
//antes de salvar vai executar uma função de callback, antes de salvar execute este cara
UserSchema.pre('save', async function (next)  {// o 10 é quantas valtas vamos querer de incryptação
  this.password = await bcrypt.hash(this.password, 10)//falando desse Schema atual
// essa função add um novo valor ao password que está sendo salvo
next()// ele é um middler se não ele fica pra semprenpm run dev

})

const User = mongoose.model("User", UserSchema);

module.exports = User;