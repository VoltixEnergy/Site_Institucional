const database = require("../database/config")

async function autenticar(email, senha) {
  const instrucaoSql = `
    SELECT id_usuario, nome, email, fk_empresa FROM usuario WHERE email = ? AND senha = SHA2(?, 256)
  `
  return await database.executar(instrucaoSql, [email, senha])
}

async function cadastrar(nome, email, senha, cpf, nivelPermissao = 1, fkEmpresa) {
  const instrucaoSql = `
    INSERT INTO usuario (nome, email, senha, cpf, nivel_permissao, fk_empresa) VALUES (?, ?, SHA2(?, 256), ?, ?, ?)
  `
  return await database.executar(instrucaoSql, [nome, email, senha, cpf, nivelPermissao, fkEmpresa])
}

async function buscarUsuarioPorCPF(cpf) {
  const instrucaoSql = `
    SELECT * FROM usuario WHERE cpf = ?
  `
  return await database.executar(instrucaoSql, [cpf])
}

async function autenticarCodigo(codigo) {
  const instrucaoSqlSelect = `
    SELECT id_codigo, codigo, estado_codigo FROM codigo_ativacao WHERE codigo = ?
  `
  const instrucaoSqlUpdate = `
    UPDATE codigo_ativacao SET estado_codigo = 'desativado' WHERE codigo = ?
  `

  const resultadoSelect = await database.executar(instrucaoSqlSelect, [codigo])
  await database.executar(instrucaoSqlUpdate, [codigo])
  return resultadoSelect
}

async function adicionarCodigo(codigo) {
  const instrucaoSql = `
    INSERT INTO codigo_ativacao (codigo, estado_codigo) VALUES (?, 'ativado')
  `
  return await database.executar(instrucaoSql, [codigo])
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
  autenticarCodigo,
  buscarUsuarioPorEmpresa,
  adicionarCodigo,
  editarNome,
  deletarUsuario,
  buscarUsuarioPorCPF
}