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

function AddComponentes(
    empresaId
) {

    const instrucaoSql = `
        SELECT   maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
        i.nome as regiao, status
        from metrica m
        JOIN especificacao e ON m.especificacao_id = e.id
        JOIN instancia i ON m.instancia_id = i.id
        where i.empresa_id = ${empresaId}
          AND i.deletado_em IS NULL
          AND m.deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql

    );
}


function cadastrar_instancia(
    regiao,
    mac,
    categoria,
    empresaId
) {

    const instrucaoSql = `
        INSERT INTO instancia (nome, endereco_mac,  descricao, empresa_id, criado_em)
        VALUES ('${regiao}', '${mac}', '${categoria}',${empresaId} , now());
    `;

    return database.executar(
        instrucaoSql

    );
}

// COMEÇO REDE

function cadastrar_rede(
    nome,
    idEspecificacao
) {

    const instrucaoSql = `
        INSERT INTO especificacao (componente_id, nome) VALUES
        (1, '${nome}')
    `;


    return database.executar(
        instrucaoSql

    );
}

function cadastrar_metrica_rede(

    minimo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (instancia_id, especificacao_id, minimo, unidade_medida , criado_em) 
        VALUES ('${idInstancia}', '${idEspecificacao}', '${minimo}', '${unidade_medida}' , now())
    `;


    return database.executar(
        instrucaoSql

    );
}
// FIM REDE

// COMEÇO PERDA DE PACOTES

function cadastrar_perda_pacote(
    nome
    
) {

    const instrucaoSql = `
        INSERT INTO especificacao (componente_id, nome) VALUES
        (1, '${nome}')
    `;


    return database.executar(
        instrucaoSql

    );
}

function cadastrar_metrica_perda_pacote(

    maximo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (instancia_id, especificacao_id, maximo, unidade_medida , criado_em) 
        VALUES ('${idInstancia}', '${idEspecificacao}', '${maximo}', '${unidade_medida}' , now())
    `;


    return database.executar(
        instrucaoSql

    );
}
// FIM PERDA DE PACOTES

function cadastrar_cpu(
    nome,
    idEspecificacao
) {

    const instrucaoSql = `
        INSERT INTO especificacao (componente_id, nome) VALUES
        (1, '${nome}')
    `;


    return database.executar(
        instrucaoSql

    );
}

function cadastrar_metrica(
    maximo,
    minimo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (instancia_id, especificacao_id, maximo, minimo, unidade_medida , criado_em) 
        VALUES ('${idInstancia}', '${idEspecificacao}','${maximo}', '${minimo}', '${unidade_medida}' , now())
    `;


    return database.executar(
        instrucaoSql

    );
}

// FIM CPU
function buscarUsuarioPorCPF(cpf) {

    // Seu banco atual NÃO possui CPF na tabela usuario.
    // Por isso, essa função não pode consultar CPF.
    return Promise.reject(
        "A tabela usuario não possui a coluna cpf."
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
function update_desativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 0
        WHERE id = ${idServidor};
    `;

    return database.executar(
        instrucaoSql
    );
}
function update_ativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 1
        WHERE id = ${idServidor};
    `;

    return database.executar(
        instrucaoSql
    );
}


function pesquisar(nome, empresaId) {

    const instrucaoSql = `
        SELECT   maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
            i.nome as regiao, status
            from metrica m
            JOIN especificacao e ON m.especificacao_id = e.id
            JOIN instancia i ON m.instancia_id = i.id
            where i.empresa_id = ${empresaId} and i.nome
            like '%${nome}%'
               AND i.deletado_em IS NULL
              AND m.deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql
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


function atualizar(
    idUsuario,
    nome,
    email,
    cargo
) {

    let instrucaoSql = "";
    let parametros = [];

    if (nome) {

        instrucaoSql = `
            UPDATE usuario
            SET nome = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;

        parametros = [
            nome,
            idUsuario
        ];

    } else if (email) {

        instrucaoSql = `
            UPDATE usuario
            SET email = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;

        parametros = [
            email,
            idUsuario
        ];

    } else if (cargo) {

        instrucaoSql = `
            UPDATE usuario
            SET cargo = ?,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?;
        `;

        parametros = [
            cargo,
            idUsuario
        ];

    } else {

        return Promise.reject(
            "Nenhum campo informado para atualização."
        );
    }

    return database.executar(
        instrucaoSql,
        parametros
    );
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


function deletarServidor(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ${idServidor};
    `;

    return database.executar(
        instrucaoSql
    );
}


/* =====================================================
   CÓDIGO DE ATIVAÇÃO
   ===================================================== */

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
    cadastrar_instancia,
    buscarUsuarioPorCPF,
    buscarUsuarioPorEmpresa,
    listar,
    pesquisar,
    buscarPorId,
    atualizar,
    editarNome,
    deletarServidor,
    autenticarCodigo,
    adicionarCodigo,
    cadastrar_cpu,
    cadastrar_metrica,
    cadastrar_perda_pacote,
    cadastrar_metrica_perda_pacote,
    cadastrar_metrica_rede,
    cadastrar_rede,
    AddComponentes,
    update_ativar,
    update_desativar
};