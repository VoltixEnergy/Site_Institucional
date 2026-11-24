const database = require("../database/config");


function AddComponentes(empresaId) {
    const instrucaoSql = `
        SELECT
            i.id AS instancia_id,
            i.nome AS nome,
            i.nome AS regiao,
            i.endereco_mac,
            i.descricao,
            i.status,
            e.nome AS componente,
            m.maximo AS max,
            m.minimo AS min,
            m.unidade_medida,
            m.especificacao_id
        FROM instancia i
        LEFT JOIN metrica m
            ON m.instancia_id = i.id
            AND m.deletado_em IS NULL
        LEFT JOIN especificacao e
            ON e.id = m.especificacao_id
        WHERE i.empresa_id = ?
            AND i.deletado_em IS NULL
        ORDER BY i.nome, e.nome;
    `;

    return database.executar(instrucaoSql, [empresaId]);
}


async function pesquisar(nome, empresaId) {

    const instrucaoSql = `
        SELECT
            i.id AS instancia_id,
            i.nome AS nome,
            i.nome AS regiao,
            i.endereco_mac,
            i.status,
            e.nome AS componente,
            m.maximo AS max,
            m.minimo AS min,
            m.unidade_medida,
            m.especificacao_id
        FROM instancia i
        LEFT JOIN metrica m
            ON m.instancia_id = i.id
            AND m.deletado_em IS NULL
        LEFT JOIN especificacao e
            ON e.id = m.especificacao_id
        WHERE i.empresa_id = ?
            AND i.nome LIKE ?
            AND i.deletado_em IS NULL
        ORDER BY i.nome, i.id;
    `;

    return await database.executar(
        instrucaoSql,
        [empresaId, '%' + nome + '%']
    );
}



function buscarAlertasPorEmpresa(empresaId) {

    const instrucaoSql = `
        SELECT
            a.id,
            a.prioridade,
            a.tipo,
            a.descricao,
            a.enviado_em,
            a.metrica_id,
            i.nome AS servidor
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
          AND i.deletado_em IS NULL
          AND m.deletado_em IS NULL
           AND a.criado_em >= CURDATE()
          AND a.criado_em < CURDATE() + INTERVAL 1 DAY
        ORDER BY a.criado_em DESC;
    `;

    return database.executar(
        instrucaoSql,
        [empresaId]
    );

}



module.exports = {
    pesquisar,
    buscarAlertasPorEmpresa,
    AddComponentes 
};