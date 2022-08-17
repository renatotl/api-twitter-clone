const User = require("./User");// chamando User pra cá que é a nossa model

const findByIdUserService = (idUser) => User.findById(idUser);


// procurndo o email que chegou se já existe
const findByEmailUserService = (email) => User.findOne({email: email})// procurando o email no backend ele retona pelo findByEmailUserService. o findOne é do mongoose

// recebendo o (body) o segundo (body) é o que ele cria no banco de dados
const createUserService = (body) => User.create(body);// quando se faz inlie não precisa de return

const findAllUserService = () => User.find();


module.exports = { findByEmailUserService, createUserService, findAllUserService, findByIdUserService };


