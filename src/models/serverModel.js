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
        where i.empresa_id = ?
          AND i.deletado_em IS NULL
          AND m.deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [empresaId]
    );
}


function cadastrar_instancia(
    regiao,
    mac,
    categoria,
    empresaId
) {

    const instrucaoSql = `
        INSERT INTO instancia (id, nome, endereco_mac,  descricao, empresa_id, criado_em)
        VALUES ('?', '?', '?', '?', ?, now());
    `;

    return database.executar(
        instrucaoSql
      [database.gerarUuid(), regiao, mac, categoria, empresaId]
    );
}

// COMEÇO REDE

function cadastrar_rede(
    nome,
    idComponenteRede = "f5ae3d95-02da-49f6-ba72-4a3913bb6c70"
) {
    const instrucaoSql = `
        INSERT INTO especificacao (id, componente_id, nome) VALUES
        ('?', '?', '?')
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idComponenteRede, nome]
    );
}

function cadastrar_metrica_rede(

    minimo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (id, instancia_id, especificacao_id, minimo, unidade_medida , criado_em) 
        VALUES ('?', '?', '?', '?', '?' , now())
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, minimo, unidade_medida]

    );
}
// FIM REDE

// COMEÇO PERDA DE PACOTES

function cadastrar_perda_pacote(
    nome,
    idComponenteRede = "f5ae3d95-02da-49f6-ba72-4a3913bb6c70"
) {

    const instrucaoSql = `
        INSERT INTO especificacao (id, componente_id, nome) VALUES
        ('?', '?', '?')
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idComponenteRede, nome]

    );
}

function cadastrar_metrica_perda_pacote(

    maximo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (id, instancia_id, especificacao_id, maximo, unidade_medida , criado_em) 
        VALUES ('?', '?', '?', '?', '?' , now())
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, maximo, unidade_medida]

    );
}
// FIM PERDA DE PACOTES

function cadastrar_cpu(
    nome,
    idComponenteCpu = 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67'
) {

    const instrucaoSql = `
        INSERT INTO especificacao (id, componente_id, nome) VALUES
        ('?', '?', '?')
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idComponenteCpu, nome]
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
        INSERT INTO metrica (id, instancia_id, especificacao_id, maximo, minimo, unidade_medida , criado_em) 
        VALUES ('?', '?', '?','?', '?', '?' , now())
    `;


    return database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, maximo, minimo, unidade_medida]

    );
}

function update_desativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 0
        WHERE id = '?';
    `; // adcicionar o atualizado_em como coluna no banco de dados

    return database.executar(
        instrucaoSql,
        [idServidor]
    );
}
function update_ativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 1
        WHERE id = '?';
    `; // adcicionar o atualizado_em como coluna no banco de dados

    return database.executar(
        instrucaoSql,
        [idServidor]
    );
}


function pesquisar(nome, empresaId) {

    const instrucaoSql = `
        SELECT   maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
            i.nome as regiao, status
            from metrica m
            JOIN especificacao e ON m.especificacao_id = e.id
            JOIN instancia i ON m.instancia_id = i.id
            where i.empresa_id = '?' and i.nome
            like '%?%'
               AND i.deletado_em IS NULL
              AND m.deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [empresaId, nome]
    );
}


function deletarServidor(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ?};
    `;

    return database.executar(
        instrucaoSql,
        [idServidor]
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