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

ate este ponto foi feito as congiguraç~es do tweets


Service

Adicionamos ao nosso tweets.service.js o find all, para buscarmos todos os tweets cadastrados no banco de dados: Onde: sort({ _id: -1 }) Retorna porordem dos envios mais rescentes. populate("user") Função padrão do mongo, para quando tivermos um relacionamento, assim podemos popular nosso tweet com os dados do user


const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

Agora que exportamos nossa nova função, seguimos para o controller.

Controller

Criaremos a função findAllTweetsController para enviar todos os tweets que estão no banco de dados:

Iniciamos com o try-catch, onde try tenta executar nossa lógica e o catch retorna um possível erro.

const findAllTweetsController = async (req, res) => {
  try {
  //logica
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


Agora dentro da nosso logica vamos pegar todos os tweets e verificamos se ele veio vazio, se houver tweets, pegamos cada tweet com o metodo map() e retornarmos um novo objeto de results, que são os tweets.map(), onde criamos um novo objeto, dessa vez com os dados do tweet e user.


const tweets = await tweetService.findAllTweetsService();

if (tweets.length === 0) {
return res.status(400).send({ message: "Não existem tweets!" });
}

return res.send({
results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),
})

Route

Vamos fazer a rota para listar todos os tweets.

router.get("/", authMiddleware, tweetController.findAllTweetsController);

Service

Vamos adicionar ao nosso tweets.service.js o searchTweetService, para buscarmos todos os tweets por palavra-chave ou frase. Onde teremos:

$regex: `${message || ""}` //Fornece recursos de expressão regular para strings de correspondência de padrões em consultas.

$options: "i" Insensibilidade entre maiúsculas e minúsculas para combinar maiúsculas e minúsculas.

Nessa estrutura não usamos findOne, pois buscaremos todos os tweets que as condições condizem com a função que passamos, no nosso caso conter a palavra/frase na message.

Exportamos a função:

module.exports = { createTweetService, findAllTweetsService, searchTweetService };

Terminado esses passos nosso tweets.service.js ficará assim:

const Tweet = require("./Tweet");

const createTweetService = (message, userId) =>
  Tweet.create({ message, user: userId });

const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

const searchTweetService = (message) =>
  Tweet.find({
    message: { $regex: `${message || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

module.exports = {createTweetService, findAllTweetsService, searchTweetService};

Controller

Criaremos a função searchTweetController para enviar todos os tweets que estão no banco de dados filtrados:

recebemos nossa message do body e fazemos nossa busca em searchTweetService passando nossa message, depois verificamos de nosso array veio vazio.

const searchTweetController = async (req, res) => {
  const { message } = req.query;

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existem tweets com essa mensagem!" });
  }
};

Agora que temos nossas validações entregamos o novo array assim como fizemos em findAllTweetsController


return res.send({
    tweets: tweets.map((tweet) => ({
      id: tweet._id,
      message: tweet.message,
      likes: tweet.likes.length,
      comments: tweet.comments.length,
      retweets: tweet.retweets.length,
      name: tweet.user.name,
      username: tweet.user.username,
      avatar: tweet.user.avatar,
    })),
});

Assim ficará o nosso tweets.controller.js.

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

const findAllTweetsController = async (req, res) => {
  try {
    const tweets = await tweetService.findAllTweetsService();

    if (tweets.length === 0) {
      return res.status(400).send({ message: "Não existem tweets!" });
    }

    return res.send({
      results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchTweetController = async (req, res) => {
  const { message } = req.query;

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existem tweets com essa mensagem!" });
  }

  return res.send({
    tweets: tweets.map((tweet) => ({
      id: tweet._id,
      message: tweet.message,
      likes: tweet.likes.length,
      comments: tweet.comments.length,
      retweets: tweet.retweets.length,
      name: tweet.user.name,
      username: tweet.user.username,
      avatar: tweet.user.avatar,
    })),
  });
};


module.exports = {createTweetController, findAllTweetsController, searchTweetController};


Route


A rota onde essa busca será feita será:


router.get("/search", authMiddleware, tweetController.searchTweetController);

Terminando essa rota nosso arquivo tweets.route.js fica dessa maneira:

const router = require("express").Router();

const tweetController = require("./tweets.controller");
const authMiddleware = require("../auth/auth.middleware");

router.post("/create", authMiddleware, tweetController.createTweetController);
router.get("/", authMiddleware, tweetController.findAllTweetsController);
router.get("/search", authMiddleware, tweetController.searchTweetController);

module.exports = router;

Service

Vá até o arquivo tweets.service.js e crie a função likesService, ela vai receber dois parâmetros: o id do tweet e o id do usuário. Vamos usar o método findOneAndUpdate do mongoose e vamos mandar um objeto com algumas configurações:

const likesService = (id, userId) => Tweet.findOneAndUpdate({});

Vamos buscar o id do tweet e se nenhum usuário tiver dado like nesse tweet vamos adicionar o campo likes através da query $nin. Se esse usuário já tiver dado like, essa mesma query não deixará dar outro like:


    {
        _id: id,
        "likes.userId": { $nin: [userId]}
    },

    Se for o primeiro like, vamos dar um push no array com o id do usuário e a data do like:

    {
        $push: {
            likes: { userId, created: new Date() }
        }
    },

    E, por fim, precisamos colocar um rawResult: true para o MongoDB retornar o resultado dos procedimentos acima:



    {
        rawResult: true,
    },

    Não esqueça de exportar a função:


module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService
}

No fim, o arquivo tweets.service.js deve ficar assim:


const Tweet = require("./Tweet");

const createTweetService = (message, userId) => Tweet.create({ message, user: userId });

const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

const searchTweetService = (message) => Tweet.find(
    {
      message: { $regex: `${message || ""}`, $options: "i" },
    })
    .sort({ _id: -1 })
    .populate("user");

const likesService = (id, userId) => Tweet.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId]}
    },
    {
      $push: {
        likes: { userId, created: new Date() }
      }
    },
    {
      rawResult: true,
    },
);

module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService
}

No fim, o arquivo tweets.service.js deve ficar assim:

const Tweet = require("./Tweet");

const createTweetService = (message, userId) => Tweet.create({ message, user: userId });

const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

const searchTweetService = (message) => Tweet.find(
    {
      message: { $regex: `${message || ""}`, $options: "i" },
    })
    .sort({ _id: -1 })
    .populate("user");

const likesService = (id, userId) => Tweet.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId]}
    },
    {
      $push: {
        likes: { userId, created: new Date() }
      }
    },
    {
      rawResult: true,
    },
);

module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService
}


Controller

Vamos criar a função likeTweetController. Receberemos o id do tweet do parâmetro da requisição e o userId do middleware:

const likeTweetController = async (req, res) => {
  const { id } = req.params;
    
  const userId = req.userId;
};

Invocaremos a função likesService e passaremos o id e o userId. Validaremos se o tweet recebeu um like através do lastErroObject.n, se ele for igual a zero, quer dizer que o tweet já recebeu um like daquele usuário:

Route
Vamos adicionar a rota do like:

router.patch("/:id/like", authMiddleware, tweetController.likeTweetController)

Service

Vá até o arquivo tweets.service.js e crie a função retweetsService, ela vai receber dois parâmetros: o id do tweet e o id do usuário. Vamos usar o método findOneAndUpdate do mongoose e vamos mandar um objeto com algumas configurações:

const retweetsService = (id, userId) => Tweet.findOneAndUpdate({});

Vamos buscar o id do tweet e se nenhum usuário tiver dado retweet nesse tweet vamos adicionar o campo retweets através da query $nin. Se esse usuário já tiver dado retweets, essa mesma query não deixará dar outro retweet:

    {
        _id: id,
        "retweets.userId": { $nin: [userId]}
    }, 


    Se for o primeiro retweet, vamos dar um push no array com o id do usuário e a data do retweet:


    {
        $push: {
            retweets: { userId, created: new Date() }
        }
    },

    E, por fim, precisamos colocar um rawResult: true para o MongoDB retornar o resultado dos procedimentos acima:


    {
        rawResult: true,
    },

    Não esqueça de exportar a função:


module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService
}

Service


Vá até o arquivo tweets.service.js e crie a função retweetsService, ela vai receber dois parâmetros: o id do tweet e o id do usuário. Vamos usar o método findOneAndUpdate do mongoose e vamos mandar um objeto com algumas configurações:


const retweetsService = (id, userId) => Tweet.findOneAndUpdate({});

Vamos buscar o id do tweet e se nenhum usuário tiver dado retweet nesse tweet vamos adicionar o campo retweets através da query $nin. Se esse usuário já tiver dado retweets, essa mesma query não deixará dar outro retweet:


    {
        _id: id,
        "retweets.userId": { $nin: [userId]}
    },

    Se for o primeiro retweet, vamos dar um push no array com o id do usuário e a data do retweet:


    {
        $push: {
            retweets: { userId, created: new Date() }
        }
    },

    E, por fim, precisamos colocar um rawResult: true para o MongoDB retornar o resultado dos procedimentos acima:


    {
        rawResult: true,
    },

    Não esqueça de exportar a função:


module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService
}

No fim, o arquivo tweets.service.js deve ficar assim:


const Tweet = require("./Tweet");

const createTweetService = (message, userId) => Tweet.create({ message, user: userId });

const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

const searchTweetService = (message) =>
  Tweet.find({
    message: { $regex: `${message || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const likesService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId] },
    },
    {
      $push: {
        likes: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

const retweetsService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "retweets.userId": { $nin: [userId] },
    },
    {
      $push: {
        retweets: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService
}



Controller


Vamos criar a função retweetTweetController . Receberemos o id do tweet do parâmetro da requisição e o userId do middleware:


const retweetTweetController  = async (req, res) => {
  const { id } = req.params;
    
  const userId = req.userId;
};

Invocaremos a função retweetsService e passaremos o id e o userId. Validaremos se o tweet recebeu um retweet através do lastErroObject.n, se ele for igual a zero, quer dizer que o tweet já recebeu um retweet daquele usuário:


  const tweetRetweeted = await tweetService.retweetsService(id, userId);

  if (tweetRetweeted.lastErrorObject.n === 0) {
    return res
      .status(400)
      .send({ message: "Você já deu retweet neste tweet!" });
  }

  Por fim, devolvemos uma resposta:


  return res.send({
    message: "Retweet realizado com sucesso!",
  });

  Não esqueça de exportar a função:


module.exports = {
  createTweetController, 
  findAllTweetsController, 
  searchTweetController,
  likeTweetController,
  retweetTweetController,
};

Route

Vamos adicionar a rota do retweet:


router.patch(
  "/:id/retweet",
  authMiddleware,
  tweetController.retweetTweetController
);

Comment Tweet


Service


Vá até o arquivo tweets.service.js e crie a função commentsService , ela vai receber dois parâmetros: o id do tweet e o id do usuário. Vamos usar o método findOneAndUpdate do mongoose e vamos mandar um objeto com algumas configurações:


const commentsService = (id, userId) => Tweet.findOneAndUpdate({});

Vamos buscar o id do tweet:


    {
      _id: id,
    },

    Vamos dar um push no array com o id do usuário e a data do comment:


    {
      $push: {
        comments: { userId, created: new Date() },
      },
    },

    E, por fim, precisamos colocar um rawResult: true para o MongoDB retornar o resultado dos procedimentos acima:


    {
        rawResult: true,
    },

    Não esqueça de exportar a função:


module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService,
  commentsService,
}

No fim, o arquivo tweets.service.js deve ficar assim:


const Tweet = require("./Tweet");

const createTweetService = (message, userId) => Tweet.create({ message, user: userId });

const findAllTweetsService = () => Tweet.find().sort({ _id: -1 }).populate("user");

const searchTweetService = (message) =>
  Tweet.find({
    message: { $regex: `${message || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const likesService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId] },
    },
    {
      $push: {
        likes: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

const retweetsService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "retweets.userId": { $nin: [userId] },
    },
    {
      $push: {
        retweets: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

const commentsService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        comments: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService,
  commentsService,
}


Controller


Vamos criar a função commentTweetController . Receberemos o id do tweet do parâmetro da requisição e o userId do middleware:


const commentTweetController   = async (req, res) => {
  const { id } = req.params;
    
  const userId = req.userId;
};


const commentTweetController   = async (req, res) => {
  const { id } = req.params;
    
  const userId = req.userId;
};


Invocaremos a função commentsService e passaremos o id e o userId:


  await tweetService.commentsService(id, userId);

  Por fim, devolvemos uma resposta:


  return res.send({
    message: "Comentário realizado com sucesso!",
  });


  Não esqueça de exportar a função:

module.exports = {
  createTweetController, 
  findAllTweetsController, 
  searchTweetController,
  likeTweetController,
  retweetTweetController,
  commentTweetController,
};

No fim, o arquivo tweets.controller.js deve ficar assim:


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

const findAllTweetsController = async (req, res) => {
  try {
    const tweets = await tweetService.findAllTweetsService();

    if (tweets.length === 0) {
      return res.status(400).send({ message: "Não existem tweets!" });
    }

    return res.send({
      results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchTweetController = async (req, res) => {
  const { message } = req.query;

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existem tweets com essa mensagem!" });
  }

  return res.send({
    tweets: tweets.map((tweet) => ({
      id: tweet._id,
      message: tweet.message,
      likes: tweet.likes.length,
      comments: tweet.comments.length,
      retweets: tweet.retweets.length,
      name: tweet.user.name,
      username: tweet.user.username,
      avatar: tweet.user.avatar,
    })),
  });
};

const likeTweetController = async (req, res) => {
  const { id } = req.params;
    
  const userId = req.userId;
  
  const tweetLiked = await tweetService.likesService(id, userId);

  if (tweetLiked.lastErrorObject.n === 0) {
      return res.status(400).send({ message: "Você já deu like neste tweet!"})
  };
  
  return res.send({
    message: "Like realizado com sucesso!"
  });
};

const retweetTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  const tweetRetweeted = await tweetService.retweetsService(id, userId);

  if (tweetRetweeted.lastErrorObject.n === 0) {
    return res
      .status(400)
      .send({ message: "Você já deu retweet neste tweet!" });
  }

  return res.send({
    message: "Retweet realizado com sucesso!",
  });
};

const commentTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  await tweetService.commentsService(id, userId);

  return res.send({
    message: "Comentário realizado com sucesso!",
  });
};

module.exports = {
  createTweetController,
  findAllTweetsController,
  searchTweetController,
  likeTweetController,
  retweetTweetController,
  commentTweetController,
};

Route


Vamos adicionar a rota do comment:


router.patch(
  "/:id/comment",
  authMiddleware,
  tweetController.commentTweetController
);


Será um patch pois vamos modificar apenas um campo no documento e não ele inteiro.



PAGINAÇÃO

A paginação é importante para deixar nossa aplicação mais fluida. Imagina o Twitter ter que carregar todos os tweets de uma só vez, demoraria muito até o usuário conseguir usar.


Para adicionarmos paginação no nosso projeto, vamos precisar alterar algumas funções do tweets.service.js e do tweets.controller.js.


Service

Vamos até o arquivo tweets.service.js e alterar a função findAllTweetsService.

Vamos adicionar o método limit do mongoose. Ele limita quantos documentos serão mostrados. Colocaremos esse valor como parâmetro na função:


const findAllTweetsService = (limit) => 
  Tweet.find().sort({ _id: -1 }).limit(limit).populate("user");

No frontend temos um botão Ver mais, quando eu apertar nesse botão, ele não pode me mostrar os mesmos documentos, ele precisa "pular" os documentos mostrados e mostrar os que estão depois dele.

Para isso, vamos usar outro método do mongoose chamado skip e passaremos, como parâmetro na função, o offset: quantidade de documentos que ele precisa "pular":

const findAllTweetsService = (offset, limit) =>
  Tweet.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

Vamos precisar do valor total de documentos cadastrados no banco. Utilizaremos o método countDocuments do mongoose:


const countTweets = () => Tweet.countDocuments();

Não esqueça de exportar essa função:


module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService,
  commentsService,
  countTweets,
};

No fim, o arquivo tweets.service.js deve ficar assim:

const Tweet = require("./Tweet");

const createTweetService = (message, userId) =>
  Tweet.create({ message, user: userId });

const findAllTweetsService = (offset, limit) =>
  Tweet.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countTweets = () => Tweet.countDocuments();

const searchTweetService = (message) =>
  Tweet.find({
    message: { $regex: `${message || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const likesService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId] },
    },
    {
      $push: {
        likes: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

const retweetsService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
      "retweets.userId": { $nin: [userId] },
    },
    {
      $push: {
        retweets: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

const commentsService = (id, userId) =>
  Tweet.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        comments: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );

module.exports = {
  createTweetService,
  findAllTweetsService,
  searchTweetService,
  likesService,
  retweetsService,
  commentsService,
  countTweets,
};

Controller

Vamos até o arquivo tweets.controller.js e alterar a função findAllTweetsController.

Antes de buscar os tweets, vamos definir as variáveis offset e limit que virão através de query params da requisição:

    let { limit, offset } = req.query;

    Fixaremos os tipos delas como Number. Se o offset não for informado, definiremos o valor igual a 0 e se o limit não for informado, definiremos o valor igual a 6. Você pode definir o valor que quiser no limit. E após isso, passaremos essa variáveis nos parâmetros da função finAllTweetsService:

    offset = Number(offset);
    limit = Number(limit);

    if (!offset) {
      offset = 0;
    }

    if (!limit) {
      limit = 6;
    }

    const tweets = await tweetService.findAllTweetsService(offset, limit);

    Invocaremos a função countTweets do service para guardar o total de documentos cadastrados no banco:

     const total = await tweetService.countTweets();

     Vamos precisar gerar uma URL de next e previous.

Guardaremos a URL atual dentro de uma const:


Vamos definir o valor de next que será a quantidade de documentos da página atual mais o limite e passaremos esse valor como query param na URL atual. Enquanto houver documentos a serem mostrados, a URL será disponibilizada para a próxima página, não havendo mais documentos, retornaremos null. Podemos usar esse valor para desativar o botão do front quando o mesmo estiver na última página:

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null

    Sintaxe - Operador ternário condicional (ternary)

condição ? valorSeVerdadeiro : valorSeFalso

O valor de previous será a quantidade de documentos da página atual menos o limite e passaremos esse valor como query param na URL atual. Enquanto houver documentos a serem mostrados, a URL será disponibilizada para a página anterior, não havendo mais documentos, retornaremos null. Podemos usar esse valor para desativar o botão do front quando o mesmo estiver na primeira página:


    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

        Agora, vamos devolver todos esses valores para o front:

    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),



      No fim, o arquivo tweets.controller.js deve ficar assim:


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

const findAllTweetsController = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 6;
    }

    if (!offset) {
      offset = 0;
    }

    const tweets = await tweetService.findAllTweetsService(offset, limit);

    const total = await tweetService.countTweets();

    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (tweets.length === 0) {
      return res.status(400).send({ message: "Não existem tweets!" });
    }

    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: tweets.map((tweet) => ({
        id: tweet._id,
        message: tweet.message,
        likes: tweet.likes.length,
        comments: tweet.comments.length,
        retweets: tweet.retweets.length,
        name: tweet.user.name,
        username: tweet.user.username,
        avatar: tweet.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchTweetController = async (req, res) => {
  const { message } = req.query;

  const tweets = await tweetService.searchTweetService(message);

  if (tweets.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existem tweets com essa mensagem!" });
  }

  return res.send({
    tweets: tweets.map((tweet) => ({
      id: tweet._id,
      message: tweet.message,
      likes: tweet.likes.length,
      comments: tweet.comments.length,
      retweets: tweet.retweets.length,
      name: tweet.user.name,
      username: tweet.user.username,
      avatar: tweet.user.avatar,
    })),
  });
};

const likeTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  const tweetLiked = await tweetService.likesService(id, userId);

  if (tweetLiked.lastErrorObject.n === 0) {
    return res.status(400).send({ message: "Você já deu like neste tweet!" });
  }

  return res.send({
    message: "Like realizado com sucesso!",
  });
};

const retweetTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  const tweetRetweeted = await tweetService.retweetsService(id, userId);

  if (tweetRetweeted.lastErrorObject.n === 0) {
    return res
      .status(400)
      .send({ message: "Você já deu retweet neste tweet!" });
  }

  return res.send({
    message: "Retweet realizado com sucesso!",
  });
};

const commentTweetController = async (req, res) => {
  const { id } = req.params;

  const userId = req.userId;

  await tweetService.commentsService(id, userId);

  return res.send({
    message: "Comentario realizado com sucesso!",
  });
};

module.exports = {
  createTweetController,
  findAllTweetsController,
  searchTweetController,
  likeTweetController,
  retweetTweetController,
  commentTweetController,
};


A documentação é importante por diversos fatores, quase todos eles relacionados à organização, mas também por questões de produtividade (para quem vai consumir as informações) e eficiência na comunicação.

Apesar de haver reuniões para apresentar as atualizações internas de um projeto, é inviável fornecer as informações de todas as funcionalidades em conversas.

É por isso que a documentação, vai evitar muitas outras complicações, confusões e explicações repetitivas.

Além das questões internas (de equipe e colaboração) imagine que todo projeto de back-end tem a possibilidade de ser uma API com endereço público onde vários front-ends farão consultas, ou seja, várias equipes vão precisar saber sobre as informações dos endpoints do back-end para desenvolver seus projetos de front-end.

Felizmente, o Swagger existe para nos ajudar na produção dessa documentação dos endpoints do back-end e torna possível que alguns testes sejam feitos em uma interface amigável no próprio navegador, o que facilita o trabalho de todas as equipes que irão consumir essas informações.

Instalação e configuração inicial

Tendo em mente que a organização é uma das chaves para o sucesso, vamos começar!

Em nosso projeto criamos uma pasta para o Swagger com os arquivos swagger.json e swagger.route.js.

Em seguida instalamos o Swagger em nosso projeto, via Terminal com o seguinte comando:

npm i swagger-ui-express

Lembre-se de dar o comando acima na pasta do projeto! 😁

swagger.route.js

O arquivo swagger.route.js será o responsável pela configuração central do Swagger, fazendo a requisição do swagger-ui-express que instalamos e indicando também o nosso arquivo swagger.json que é responsável pelas rotas de endpoint que o Swagger disponibilizará para consulta, utilizando configurações do Router.

O arquivo swagger.route.js ficará com o seguinte código:


const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

route.use("/", swaggerUi.serve);
route.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;

Importando o Swagger

Agora vamos sinalizar para a nossa aplicação que existem configurações para o Swagger no arquivo swagger.route.js adicionando as seguintes linhas de código no arquivo index.js:

const swaggerRoute = require("./swagger/swagger.route");

E para utilizar a nossa importação, criamos um caminho para essa rota:

app.use("/api-docs", swaggerRoute);

Por questão de organização visual e boas práticas, as linhas devem ser adicionadas no index.js em seus respectivos "blocos", e o nosso index.js vai ficar assim:

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database/database");
const userRoute = require("./users/users.route");
const authRoute = require("./auth/auth.route");
const tweetsRoute = require("./tweets/tweets.route");
// NOVO CÓDIGO
const swaggerRoute = require("./swagger/swagger.route");
// NOVO CÓDIGO

const port = process.env.PORT || 3001;
const app = express();

connectDatabase();
app.use(cors());
app.use(express.json());

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/tweets", tweetsRoute);
// NOVO CÓDIGO
app.use("/api-docs", swaggerRoute);
// NOVO CÓDIGO

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

Teste preliminar

Com essas configurações, já podemos fazer um teste para ver se tudo foi instalado corretamente e a rota configurada leva até a interface do Swagger.

Para esse teste, vamos inserir chaves vazias {} dentro do nosso arquivo swagger.json apenas para esse teste (vamos configurar o arquivo swagger.json logo adiante).

Com o servidor rodando no Terminal:

npm run dev

Vamos até o navegador, no endpoint que configuramos, para obter o seguinte tela de erro do Swagger:

localhost3000/apai-docs/


TESTANDO O SWAGGER NO ENDPOINT 
http://localhost:3000/api-docs/


Modificações na rota POST

No arquivo tweets.route.js vamos modificar a rota POST inclusive para torná-la semântica através da adição do código "/create" no endpoint POST e essa linha vai ficar assim:

//CÓDIGO ANTERIOR
router.post("/", authMiddleware, tweetController.createTweetController);
//CÓDIGO ANTERIOR

//CÓDIGO NOVO
router.post("/create", authMiddleware, tweetController.createTweetController);
//CÓDIGO NOVO

Atualizando a rota POST no front-end

Vamos fazer essa alteração no projeto do front-end no arquivo tweet-box.tsx:

na linha 20, ficando assim:


  const sendTweet = async () => {
    const response = await fetch('http://localhost:3001/tweets/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: tweetData,
      }),
    });

    Configurando as variáveis de ambiente

A partir desse sucesso, sabemos que o nosso projeto está no ar e vamos iniciar as configurações dentro do Heroku, disponibilizadas na guia "Settings".

A primeira configuração que vamos fazer são as variáveis que estão dentro do arquivo .env - lembrando que o arquivo .env é onde configuramos as senhas e, como não queremos que ninguém as veja, elas não ficam disponíveis no repositório.

Portanto, podemos adicionar essas variáveis secretas diretamente nas configurações da nuvem, para que sejam criptografadas.

Na nuvem do Heroku, as configurações do .env são acessadas clicando em "Config Vars" dentro da tab "Settings".


No nosso arquivo .env temos duas variáveis:

DATABASE_URL = "link gerado no site do MongoDB"
SECRET = "segredo do .env local"

O SECRET pegamos o mesmo valor do .env local:


DATABASE_URL vamos utilizar o link gerado no site do MongoDB. Para isso vamos até a aba do site do MongoDB em "Database", depois clique em "Connect":


Clique em "Connect your application".


Copiamos a URL gerada.


Opcionalmente, podemos substituir essa URL no arquivo .env local e guardar o endereço local no próprio arquivo:


Já a configuração no Heroku adicionamos o nome das variáveis e os valores com os respectivos campos KEY e o valor VALUE:


Atualizando o swagger.json

Mudamos também no arquivo do nosso projeto:

{
  "openapi": "3.0.0",
  "info": {
    "title": "API Twitter Clone",
    "description": "API do clone do Twitter",
    "contact": {
      "email": "seu@email.com.br"
    },
    "version": "1.0.0"
  },
  "servers": [
    { //NOVA URL COMO PRIORITÁRIA
      "url": "https://bluetwitterclone.herokuapp.com",
      "description": "API no Heroku"
    },
    {
      "url": "http://localhost:3001",
      "description": "API local"
    }
  ],
  "paths": { ...
  []

  Após mudar no projeto local, fazemos o commit dessas alterações e aguardamos que sejam feitas pelo Heroku através de uma nova build.

As alterações levam algum tempo e pode ser vista em "Latest Activity" na guia "Overview" do projeto.


Assim que aparecer o status "Deployed" já podemos constatar as mudanças atualizando a página do App no navegador:


Se dermos um GET pelo Swagger vamos obter a mensagem:

{
  "message": "Não existem usuários cadastrados"
}

Então vamos adicionar o primeiro usuário ao banco de dados que na nuvem ainda está vazio pelo Swagger mesmo, na rota "users/create" que utiliza o método POST:


Após o cadastro de primeiro usuário, já podemos obter um token de acesso, seguindo para a área de Login.


Clique em "Try Out" e depois em "Execute".

E copiamos o token de acesso sem as aspas:


Subindo a página, clicamos em "Authorize" para inserir o "bearerAuth" e prosseguir com o teste das outras rotas.

Da mesma forma que fizemos, pratique algumas requisições aleatórias pela interface do Swagger sem consultar o material de estudos.

Considerações gerais sobre documentação

A informação dos endpoints pelo Swagger não é a única forma de documentar uma API.

Também fazem parte de uma boa documentação arquivos como o readme.md na pasta do repositório e até mesmo uma página na web dedicada.

Para conhecer mais formas de documentação, procure no Google termos como "API pública consulta CEP" ou quaisquer outras com termos como "documentação API" de plataformas como FB, Instagram, Google Maps, Spotify etc.

Dependendo da complexidade da API, pode conter muitos textos, artigos, imagens, tutoriais, exemplos etc.

A internet como a conhecemos hoje, com interconectividade entre as plataformas (tipo fazer login com o GitHub no Heroku) e muito mais, só é possível através das APIs.

É tão importante quanto o próprio código que programa a API, é também a documentação.

Afinal apenas através da documentação é que vamos realmente disponibilizar todas as funcionalidades para o mundo! 🚀💙



