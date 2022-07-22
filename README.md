# api-twitter-clone
1 - depois de fazer nosso repositório no github com readme, gitignore node e mozila licence, importamos tudo para uma pasta.

2 - fizemos um npm init -y já com preconfigurado, mas mudamos algumas coisas como autor
3 - já no package.json fizemos as alterações para "scripts": {
  "dev": "nodemon index",
  "start": "node index"
},

4 - fizemos a instalação das nossas bibliotecas: npm i express, cors, dotenv, mongoose.

5 - Em seguida, instale o nodemon como dependência de desenvolvimento:
npm i nodemon -D

6 - configurações iniciais no index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


7 - Reestruturação de pastas

Antes de gerarmos o arquivo database.js, vamos criar algumas pastas e organizar o nosso back-end com uma estrutura diferente. Crie a pasta src e dentro dela crie as pastas database e users. Mova o index.js para dentro de src:

8 - mudaremos aquelas configurações do package.json

"scripts": {
  "dev": "nodemon src/index",
  "start": "node src/index"
},

9 - Dentro da pasta database, crie o arquivo database.js e configure-o:

const mongoose = require("mongoose");

const connectDatabase = () => {
  console.log("Conectando ao banco de dados...");

  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Conectado!"))
    .catch((err) => console.log(`Erro ao conectar com o banco: ${err}`));
};

module.exports = connectDatabase;

10 - Importe a função de conexão com o banco de dados no index.js:

require("dotenv").config();
const express = require("express");
const cors = require("cors");
// CÓDIGO NOVO
const connectDatabase = require("database/database");
// CÓDIGO NOVO

const port = process.env.PORT || 3001;
const app = express()

// CÓDIGO NOVO
connectDatabase();
// CÓDIGO NOVO
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

11 - Agora, abra o seu MongoDB Compass, crie um banco de dados chamado db-twitterclone e uma collection chamada users.
Crie um arquivo .env na raiz do projeto e digite a url local do seu banco de dados dentro de uma variável chamada DATABASE_URL:

12 - criar arquino na raiz .env e .en.example
DATABASE_URL = 'mongodb://localhost:27017/db-twitterclone'

13 - Vamos criar 4 arquivos responsáveis pelo cadastro e login de usuários na nossa aplicação:

User.js para o model;
users.route.js para as rotas;
users.controller.js para os controles de requisição e resposta;
users.service.js para as regras de negócio

14 - Model User.js
Vamos utilizar alguns parâmetros novos nos campos do Schema para a inserção de usuários no banco:
unique: true -> não permite com que um dado seja repetido no banco. Isso vai impedir que sejam criados usuários com o mesmo username e/ou email;
lowercase: true -> transforma a string para ter apenas letras minúsculas;
select: false -> não deixa que o campo seja exibido nas requisições GET
JÁ CONFIGURAMOS O NOSSO ARQUIVO USER.JS

15 - Vamos ter duas rotas relacionadas ao usuário: uma para cadastro e outra para exibir os usuários cadastrados. Não esqueça de importar o arquivo controller:

const router = require("express").Router();
const userController = require("users.controller");

router.post("/", userController.createUserController);
router.get("/", userController.findAllUserController);

module.exports = router;

Importe as rotas no index.js:


// Restante do código...
const connectDatabase = require("database/database");
// CÓDIGO NOVO
const userRoute = require("users/users.route");
// CÓDIGO NOVO

const port = process.env.PORT || 3001;
const app = express();

connectDatabase();
app.use(cors());

// CÓDIGO NOVO
app.use("/users", userRoute);
// CÓDIGO NOVO

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


16 - rotas chama controler que chama o service o service acessa amodel e faz toda a nosso projeto

