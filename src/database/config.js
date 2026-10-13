var mysql = require("mysql2");
var crypto = require('crypto');

var gerarUuid = () => {
  return crypto.randomUUID();
};


// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

async function executar (query, params) {
  try {
    const poolDB = mysql.createPool(mySqlConfig).promise()
    
    console.log("======= CONSULTA NO BANCO DE DADOS =======")
    console.log("Consulta: " + query)
    console.log("Parâmetros: " + params)
  
    const response = await poolDB.execute(query, params)
    console.log(response[0])
  
    await poolDB.end()
  
    return response[0]
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  executar,
  gerarUuid
};