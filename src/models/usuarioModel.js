const database = require("../database/config")

async function autenticar(email, senha) {
  const instrucaoSql = `
    SELECT id_usuario, nome, email, fk_empresa FROM usuario WHERE email = ? AND senha = SHA2(?, 256)
  `
  return await database.executar(instrucaoSql, [email, senha])
}

async function cadastrar(nome, email, senha, cargo, empresaId) {
  const instrucaoSql = `
    INSERT INTO usuario (nome, email, senha, cargo, empresa_id) VALUES (?, ?, SHA2(?, 256), ?, ?)
  `
  return await database.executar(instrucaoSql, [nome, email, senha, cargo, empresaId])
}

async function buscarUsuarioPorEmpresa(idEmpresa) {
  const instrucaoSql = `SELECT id_usuario, nome, email, nivel_permissao FROM usuario WHERE fk_empresa = ?`
  return await database.executar(instrucaoSql, [idEmpresa])
}

async function editarNome(novoNome, idUsuario) {
  const instrucaoSql = `
    UPDATE usuario SET nome = ? WHERE id_usuario = ?
  `
  return await database.executar(instrucaoSql, [novoNome, idUsuario])
}

async function deletarUsuario(idUsuario) {
  const instrucaoSql = `
    DELETE FROM usuario WHERE id_usuario = ?
  `
  return await database.executar(instrucaoSql, [idUsuario])
}

module.exports = {
  autenticar,
  cadastrar,
  buscarUsuarioPorEmpresa,
  editarNome,
  deletarUsuario
}