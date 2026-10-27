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


async function cadastrar_instancia(
    nome,
    mac,
    empresaId
) {
    console.log("chegou")
    const instrucaoSql = `
        INSERT INTO instancia (id, nome, endereco_mac, descricao, empresa_id, criado_em)
        VALUES (?, ?, ?, "teste", ?, now());
    `;
    console.log(mac)

    return await database.executar(
        instrucaoSql,
      [database.gerarUuid(), nome, mac, empresaId]
    );
}

// COMEÇO REDE

async function cadastrar_rede(
    nome,
    idComponenteRede = "f5ae3d95-02da-49f6-ba72-4a3913bb6c70"
) {
    const instrucaoSql = `
        INSERT INTO especificacao (id, componente_id, nome) VALUES
        ('?', '?', '?')
    `;


    return await database.executar(
        instrucaoSql,
        [database.gerarUuid(), idComponenteRede, nome]
    );
}

async function cadastrar_metrica_rede(

    minimo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (id, instancia_id, especificacao_id, minimo, unidade_medida , criado_em) 
        VALUES ('?', '?', '?', '?', '?' , now())
    `;


    return await database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, minimo, unidade_medida]

    );
}
// FIM REDE

// COMEÇO PERDA DE PACOTES

async function cadastrar_perda_pacote(
    nome,
    idComponenteRede = "f5ae3d95-02da-49f6-ba72-4a3913bb6c70"
) {

    const instrucaoSql = `
        INSERT INTO especificacao (id, componente_id, nome) VALUES
        ('?', '?', '?')
    `;


    return await database.executar(
        instrucaoSql,
        [database.gerarUuid(), idComponenteRede, nome]

    );
}

async function cadastrar_metrica_perda_pacote(

    maximo,
    unidade_medida,
    idEspecificacao,
    idInstancia

) {

    const instrucaoSql = `
        INSERT INTO metrica (id, instancia_id, especificacao_id, maximo, unidade_medida , criado_em) 
        VALUES ('?', '?', '?', '?', '?' , now())
    `;


    return await database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, maximo, unidade_medida]

    );
}
// FIM PERDA DE PACOTES

async function cadastrar_cpu(
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

async function cadastrar_metrica(
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


    return await database.executar(
        instrucaoSql,
        [database.gerarUuid(), idInstancia, idEspecificacao, maximo, minimo, unidade_medida]

    );
}

async function update_desativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 0,
        atualizado_em = now()
        WHERE id = ?;
    `; 

    return database.executar(
        instrucaoSql,
        [idServidor]
    );
}

async function update_ativar(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET status = 1,
        atualizado_em = now()
        WHERE id = ?;
    `;

    return await database.executar(
        instrucaoSql,
        [idServidor]
    );
}


async function pesquisar(nome, empresaId) {

    const instrucaoSql = `
        SELECT   maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
            i.nome as regiao, status
            from metrica m
            JOIN especificacao e ON m.especificacao_id = e.id
            JOIN instancia i ON m.instancia_id = i.id
            where i.empresa_id = ? and i.nome
            like ?
               AND i.deletado_em IS NULL
              AND m.deletado_em IS NULL;
    `;

    return await database.executar(
        instrucaoSql,
        [empresaId, '%' + nome + '%']
    );
}


async function deletarServidor(idServidor) {

    const instrucaoSql = `
        UPDATE instancia
        SET deletado_em = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    return await database.executar(
        instrucaoSql,
        [idServidor]
    );
}

async function createMetric (instanceId, specificationId, max, min, unit) {
  const instrucaoSql = `
    INSERT INTO metrica (id, instancia_id, especificacao_id, maximo, minimo, unidade_medida, criado_em)
    VALUES (?, ?, ?, ?, ?, ?, now());
  `;

  return await database.executar(
    instrucaoSql,
    [database.gerarUuid(), instanceId, specificationId, max, min, unit]
  );
}

// async function listServers (companyId) {
//   const instrucaoSql = `
//     SELECT id FROM instancia WHERE empresa_id = ? 
//     AND deletado_em is NULL
//   `;

//   return await database.executar(
//     instrucaoSql,
//     [companyId]
//   );
// }

async function buscarDadosInstancia (id, companyId) {
  const instrucaoSql = `
        SELECT maximo as max, minimo as min, especificacao_id, instancia_id, e.nome as componente, 
        i.nome as regiao, status, i.nome as nome, i.endereco_mac
        from metrica m
        JOIN especificacao e ON m.especificacao_id = e.id
        JOIN instancia i ON m.instancia_id = i.id
        where i.empresa_id = ?
          AND i.id = ?
          AND i.deletado_em IS NULL
          AND m.deletado_em IS NULL;
    `;

    return database.executar(
        instrucaoSql,
        [companyId, id]
    );
}

async function updateInstanceName (instanceId, name) {
  const instrucaoSql = `
    UPDATE instancia SET nome = ?, atualizado_em = now()
    WHERE id = ? AND deletado_em IS NULL
  `;

  return await database.executar(
    instrucaoSql,
    [name, instanceId]
  );
}

async function updateMetric (instanceId, specificationId, max, min) {
  const instrucaoSql = `
    UPDATE metrica SET minimo = ?, maximo = ?, atualizado_em = now()
    WHERE instancia_id = ? AND especificacao_id = ?
      AND deletado_em IS NULL
  `;

  return await database.executar(
    instrucaoSql,
    [min, max, instanceId, specificationId]
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
    update_desativar,
    createMetric,
    buscarDadosInstancia,
    updateMetric,
    updateInstanceName
    // listServers
};