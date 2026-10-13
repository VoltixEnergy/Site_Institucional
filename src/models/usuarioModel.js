const database = require("../database/config");


function autenticar(email) {

    const instrucaoSql = `
        SELECT
            id,
            nome,
            senha,
            email,
            empresa_id,
            cargo
        FROM usuario
        WHERE email = ?
        AND deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [email]
    );
}


function cadastrar(
    nome,
    email,
    senha,
    cargo,
    empresaId
) {

    const instrucaoSql = `
        INSERT INTO usuario (
            id,
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
            ?,
            ?,
            ?
        );
    `;

    return database.executar(
        instrucaoSql,
        [
            gerarUuid(),
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
            id,
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


function listar(idUsuario) {

    const instrucaoSql = `
        SELECT
            u.id,
            u.nome,
            u.email,
            u.cargo,
            u.empresa_id
        FROM usuario u
        WHERE u.empresa_id = (
            SELECT empresa_id
            FROM usuario
            WHERE id = ?
        )
        AND u.deletado_em IS NULL
        ORDER BY u.nome;
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario]
    );
}


function pesquisar(empresaId, nome) {

    const instrucaoSql = `
        SELECT
            u.id,
            u.nome,
            u.email,
            u.cargo,
            u.empresa_id
        FROM usuario u
        WHERE u.empresa_id = ?
        AND u.nome LIKE ?
        AND u.deletado_em IS NULL
        ORDER BY u.nome;
    `;

    return database.executar(
        instrucaoSql,
        [
            empresaId,
            `%${nome}%`
        ]
    );
}


function buscarPorId(idUsuario) {

    const instrucaoSql = `
        SELECT
            id,
            nome,
            email,
            cargo,
            empresa_id
        FROM usuario
        WHERE id = ?
          AND deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario]
    );
}


function editarEmail(idUsuario,cargo, empresaId) {

        const instrucaoSql = `
            UPDATE usuario
            SET email = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ? AND deletado_em IS NULL AND empresa_id = ?;
        `;

    return database.executar(instrucaoSql,[cargo, idUsuario, empresaId]);
}


function editarNome(idUsuario, novoNome, empresaId) {

    const instrucaoSql = `
        UPDATE usuario
        SET nome = ?,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND deletado_em IS NULL AND empresa_id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoNome,
            idUsuario,
            empresaId
        ]
    );
}


function editarCargo(idUsuario, novoCargo, empresaId) {

    const instrucaoSql = `
        UPDATE usuario
            SET cargo = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ? AND deletado_em IS NULL AND empresa_id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoCargo,
            idUsuario,
            empresaId
        ]
    );
}


function deletarUsuario(idUsuario, empresaId) {

    const instrucaoSql = `
        UPDATE usuario
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND empresa_id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario, empresaId]
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
    deletarUsuario,
};
