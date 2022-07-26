require("dotenv").config();
const jwt = require("jsonwebtoken");
//trazemo-nos de forma desconstruída o findByIdUserService
const { findByIdUserService } = require("../users/users.service");



//exportando uma função anónima Vamos fazer um pouco diferente na exportação da função de middleware em relação às outras funções que criamos. Ao invés de darmos um nome para função e exportá-la depois, vamos criá-la de forma anônima dentro do module.exports. É uma outra forma de trabalharmos com modularização:

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

 if(!authHeader){
   return res.status(401).send({message: "O token não foi encontrado!"})


 }


  const parts = authHeader.split(' ')// ["Bearer", "<token>"]

  if (parts.length !== 2) {//se não tiver o bearer e token
    return res.status(401).send({ message: "Token inválido!" });
  }

// o bearer agore é o schema e token continua tu=oken. o arrey foi desconstruído
  const [scheme, token] = parts;
//validando individualente
  if (!/^Bearer^/i.test(scheme)) {//verificando de scheme começa com Bearer
    return res.status(401).send({ message: "Token malformatado!" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    const user = findByIdUserService(decoded.id);//id do generateToken desconstroi 

    if (err || !user || !user.id) {//se nao tiver, ele da erro
      return res.status(401).send({ message: "Token inválido!" });
    }
//mandando pra requisição da rota um id de usuário  (decoded.id)
    req.userId = user.id;

    return next();
  });
}