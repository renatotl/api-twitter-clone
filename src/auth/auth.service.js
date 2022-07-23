const User = require("../users/User")


const loginService = (email) => User.findOne({email: email}).select("+password")// trazer atraves do email o email// o que o 9password vai faser ele m=vai trocar de false para true nesta busca usando a tabela model do User

module.exports = { loginService }