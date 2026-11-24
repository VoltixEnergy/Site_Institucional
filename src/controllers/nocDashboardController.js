const nocDashboardModel = require("../models/nocDashboardModel");


function AddComponentes(req, res) {

    const { role, companyId: empresaId } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

    nocDashboardModel.AddComponentes(

        empresaId
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



async function buscarserverPorEmpresa(req, res) {

    const {companyId: empresaId } = req.token;

    try {
        const resultado = await nocDashboardModel.AddComponentes(empresaId);

        return res.status(200).json({
            data: resultado
        });

    } catch (erro) {
        console.error("Erro ao buscar servidores:", erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar servidores.",
            erro: erro.message
        });
    }
}




function pesquisar(req, res) {

    const nome = req.params.nome;
    const { role, companyId: empresaId } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

    nocDashboardModel.pesquisar(nome, empresaId)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


async function buscarAlertasPorEmpresa(req, res) {
  const responseBody = {
    message: "",
    data: {}
  };

  const { companyId } = req.token;

  try {
    const resultado = await nocDashboardModel.buscarAlertasPorEmpresa(companyId);

    responseBody.message = resultado.length ? "" : "Nenhum alerta encontrado.";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}



module.exports = {
    pesquisar,
    buscarserverPorEmpresa,
    buscarAlertasPorEmpresa,
    AddComponentes
};