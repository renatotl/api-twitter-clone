const userService = require("./users.service");

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
if (foundUser) {// se existir algúm usuário
    return res.status(400).send({
      message: "Usuário já existe!",
    });
}
const user = await userService.createUserService(req.body).catch((err) => console.log(err.message)) //ele vai enviar o que vier da requisição do body

if(!user){// se não tiver usuário
   return res.status(400).send({
    message: "Erro ao criar usuário!",
   });
}

res.status(201).send(user);

}

const findAllUserController = async (req,res) => {



}


module.exports = {
     createUserController,
     findAllUserController
     };
