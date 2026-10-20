const database = require("../database/config");

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

module.exports = {
    cadastrar_instancia,
    pesquisar,
    deletarServidor,
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