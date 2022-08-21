require("dotenv").config();// trazemos ele para não ter problemas com variáveis de ambiente 
const jwt = require("jsonwebtoken");
//trazemo-nos de forma desconstruída o findByIdUserService
const { findByIdUserService } = require("../users/users.service");



//exportando uma função anónima Vamos fazer um pouco diferente na exportação da função de middleware em relação às outras funções que criamos. Ao invés de darmos um nome para função e exportá-la depois, vamos criá-la de forma anônima dentro do module.exports. É uma outra forma de trabalharmos com modularização:

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

 if(!authHeader){
   return res.status(401).send({message: "O token não foi encontrado!"})


 }

//o split separa com espaço o authHeader e trasforma em um array
  const parts = authHeader.split(' ')// ["Bearer", "<token>"]
//verificando se esse array tem duas posições 
  if (parts.length !== 2) {//se não tiver o bearer e token
    return res.status(401).send({ message: "Token inválido!" });
  }

// o bearer agore é o scheme e token continua token. o arrey foi desconstruído
  const [scheme, token] = parts;
//validando individualente
  if (!/^Bearer$/i.test(scheme)) {//verificando de scheme começa com Bearer
    return res.status(401).send({ message: "Token malformatado!" });
  }
//verificando o jwt
  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    const user = await findByIdUserService(decoded.id);//id do generateToken desconstroi // decoded é tudo dentro do token

    if (err || !user || !user.id) {//se tiver um erro ou não tiver user ou user.id
      return res.status(401).send({ message: "Token inválido!" });
    }
//mandando pra requisição da rota um id de usuário  (decoded.id)
    req.userId = user.id;

    return next();// se tiver tudo certo ele prosegue
  });
}