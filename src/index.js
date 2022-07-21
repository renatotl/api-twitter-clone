require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDataBase = require('./database/database');

const port = process.env.PORT || 3000;
const app = express();


connectDataBase()// vai conectar ao banco de dados assim que o servidor for iniciado.
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({message: "Hello, world!"});

});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });