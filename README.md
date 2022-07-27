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



17 - Thunder Client: Global Enviroment

Crie a collection: API_TWITTER no seu Thunder Client para facilitar o teste das rotas.
Vamos aprender a trabalhar com as enviroments do TC para facilitar os nossos testes.
Na aba Env > clique nas 3 barras > New Enviroment:

Nomeie a env como (Global Env), clique sobre ela e nomeie a variável como baseURL e o valor dela será nossa URL local: http://localhost:3000. Por fim, salve:
Agora você pode utilizar a variável em suas requisições ao invés de sempre digitar a URL.
Para utilizar a variável chame-a entre chaves duplas {{}}. Exemplo:
{{baseURL}}/users/



18 - deixamos configurado nossa rota create

19 - deixamos prontos o service e controle do findALL
o find é um método do mongoose

20 - npm i bcryptjs Vá até o arquivo do model User.js e importe o bcryptjs:
const bcrypt = require("bcryptjs");
21 - no final do nosso user.js colocamos o UserSchema.pre('save', () =>{})
e importamos 


SOBRE O BCRUPT
A senha será transformada em um hash. Precisamos de um salt para deixar o hash mais forte.

Hash
Um hash é o resultado de uma função de hash, que é uma operação criptográfica que gera identificadores únicos e irrepetíveis a partir de uma determinada informação que no nosso caso é a senha.

Salt
Se dois usuários tiverem a mesma senha, eles terão os mesmos hashes. É possivel evitar isso adicionando um salt ao hash.

O salt é uma string aleatória que pode ser concatenada (pré-fixando ou pós-fixando) na senha.
Isso torna o hash de uma senha em uma string completamente diferente. Para verificar se uma senha está correta, é necessário o salt. Ele é normalmente armazenado no repositório no mesmo local do hash, ou junto dele


 após a definição do Schema, utilize o método pre e informe dois parâmetros: "save" para executar a encriptação antes de salvar a senha e a função que fará a encriptação. A função será assíncrona pois o bcrypt retorna uma Promisse e terá um next já que ela é um middleware

 Dentro da função, acima do next() chamaremos o campo password com a palavra-chave this para me referir ao password que está nesse arquivo. O this.password receberá o método hashdo bcrypt com dois parâmetros: a senha que sofrerá o hash e o valor do salt:



22 - Auth Documents
Vamos ter apenas uma rota de login. Não esqueça de importar o arquivo controller:
const router = require("express").Router();
const authController = require("./auth.controller");

router.post("/login", authController.loginController);

module.exports = router;
Importe a rota no index.js:
const authRoute = require("./auth/auth.route");
app.use("/auth", authRoute);

foi necessário criar uma past auth em src e ceiar os arquivos:
auth.controller.js, auth.route.js, auth.service.js e auth.middleware.js

;;;;;;
auth.service vai ter um gerador de token
auth.middleware valida o token e barra pessoas mas itencionadas 

23 - foi feito uma rota as configurações em auth.route

24 - authController já configurado e exportado
25 - fizemos um baseURL exclusivo para auth/login


Controller (Login)

Vamos iniciar importando o authService que contém as regras de negócio e o bcrypt que fará a validação da senha:

const authService = require("./auth.service");
const bcrypt = require("bcryptjs");

Criaremos a função loginController e receberemos do corpo da requisição o email e a senha para efetuar o login:

const loginController = async (req, res) => {
  const { email, password } = req.body;
};

Invocaremos a função do service que buscará as informações do usuário através do email e faremos uma validação caso esse usuário não exista:

  const user = await authService.loginService(email);

  if (!user) {
    return res.status(400).send({ message: "Usuário não encontrado!" });
  }

  Faremos a validação de senha usando o método compare do bcrypt. Passamos dois parâmetros: a senha informada pelo usuário e a senha cadastrada no banco de dados. Caso as senhas não conferirem, informaremos uma mensagem de erro;

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).send({ message: "Senha inválida!" });
  }

  Passada todas as validações, retornaremos as informações do usuário:

  res.send(user);

  Não esqueça de exportar a função:

module.exports = { loginController };

Após isso, o arquivo auth.controller.js ficará assim:

const authService = require("./auth.service");
const bcrypt = require("bcryptjs");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginService(email);

  if (!user) {
    return res.status(400).send({ message: "Usuário não encontrado!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).send({ message: "Senha inválida!" });
  }

  res.send(user);
};

module.exports = { loginController };
;;;
Service (Login)

Começamos importando o model User que será usado para manipularmos o banco de dados:

const User = require("../users/User");

Para buscarmos um usuário no banco de dados através do email, criaremos a função loginService que receberá o email como parâmetro, nela utilizaremos o método findOne do mongoose. Utilizaremos outro método chamado select para modificarmos o parâmetro do password predefinido no model, alterando o false para true e recebendo a senha para que a mesma possa ser conferida no controller:

const loginService = (email) => User.findOne({ email: email }).select("+password");

Não esqueça de exportar a função:

module.exports = { loginService };

Após isso, o arquivo auth.service.js deve ficar assim:

const User = require("../users/User");

const loginService = (email) => User.findOne({ email: email }).select("+password");

module.exports = { loginService };


::::

JWT ou JSON Web Token é um padrão de mercado que tem como objetivo transmitir ou armazenar de forma compacta e segura objetos JSON entre diferentes aplicações.

O JWT é utilizado em dois principais cenários, quando queremos realizar um processo de autorização em nossa aplicação ou quando queremos realizar troca de informações.

Vamos instalar a biblioteca jsonwebtoken para gerar os tokens. Abra o terminal e execute o comando:

npm i jsonwebtoken
///

Service (JWT)

Vá até o arquivo auth.service.js e importe o jsonwebtoken:

const jwt = require("jsonwebtoken");


Vamos criar a função generateToken que será responsável por gerar o token. Dentro dela utilizaremos o método sign do jwt que receberá três parâmetros: o ID do usuário que está sendo autenticado, a chave secreta da aplicação e o tempo de expiração do token, em segundos:

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: 86400 });

A chave secreta é um hash MD5 qualquer e deve ser guardada no seu arquivo .env:

SECRET = 7bfd3923d29dd78e2521e0330a48fb89

importante para gerar o codigo hash baste no google md5 hash generate e a palavra que for escrita gerará um hash

------
Vá até o auth.controller.js e importe o dotenv:

require("dotenv").config();

Dentro da função loginController, invoque a função generateToken do authService e passe o ID do usuário como parâmetro. No fim, substitua a resposta pelo token:

/////
Esse middleware será responsável por permitir ou bloquear o acesso de usuários às rotas de Tweet que construiremos nas próximas aulas.

Vamos iniciar criando uma função que será responsável por buscar um usuário por ID no banco de dados. Vá até o arquivo users.service.js, crie uma função chamada findByIdUserService e chame o método findById do mongoose:

const findByIdUserService = (idUser) => User.findById(idUser);

Agora, vamos começar a construir o nosso middleware. Abra o arquivo auth.middleware.js e importe:

O dotenv pois vamos usar nossa chave secreta;
O jwt para fazer a verificação do token;
E a função findByIdUserService de forma descontruída para buscarmos o usuário no banco de dados.


Buscaremos da requisição o tokenatravés dos headers e já faremos a validação caso esse token não seja informado:

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "O token não foi informado!" });
  }

O token jwt possui uma formatação padrão: Bearer <token>, se o token não tiver essa formatação, ele é um token inválido. Vamos dividi-lo em duas partes através do método split para assim podermos analisá-lo de forma assertiva:


  const parts = authHeader.split(" "); // ["Bearer", "<token>"]

  if (parts.length !== 2) {
    return res.status(401).send({ message: "Token inválido!" });
  }


Vamos desconstruir o array e validar se a primeira palavra é o Bearer. Utilizaremos uma regex para isso:

  const [scheme, token] = parts;

  if (!/^Bearer^/i.test(scheme)) {
    return res.status(401).send({ message: "Token malformatado!" });
  }



  Expressões Regulares (regex)

Expressões regulares são padrões utilizados para selecionar combinações de caracteres em uma string. Em JavaScript, expressões regulares também são objetos. Elas podem ser utilizadas com os métodos exec e test do objeto RegExp, e com os métodos match, replace, search, e split do objeto String

Agora, utilizaremos o método verify do jwt que fará a verificação do token e retornará, na requisição, o ID do usuário autenticado. O método receberá três parâmetros: o token, a chave secreta e a função que retornará o usuário.

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {});

  A função de callback terá dois parâmetros: um erro e a decodificação do token. Vamos buscar o usuário através do ID informado no token, validar se não aconteceu nenhum erro ou se o usuário foi encontrado e, por fim, devolveremos na requisição o ID desse usuário. Se tudo der certo, chegamos no next e terminamos a validação do token:


  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    const user = findByIdUserService(decoded.id);

    if (err || !user || !user.id) {
      return res.status(401).send({ message: "Token inválido!" });
    }

    req.userId = user.id;

    return next();
  });



Vamos desconstruir o array e validar se a primeira palavra é o Bearer. Utilizaremos uma regex para isso:





PASTA TWEETS na src.

- Tweet.js   nossa model
- tweets.controller.js
- tweets.route.js
- tweets.service.js

const tweetsRoute = require("./tweets/tweets.route")
no index criamos e 
app.use("/tweets", tweetsRoute)

deixamos configurado nosso Tweet.js

=====Service

Começamos importando o model Tweet que será usado para manipularmos o banco de dados;

const Tweet = require("./Tweet");

Para salvar um tweet no banco de dados, criaremos a função createTweetService que receberá message que é a mensagem/tweet e userId que é o usuário que fez o tweet como parâmetros, nela utilizaremos o método create do mongoose:

const createTweetService = (message, userId) => Tweet.create({message, user:userId});

Não esqueça de exportar a função:

module.exports = { createTweetService };

=====Controller

Começamos importando o tweetService que contém as regras de negócio:

const tweetService = require("./tweets.service");

Criaremos a função createTweetController e receberemos do corpo da requisição as informações para criar um tweet:

const createTweetController = async (req, res) => {};

Try -Catch

Inicialmente vamos desconstruir nosso body e pegar somente o parâmetro message, fazendo a validação caso o campo esteja vazio:

const {message} = req.body;

if(!message){
	res.status(400).send({message:"O Envie todos os dados necessários para a criação do tweet"});
}

Vamos pegar o ID do nosso usuário que está logado:

const { id } = await tweetService.createTweetService(message, req.userId);

Em seguida mandamos para o nosso front-end a mensagem que o tweet foi criado:

return res.send({
	message:"Tweet criado com sucesso!",
	tweet: {id, message},
})

Após isso, o arquivo tweets.controller.js ficará assim:

const tweetService = require("./tweets.service");

const createTweetController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).send({
        message: "Envie todos os dados necessário para a criação do tweet",
      });
    }

    const { id } = await tweetService.createTweetService(message, req.userId);

    return res.send({
      message: "Tweet criado com sucesso!",
      tweet: { id, message },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {createTweetController}

===Route

Vamos fazer a rota para criar os tweets. Não esqueça de importar o arquivo tweets.controller.js.

const router = require("express").Router();

const tweetController = require("./tweets.controller");
const authMiddleware = require("../auth/auth.middleware");

router.post("/create", authMiddleware, tweetController.createTweetController);

module.exports = router;


Importe as rotas no index.js:


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database/database");
const userRoute = require("./users/users.route");
const authRoute = require("./auth/auth.route");
const tweetsRoute = require("./tweets/tweets.route");

const port = process.env.PORT || 3001;
const app = express();

connectDatabase();
app.use(cors());
app.use(express.json());

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/tweets", tweetsRoute);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

