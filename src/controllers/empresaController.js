const empresaModel = require("../models/empresaModel")

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
  const { cnpj, nomeFantasia, razaoSocial } = req.body

  const retorno = { 
    mensagem: "", 
    dados: {} 
  }

  if (!cnpj) {
    retorno.mensagem = "CNPJ inválido."
    return res.status(400).json(retorno)
  }
  if (!nomeFantasia) {
    retorno.mensagem = "Nome fantasia inválido."
    return res.status(400).json(retorno)
  }
  if (!razaoSocial) {
    retorno.mensagem = "Razão social inválido."
    return res.status(400).json(retorno)
  }

  try {
    const consultaCnpj = await empresaModel.buscarPorCnpj(cnpj)

    if (consultaCnpj.length > 0) {
      retorno.mensagem = "CNPJ inválido."
      return res.status(400).json(retorno)
    }

    const consultaCadastrarEmpresa = await empresaModel.cadastrarEmpresa(cnpj, nomeFantasia, razaoSocial)
    if (consultaCadastrarEmpresa.affectedRows !== 1) {
      retorno.mensagem = "A empresa não foi cadastrada. Tente novamente mais tarde."
      return res.status(500).json(retorno)
    }

    retorno.mensagem = "Empresa cadastrada com sucesso!"
    retorno.dados = { 
      id: consultaCadastrarEmpresa.insertId 
    }

    return res.status(200).json(retorno)
  } catch (e) {
    console.error(e)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function desativarCodigo(req, res) {
  const { codigoServer } = req.body

  const retorno = { 
    mensagem: "", 
    dados: {} 
  }

  if (!codigoServer) {
    retorno.mensagem = "Código inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await empresaModel.desativarCodigo(codigoServer)

    if (resultado.affectedRows && resultado.affectedRows >= 1) {
      retorno.mensagem = "Código desativado com sucesso."
      retorno.dados = resultado
      return res.status(200).json(retorno)
    }

    retorno.mensagem = "Não foi possível desativar o código."
    return res.status(500).json(retorno)
  } catch (e) {
    console.error(e)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  listar,
  cadastrarEmpresa,
  desativarCodigo,
}