const User = require("../users/User")
const jwt = require("jsonwebtoken");// trazendo nosso jsonwebtoken

const loginService = (email) => User.findOne({email: email}).select("+password")// trazer atraves do email o email// o que o 9password vai faser ele m=vai trocar de false para true nesta busca usando a tabela model do User

// função do token. o SING pede 3 parãmetros o 1º é o Id, o SECRET vai esconder. O espire é que vai sexpirar um dia tem 86400 segundos
const generateToken = (userId) => { 
    return jwt.sign({ id: userId}, process.env.SECRET, { expiresIn: 86400})

};

module.exports = { loginService, generateToken}

// gerador de token de validação do usuário e barrar outras pessoas que não tenham o token o jwt segurança padrão de mercado


