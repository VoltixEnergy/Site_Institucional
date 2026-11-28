const database = require("../database/config");

// Total de Alertas
function buscarTotalAlertas(idEmpresa) {
    var instrucaoSql = `
        SELECT COUNT(a.id) AS total
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
        AND a.criado_em >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND a.criado_em <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH);
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

// Gráfico de Pizza
function buscarPorComponente(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            CASE e.nome
                WHEN 'cpu_use_percent' THEN 'CPU'
                WHEN 'ram_use_percent' THEN 'RAM'
                WHEN 'disk_use_percent' THEN 'Disco'
                WHEN 'network_received' THEN 'Download'
                WHEN 'network_sent' THEN 'Upload'
                ELSE c.tipo
            END AS componente,
            COUNT(a.id) AS total
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN especificacao e ON m.especificacao_id = e.id
        JOIN componente c ON e.componente_id = c.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
        AND a.criado_em >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND a.criado_em <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        GROUP BY componente
        ORDER BY FIELD(componente, 'CPU', 'RAM', 'Disco', 'Download', 'Upload');
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}
// FIELD é usado para ordenar os resultados de acordo com a ordem especificada

// Gráfico de Linhas
function buscarComparacaoMensal(idEmpresa) {
    var instrucaoSql = `
        SELECT
            CASE
                WHEN a.criado_em >= DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN 'atual'
                ELSE 'anterior'
            END AS periodo,
            DAY(a.criado_em) AS dia,
            COUNT(a.id) AS total
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
        AND a.criado_em >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        AND a.criado_em <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        GROUP BY periodo, dia
        ORDER BY periodo, dia;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

// Gráfico de Barras Empilhadas
function buscarDistribuicaoMeses(idEmpresa) {
    const instrucaoSql = `
        SELECT
            3 - PERIOD_DIFF(DATE_FORMAT(CURDATE(), '%Y%m'),
            DATE_FORMAT(a.criado_em, '%Y%m')) AS posicao,
            a.tipo,
            COUNT(*) AS total
        FROM alerta a
        JOIN metrica m   ON a.metrica_id = m.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
        AND a.criado_em >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH)
        AND a.criado_em <  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        GROUP BY posicao, a.tipo;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

// Gráfico de Rosca
function buscarPorCategoria(idEmpresa, posicao, tipo) {
    var instrucaoSql = `
        SELECT 
            CASE e.nome
                WHEN 'cpu_use_percent' THEN 'CPU'
                WHEN 'ram_use_percent' THEN 'RAM'
                WHEN 'disk_use_percent' THEN 'Disco'
                WHEN 'network_received' THEN 'Download'
                WHEN 'network_sent' THEN 'Upload'
                ELSE e.nome
            END AS categoria,
            COUNT(a.id) AS total
        FROM alerta a
        JOIN metrica m ON a.metrica_id = m.id
        JOIN especificacao e ON m.especificacao_id = e.id
        JOIN instancia i ON m.instancia_id = i.id
        WHERE i.empresa_id = ?
        AND a.tipo = ?
        AND a.criado_em >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)
        AND a.criado_em <  DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH), INTERVAL 1 MONTH)
        GROUP BY categoria
        ORDER BY FIELD(categoria, 'CPU', 'RAM', 'Disco', 'Download', 'Upload');
    `;
    const meses = 3 - posicao;
    return database.executar(instrucaoSql, [idEmpresa, tipo, meses, meses]);
}

module.exports = {
    buscarTotalAlertas,
    buscarPorComponente,
    buscarComparacaoMensal,
    buscarDistribuicaoMeses,
    buscarPorCategoria
};