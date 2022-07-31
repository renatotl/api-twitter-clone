require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDataBase = require('./database/database');

const userRoute = require("./users/users.route");
const authRoute = require("./auth/auth.route")
const tweetsRoute = require("./tweets/tweets.route")
const swaggerRoute = require("./swagger/swagger.route")

const port = process.env.PORT || 3000;
const app = express();


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