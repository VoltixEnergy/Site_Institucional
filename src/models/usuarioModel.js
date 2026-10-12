const database = require("../database/config");
const gerarUuid = database.gerarUuid;


function autenticar(email, senha) {

    const instrucaoSql = `
        SELECT
            uuid,
            nome,
            email,
            empresa_id,
            cargo
        FROM usuario
        WHERE email = ?
          AND senha = SHA2(?, 256)
          AND deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [email, senha]
    );
}


function cadastrar(
    nome,
    email,
    senha,
    cpf,
    cargo = 1,
    empresaId
) {

    const uuid = gerarUuid();

    const instrucaoSql = `
        INSERT INTO usuario (
            uuid,
            nome,
            email,
            senha,
            cargo,
            empresa_id
        )
        VALUES (
            ?,
            ?,
            ?,
            SHA2(?, 256),
            ?,
            ?
        );
    `;

    return database.executar(
        instrucaoSql,
        [
            uuid,
            nome,
            email,
            senha,
            cargo,
            empresaId
        ]
    );
}



function buscarUsuarioPorEmpresa(empresaId) {

    const instrucaoSql = `
        SELECT
            uuid,
            nome,
            email,
            cargo,
            empresa_id
        FROM usuario
        WHERE empresa_id = ?
          AND deletado_em IS NULL
        ORDER BY nome;
    `;

    return database.executar(
        instrucaoSql,
        [empresaId]
    );
}


function listar(uuid) {

    const instrucaoSql = `
        SELECT
            u.uuid,
            u.nome,
            u.email,
            u.cargo,
            u.empresa_id
        FROM usuario u
        WHERE u.empresa_id = (
            SELECT empresa_id
            FROM usuario
            WHERE uuid = ?
        )
        AND u.deletado_em IS NULL
        ORDER BY u.nome;
    `;

    return database.executar(
        instrucaoSql,
        [uuid]
    );
}


function pesquisar(nome, uuid) {

    const instrucaoSql = `
        SELECT
            u.uuid,
            u.nome,
            u.email,
            u.cargo,
            u.empresa_id
        FROM usuario u
        WHERE u.empresa_id = (
            SELECT empresa_id
            FROM usuario
            WHERE uuid = ?
        )
        AND u.nome LIKE ?
        AND u.deletado_em IS NULL
        ORDER BY u.nome;
    `;

    return database.executar(
        instrucaoSql,
        [
            uuid,
            `%${nome}%`
        ]
    );
}


function buscarPorId(uuid) {

    const instrucaoSql = `
        SELECT
            uuid,
            nome,
            email,
            cargo,
            empresa_id
        FROM usuario
        WHERE uuid = ?
          AND deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [uuid]
    );
}


function editarEmail(uuid,email) {

        const instrucaoSql = `
            UPDATE usuario
            SET email = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE uuid = ?;
        `;

    return database.executar(instrucaoSql,[email, uuid]);
}


function editarNome(uuid, novoNome) {

    const instrucaoSql = `
        UPDATE usuario
        SET nome = ?,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE uuid = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoNome,
            uuid
        ]
    );
}


function editarCargo(uuid, novoCargo) {

    const instrucaoSql = `
        UPDATE usuario
            SET cargo = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE uuid = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoCargo,
            uuid
        ]
    );
}


function excluir(uuid) {

    const instrucaoSql = `
        UPDATE usuario
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE uuid = ?;
    `;

    return database.executar(
        instrucaoSql,
        [uuid]
    );
}


function deletarUsuario(uuid) {

    const instrucaoSql = `
        UPDATE usuario
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE uuid = ?;
    `;

    return database.executar(
        instrucaoSql,
        [uuid]
    );
}



function autenticarCodigo(codigo) {

    const instrucaoSql = `
        SELECT
            id,
            empresa_id,
            codigo,
            cargo,
            expira_em
        FROM codigo_ativacao
        WHERE codigo = ?
          AND usado_em IS NULL
          AND deletado_em IS NULL
          AND expira_em > CURRENT_TIMESTAMP;
    `;

    return database.executar(
        instrucaoSql,
        [codigo]
    );
}


function adicionarCodigo(
    codigo,
    empresaId,
    cargo,
    expiraEm
) {

    const instrucaoSql = `
        INSERT INTO codigo_ativacao (
            empresa_id,
            codigo,
            cargo,
            expira_em
        )
        VALUES (
            ?,
            ?,
            ?,
            ?
        );
    `;

    return database.executar(
        instrucaoSql,
        [
            empresaId,
            codigo,
            cargo,
            expiraEm
        ]
    );
}


module.exports = {
    autenticar,
    cadastrar,
    buscarUsuarioPorEmpresa,
    listar,
    pesquisar,
    buscarPorId,
    editarEmail,
    editarNome,
    editarCargo,
    excluir,
    deletarUsuario,
    autenticarCodigo,
    adicionarCodigo
};