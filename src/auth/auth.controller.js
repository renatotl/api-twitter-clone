const authService = require("./auth.service")
require("dotenv").config();//acessa as variávris de ambiente
const bcrypt = require("bcryptjs")

const loginController = async (req, res) => {
  
  /* CURIOSIDADE se agente dixar assim:   res.send("Login ok")
Login ok aparece como HTML  lá no Thunde, mas se a gente manda assim:
  res.send({message: "Loginok"}). aparecerá em formato Json
  */
const {email, password} = req.body; // recebendo o email e password do body

const user = await authService.loginService(email)//vamos procurar pelo email

// validando primeira autenticação
if(!user){
 return res.status(400).send({massage: "Usuário não encontrado "})


}
// segunda validaçãp 
// foi necessáio importat o bcrypt para esta parte
const isPasswordValid = await bcrypt.compare(password, user.password)// ele vai compara os 2 parâmetros o (password)este veio no body (user.password) este é o que está no usuário/ compara a senha do usuário com a a senha digitada

if(!isPasswordValid){
  return res.status(400).send({massage: "Senha inválida "})
}
const token = authService.generateToken(user.id);

res.send({ token });


}




//as chaves significa enfiar objeto que é um padão mesmo tendo só um item.
module.exports = {loginController};