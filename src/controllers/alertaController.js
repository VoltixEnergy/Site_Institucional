const alertaModel = require("../models/alertaModel");


async function buscarAlertasPorEmpresa(req, res) {
  const responseBody = {
    message: "",
    data: {}
  };

  const { companyId } = req.token;

  try {
    const resultado = await alertaModel.buscarAlertasPorEmpresa(companyId);

    responseBody.message = resultado.length ? "" : "Nenhum alerta encontrado.";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}



async function listar(req, res) {
  const responseBody = {
    message: "",
    data: {}
  };

  const idAlerta = req.params.idAlerta;
  const { companyId } = req.token;

  try {

    const resultado = await alertaModel.listar(idAlerta, companyId);

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
    buscarAlertasPorEmpresa,
    listar
};