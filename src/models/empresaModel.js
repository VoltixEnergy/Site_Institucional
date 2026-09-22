const database = require("../database/config");

async function buscarPorId(id) {
  const instrucaoSql = `SELECT * FROM empresa WHERE id = ?`;

  return await database.executar(instrucaoSql, [id]);
}

async function listar() {
  const instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return await database.executar(instrucaoSql);
}

async function buscarPorCnpj(cnpj) {
  const instrucaoSql = `SELECT * FROM empresa WHERE cnpj = ?`;

  return await database.executar(instrucaoSql, [cnpj]);
}

async function cadastrar(razaoSocial, cnpj) {
  const instrucaoSql = `INSERT INTO empresa (razao_social, cnpj) VALUES (?, ?)`;

  return await database.executar(instrucaoSql, [razaoSocial, cnpj]);
}

async function cadastrarEmpresa(cnpj, nomeFantasia, razaoSocial) {
    const instrucaoSql = `
        INSERT INTO empresa (cnpj, nome_fantasia, razao_social) VALUES (?, ?, ?);
    `
  
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    
    return await database.executar(instrucaoSql, [cnpj, nomeFantasia, razaoSocial]);
}

async function desativarCodigo(codigo){
    const instrucaoSql = `
      UPDATE codigo_ativacao SET estado_codigo = ? WHERE codigo = ?
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return await database.executar(instrucaoSql, ["desativado", codigo]);
}

module.exports = {
  buscarPorCnpj, 
  buscarPorId, 
  cadastrar, 
  listar, 
  cadastrarEmpresa,
  desativarCodigo
};
