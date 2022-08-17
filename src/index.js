require("dotenv").config();// para o heroku
const express = require("express");
const cors = require("cors");
const connectDataBase = require('./database/database');// importamos para cá

const userRoute = require("./users/users.route");
const authRoute = require("./auth/auth.route")
const tweetsRoute = require("./tweets/tweets.route")
const swaggerRoute = require("./swagger/swagger.route")

const port = process.env.PORT || 3000;// talves cheja necessário mudar a porta para 3001. esse code e padrão para o deploy
const app = express();

/* C[ODIGO BASICO PARA UM HELLO WOLRD NA TELA
app.use("/", (req,res) =>{
  res.send({message: "hello, world"})
})
*/ 


connectDataBase()// vai conectar ao banco de dados assim que o servidor for iniciado.
app.use(cors());
app.use(express.json());// para o nosso backend reconhecer o json

app.use("/users", userRoute);
app.use("/auth", authRoute)
app.use("/tweets", tweetsRoute)
app.use("/api-docs", swaggerRoute)



app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });