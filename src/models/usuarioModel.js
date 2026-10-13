const database = require("../database/config");


function autenticar(email, senha) {

    const instrucaoSql = `
        SELECT
            id,
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

    const instrucaoSql = `
        INSERT INTO usuario (
            nome,
            email,
            senha,
            cargo,
            empresa_id
        )
        VALUES (
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


function pesquisar(nome, idUsuario) {

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
        AND u.nome LIKE ?
        AND u.deletado_em IS NULL
        ORDER BY u.nome;
    `;

    return database.executar(
        instrucaoSql,
        [
            idUsuario,
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


function editarEmail(idUsuario,cargo) {

        const instrucaoSql = `
            UPDATE usuario
            SET cargo = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;

    return database.executar(instrucaoSql,[cargo, idUsuario]);
}


function editarNome(idUsuario, novoNome) {

    const instrucaoSql = `
        UPDATE usuario
        SET nome = ?,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoNome,
            idUsuario
        ]
    );
}


function editarCargo(idUsuario, novoCargo) {

    const instrucaoSql = `
        UPDATE usuario
            SET cargo = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [
            novoCargo,
            idUsuario
        ]
    );
}


function excluir(idUsuario) {

    const instrucaoSql = `
        UPDATE usuario
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario]
    );
}


function deletarUsuario(idUsuario) {

    const instrucaoSql = `
        UPDATE usuario
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario]
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