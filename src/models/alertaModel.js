const database = require("../database/config");


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
        ORDER BY a.criado_em DESC;
    `;

    return database.executar(
        instrucaoSql,
        [empresaId]
    );

}



function listar(idAlerta, empresaId) {
    const instrucaoSql = `
         SELECT
            a.id,
            a.tipo,
            a.prioridade,
            a.descricao,
            a.enviado_em,
            a.metrica_id,
            i.nome AS servidor
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE a.id = ?
          AND i.empresa_id = ?
          AND i.deletado_em IS NULL
          AND m.deletado_em IS NULL
    `;

    return database.executar(
        instrucaoSql,
        [idAlerta, empresaId]
    );
}



module.exports = {
    buscarAlertasPorEmpresa,
    listar
};
