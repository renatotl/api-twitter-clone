const userService = require("./users.service");
const authService = require("../auth/auth.service")


const createUserController = async (req,res) => {
// fazendo o create
const {name, username, email, password, avatar} = req.body//fazemos uma const desestruturando nossos campos

//validando e tratamento de erro
if(!username || !name || !email || !password || !avatar){//se não tiver nenhum desses
   return res.status(400).send({message:"Alguns campos estão faltando. Os campos são: 'username', 'name', email, 'password' ou 'avatar'",
})

}
//Faremos uma validação para que o usuário não tente criar uma conta com um email já registrado. Invocamos uma função do service que buscará o email informado no banco de dados:

const foundUser = await userService.findByEmailUserService(email);// vem lá do service
if (foundUser) {// se existir algúm usuário que chegou no service
    return res.status(400).send({
      message: "Usuário já existe!",
    });
}
// se o usuário não existir então já cria um
const user = await userService.createUserService(req.body).catch((err) => console.log(err.message)) //ele vai enviar o que vier da requisição do body

if(!user){// se não tiver usuário
   return res.status(400).send({
    message: "Erro ao criar usuário!",
   });
}

const token = authService.generateToken(user.id);

res.status(201).send({
  user: {
    id: user.id,
    name,
    username,
    email,
    avatar,
  },
  token,// manda o token que foi gerado
});

}

// rotas de todos os usuários
const findAllUserController = async (req,res) => {
const users = await userService.findAllUserService()

if(users.length === 0) { 
return res.status(400).send({
   message: "Não existem usuários cadastrados!",
});
}

res.send(users)
};


module.exports = {
     createUserController,
     findAllUserController
     };


     //ERRO se trata no controller
     // o users.ervice contem nossas regras de negócios