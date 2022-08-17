const mongoose = require(
    'mongoose'
);// trazendo meus arquivos do mongoose para minha variável mongoose

// função
const connectDataBase = () => {
console.log("Conectando com o banco de dados...")

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))//o .then é uma promice
.catch(err => console.log("Erro ao conectar com o banco"))// uma promice 
}


// exportando
module.exports = connectDataBase