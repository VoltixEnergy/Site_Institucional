const database = require("../database/config")

async function BuscarServidor(nome, empresaId) {

    const sql = `
        SELECT id, nome
        FROM instancia
        WHERE deletado_em IS NULL
        ORDER BY nome;
    `;

    return await database.executar(sql);
}

module.exports = {
  BuscarServidor,
};