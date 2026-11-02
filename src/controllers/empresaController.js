const empresaModel = require("../models/empresaModel")
const codeModel = require("../models/codeModel")
const codeController = require("./codigoController")

async function buscarPorCnpj(req, res) {
  const { cnpj } = req.query

  const retorno = { 
    mensagem: "", 
    dados: {} 
  }

  if (!cnpj) {
    retorno.mensagem = "CNPJ inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await empresaModel.buscarPorCnpj(cnpj)

    retorno.dados = resultado
    retorno.mensagem = resultado.length ? "" : "Nenhuma empresa encontrada."

    return res.status(200).json(retorno)
  } catch (e) {
    console.error(e)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function listar(req, res) {
  const retorno = { 
    mensagem: "", 
    dados: {} 
  }

  try {
    const resultado = await empresaModel.listar()

    retorno.dados = resultado

    return res.status(200).json(retorno)
  } catch (e) {
    console.error(e)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function buscarPorId(req, res) {
  const { id } = req.params

  const retorno = { 
    mensagem: "", 
    dados: {}
  }

  if (!id) {
    retorno.mensagem = "ID inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await empresaModel.buscarPorId(id)

    retorno.dados = resultado
    retorno.mensagem = resultado.length ? "" : "Nenhuma empresa encontrada."

    return res.status(200).json(retorno)
  } catch (e) {
    console.error(e)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function cadastrarEmpresa(req, res) {
  const { cnpj, tradeName, legalName, code } = req.body

  const responseBody = { 
    message: "", 
    data: {} 
  }

  if (!legalName) {
    responseBody.message = "Razão social inválido."
    return res.status(400).json(responseBody)
  }
  if (!tradeName) {
    responseBody.message = "Nome fantasia inválido."
    return res.status(400).json(responseBody)
  }

  const isCnpjValid = !(/^[A-Z0-9]{2}\.?[A-Z0-9]{3}\.?[A-Z0-9]{3}\/?[A-Z0-9]{4}-?\d{2}$/.test(cnpj))
  if (!cnpj || isCnpjValid) {
    responseBody.message = "CNPJ inválido."
    return res.status(400).json(responseBody)
  }

  if (!code || code.length !== 6) {
    responseBody.message = "Código de ativação inválido."
    return res.status(400).json(responseBody)
  }

  try {
    const cleanCnpj = cnpj.replace(/[^A-Z0-9]/gi, "");

    const consultaCnpj = await empresaModel.buscarPorCnpj(cleanCnpj)

    if (consultaCnpj.length > 0) {
      responseBody.message = "CNPJ inválido."
      return res.status(400).json(responseBody)
    }

    const getCodeQuery = await codeModel.getCompanyAndRoleByCode(code)
    
    console.log("a: " + getCodeQuery)
    if (!getCodeQuery) {
      responseBody.message = "Código inválido."
      return res.status(400).json(responseBody)
    }

    if(getCodeQuery[0].empresa_id !== "f5ae3d95-02da-49f6-ba72-4a3913bb6c67" && getCodeQuery[0].cargo != 0) {
      responseBody.message = "Código de validação não é registro de empresa."
      return res.status(400).json(responseBody)
    }
    
    const consultaCadastrarEmpresa = await empresaModel.cadastrarEmpresa(cleanCnpj, tradeName, legalName)
    if (consultaCadastrarEmpresa.affectedRows !== 1) {
      responseBody.message = "A empresa não foi cadastrada. Tente novamente mais tarde."
      return res.status(500).json(responseBody)
    }

    const setCodeQuery = await codeModel.setCodeUsedByCode(getCodeQuery[0].codigo)

    if (setCodeQuery.affectedRows !== 1)
      throw new Error()

    console.log(consultaCadastrarEmpresa.uuid)
    const admCode = await codeController.createCode(consultaCadastrarEmpresa.uuid, 1)

    if (!admCode)
      throw new Error()

    responseBody.message = "Empresa cadastrada com sucesso!"
    responseBody.data = { 
      admCode: admCode
    }

    return res.status(201).json(responseBody)
  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(responseBody)
  }
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  listar,
  cadastrarEmpresa,
}