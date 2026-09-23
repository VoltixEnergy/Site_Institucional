const usuarioModel = require("../models/usuarioModel");

async function autenticar(req, res) {
  const { email, senha } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!email) {
    retorno.mensagem = "Email inválido."
    return res.status(400).json(retorno)
  }
  if (!senha) {
    retorno.mensagem = "Senha inválida."
    return res.status(400).json(retorno)
  }

  try {
    const resultadoAutenticar = await usuarioModel.autenticar(email, senha)

    if (resultadoAutenticar.length === 1) {
      const resultadoFuncionarios = await usuarioModel.buscarUsuarioPorEmpresa(resultadoAutenticar[0].fk_empresa)

      retorno.dados = {
        id: resultadoAutenticar[0].id_usuario,
        email: resultadoAutenticar[0].email,
        nome: resultadoAutenticar[0].nome,
        empresa: resultadoAutenticar[0].fk_empresa,
        funcionarios: resultadoFuncionarios.length > 0 ? resultadoFuncionarios : []
      }

      return res.status(200).json(retorno)
    } else if (resultadoAutenticar.length === 0) {
      retorno.mensagem = "Email e/ou senha inválido(s)"
      return res.status(403).json(retorno)
    } else {
      retorno.mensagem = "Mais de um usuário com o mesmo login e senha!"
      return res.status(403).json(retorno)
    }
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}
async function buscarUsuarioPorCPF(req, res) {
  const { cpf } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!cpf) {
    retorno.mensagem = "CPF inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await usuarioModel.buscarUsuarioPorCPF(cpf)

    retorno.dados = resultado
    retorno.mensagem = resultado.length ? "" : "Nenhum usuário encontrado."

    return res.status(200).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function cadastrar(req, res) {
  const { nome, email, senha, cpf, nivelPermissao, fkEmpresa } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!nome) {
    retorno.mensagem = "Nome inválido."
    return res.status(400).json(retorno)
  }
  if (!email) {
    retorno.mensagem = "Email inválido."
    return res.status(400).json(retorno)
  }
  if (!senha) {
    retorno.mensagem = "Senha inválida."
    return res.status(400).json(retorno)
  }

  try {
    const usuarioExistente = await usuarioModel.buscarUsuarioPorCPF(cpf)

    if (usuarioExistente.length > 0) {
      retorno.mensagem = `O usuário já existe`
      return res.status(400).json(retorno)
    }

    const resultado = await usuarioModel.cadastrar(nome, email, senha, cpf, nivelPermissao, fkEmpresa)

    if (resultado.affectedRows !== 1) {
      retorno.mensagem = "O usuário não foi cadastrado. Tente novamente mais tarde."
      return res.status(500).json(retorno)
    }

    retorno.mensagem = "Usuário cadastrado com sucesso!"
    retorno.dados = {
      id: resultado.insertId
    }

    return res.status(200).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function autenticarCodigo(req, res) {
  const { codigoServer: codigo } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!codigo) {
    retorno.mensagem = "Código inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultadoAutenticarCodigo = await usuarioModel.autenticarCodigo(codigo)

    if (resultadoAutenticarCodigo.length === 1) {
      retorno.dados = {
        id: resultadoAutenticarCodigo[0].id_codigo,
        codigo: resultadoAutenticarCodigo[0].codigo,
        status: resultadoAutenticarCodigo[0].estado_codigo
      }

      return res.status(200).json(retorno)
    } else if (resultadoAutenticarCodigo.length === 0) {
      retorno.mensagem = "Código inválido!"
      return res.status(403).json(retorno)
    } else {
      retorno.mensagem = "Mais de um código com o mesmo valor!"
      return res.status(403).json(retorno)
    }
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function buscarUsuarioPorEmpresa(req, res) {
  const { idEmpresa } = req.params

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!idEmpresa) {
    retorno.mensagem = "ID da empresa inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await usuarioModel.buscarUsuarioPorEmpresa(idEmpresa)

    retorno.dados = resultado
    retorno.mensagem = resultado.length ? "" : "Nenhum funcionário encontrado."

    return res.status(200).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}
async function adicionarCodigo(req, res) {
  const { codigo } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!codigo) {
    retorno.mensagem = "Código inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await usuarioModel.adicionarCodigo(codigo)

    if (resultado.affectedRows !== 1) {
      retorno.mensagem = "O código não foi adicionado. Tente novamente mais tarde."
      return res.status(500).json(retorno)
    }

    retorno.mensagem = "Código adicionado com sucesso!"
    retorno.dados = {
      id: resultado.insertId
    }

    return res.status(200).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function editarNome(req, res) {
  const { novoNome, idUsuario } = req.body

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!novoNome) {
    retorno.mensagem = "Nome inválido."
    return res.status(400).json(retorno)
  }
  if (!idUsuario) {
    retorno.mensagem = "ID do usuário inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await usuarioModel.editarNome(novoNome, idUsuario)

    if (resultado.affectedRows && resultado.affectedRows >= 1) {
      retorno.mensagem = "Nome editado com sucesso!"
      retorno.dados = resultado
      return res.status(200).json(retorno)
    }

    retorno.mensagem = "Não foi possível editar o nome."
    return res.status(500).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

async function deletarUsuario(req, res) {
  const { idUsuario } = req.params

  const retorno = {
    mensagem: "",
    dados: {}
  }

  if (!idUsuario) {
    retorno.mensagem = "ID do usuário inválido."
    return res.status(400).json(retorno)
  }

  try {
    const resultado = await usuarioModel.deletarUsuario(idUsuario)

    if (resultado.affectedRows && resultado.affectedRows >= 1) {
      retorno.mensagem = "Usuário deletado com sucesso!"
      retorno.dados = resultado
      return res.status(200).json(retorno)
    }

    retorno.mensagem = "Não foi possível deletar o usuário."
    return res.status(500).json(retorno)
  } catch (erro) {
    console.error(erro)
    retorno.mensagem = "Algo deu errado. Tente novamente mais tarde."
    return res.status(500).json(retorno)
  }
}

module.exports = {
  autenticar,
  cadastrar,
  autenticarCodigo,
  buscarUsuarioPorEmpresa,
  adicionarCodigo,
  editarNome,
  deletarUsuario,
  buscarUsuarioPorCPF
}