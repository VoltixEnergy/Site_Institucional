const alertasModel = require("../models/managerModel");

const NOMES_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const TIPOS = {
    abaixoMinimo: "Abaixo do limite mínimo",
    proximoMaximo: "Próximo ao limite máximo",
    acimaMaximo: "Acima do limite máximo"
};

function obterDadosDashboard(req, res) {
    const idEmpresa = req.token?.companyId;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!idEmpresa || !uuidRegex.test(idEmpresa)) {
        return res.status(400).json({ erro: "ID da empresa inválido ou ausente." });
    }

    const posicao = Number(req.query.posicao);
    const tipo = TIPOS[req.query.tipo]; 
    const filtroValido = Number.isInteger(posicao) && posicao >= 0 && posicao <= 3 && tipo;

    Promise.all([
        alertasModel.buscarTotalAlertas(idEmpresa),
        alertasModel.buscarPorComponente(idEmpresa),
        alertasModel.buscarComparacaoMensal(idEmpresa),
        alertasModel.buscarDistribuicaoMeses(idEmpresa),
        filtroValido
            ? alertasModel.buscarPorCategoria(idEmpresa, posicao, tipo)
            : Promise.resolve([])
    ])
        .then(function ([
            resTotal,
            resComponentes,
            resComparacao,
            resDistribuicaoMeses,
            resCategorias
        ]) {
            const diasMesAtual = Array(31).fill(0);
            const diasMesAnterior = Array(31).fill(0);

            resComparacao.forEach(item => {
                if (item.periodo === "atual") {
                    diasMesAtual[item.dia - 1] = item.total;
                } else {
                    diasMesAnterior[item.dia - 1] = item.total;
                }
            });

            const hoje = new Date();
            const mesesLabels = [3, 2, 1, 0].map(i =>
                NOMES_MESES[new Date(hoje.getFullYear(), hoje.getMonth() - i, 1).getMonth()]
            );

            const abaixoMinimo = [0, 0, 0, 0];
            const proximoMaximo = [0, 0, 0, 0];
            const acimaMaximo = [0, 0, 0, 0];

            resDistribuicaoMeses.forEach(item => {
                const idx = item.posicao;
                if (idx < 0 || idx > 3) return;
            // alterar para a saida do bd
                if (item.tipo === -1) abaixoMinimo[idx] = Number(item.total);
                if (item.tipo === 0) proximoMaximo[idx] = Number(item.total);
                if (item.tipo === 1) acimaMaximo[idx] = Number(item.total);
            });

            res.status(200).json({
                totalAlertas: resTotal[0]?.total || 0,
                porComponente: resComponentes,
                comparacaoMeses: {
                    mesAtual: diasMesAtual,
                    mesAnterior: diasMesAnterior
                },
                distribuicaoMeses: {
                    meses: mesesLabels,
                    abaixoMinimo,
                    proximoMaximo,
                    acimaMaximo
                },
                porCategoria: resCategorias
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar dados do dashboard:", erro.sqlMessage || erro);
            res.status(500).json({ erro: "Erro interno ao processar dados do dashboard." });
        });
}

module.exports = {
    obterDadosDashboard
};