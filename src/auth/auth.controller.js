const authService = require("./auth.service")

const loginController = async (req, res) => {
  res.send({message: "Login ok"});
  /* CURIOSIDADE se agente dixar assim:   res.send("Login ok")
Login ok aparece como HTML  lá no Thunde, mas se a gente manda assim:
  res.send({message: "Loginok"}). aparecerá em formato Json

  */

}
//as chaves significa enfiar objeto que é um padão mesmo tendo só um item.
module.exports = {loginController};