var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id, nome, email FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, cpf, nivelPermissao = 1, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, cpf, nivel_permissao) VALUES ('${nome}', '${email}', '${senha}', '${cpf}', '${nivelPermissao}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUusarioPorCpf(cpf){
    var instrucaoSql = `
        SELECT * FROM usuario WHERE cpf = '${cpf}'
    `
    return database.executar(instrucaoSql);
}

function autenticarCodigo(codigo) {
    console.log("ACESSEI O CODIGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ")
    var instrucaoSqlSelect = `
        SELECT id_codigo, codigo, estado_codigo FROM codigo_ativacao WHERE codigo = '${codigo}';
    `;
    var instrucaoSqlUpdate = `
        UPDATE codigo_ativacao SET estado_codigo = 'desativado' WHERE codigo = '${codigo}'
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSqlSelect);
    return database.executar(instrucaoSqlSelect, instrucaoSqlUpdate);
}

function adicionarCodigo(codigo) {
    var instrucaoSql = `
        INSERT INTO codigo_ativacao (codigo, estado_codigo) VALUES ('${codigo}', 'ativado');
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsuarioPorEmpresa(idEmpresa) {
    console.log("model")
    console.log(idEmpresa)
    var instrucaoSql = `SELECT * FROM usuario WHERE fk_empresa = ${idEmpresa}`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    autenticarCodigo,
    buscarUsuarioPorEmpresa,
    autenticarCodigo,
    adicionarCodigo
};