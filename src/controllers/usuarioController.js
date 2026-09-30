const usuarioModel = require("../models/usuarioModel");
const jwtMiddleware = require("../middlewares/jwt.middleware")

async function autenticar(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const email = req.body.email;
  const senha = req.body.password;

  if (!email || !senha) {

    responseBody.message = "E-mail e senha são obrigatórios";
    return res.status(400).json(responseBody);

  }

  try {

    const resultadoAutenticar = await usuarioModel.autenticar(email, senha);

    if (resultadoAutenticar.length === 1) {

      const usuario = resultadoAutenticar[0];

      responseBody.message = "Usuário autenticado com sucesso!";
      
      const token = await jwtMiddleware.generate({
        id: usuario.id,
        companyId: usuario.empresa_id,
        role: usuario.cargo,
      })

      responseBody.data = token

      return res.status(200).json(responseBody);

    }

    responseBody.message = "E-mail e/ou senha inválidos";
    return res.status(403).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function cadastrar(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const nome = req.body.nome || req.body.name;
  const email = req.body.email;
  const senha = req.body.senha || req.body.password;
  const cargo = req.body.cargo || 1;
  const empresaId = req.body.empresaId || req.body.empresa_id;

  if (!nome || !email || !senha || !empresaId) {

    responseBody.message = "Preencha todos os campos obrigatórios";
    return res.status(400).json(responseBody);

  }

  try {

    const resultado = await usuarioModel.cadastrar(
      nome,
      email,
      senha,
      null,
      cargo,
      empresaId
    );

    responseBody.message = "Usuário cadastrado com sucesso!";
    responseBody.data = resultado;
    return res.status(201).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}

async function buscarUsuarioPorEmpresa(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const empresaId = req.params.idEmpresa;

  try {

    const resultado = await usuarioModel.buscarUsuarioPorEmpresa(empresaId);

    responseBody.message = resultado.length ? "" : "Nenhum usuário encontrado.";
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

  const idUsuario = req.params.id;

  try {

    const resultado = await usuarioModel.listar(idUsuario);

    responseBody.message = resultado.length ? "" : "Nenhum usuário encontrado.";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function pesquisar(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const nome = req.params.nome;
  const idUsuario = req.query.idUsuario;

  try {

    const resultado = await usuarioModel.pesquisar(nome, idUsuario);

    responseBody.message = resultado.length ? "" : "Nenhum usuário encontrado.";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function buscarPorId(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const idUsuario = req.params.id;

  try {

    const resultado = await usuarioModel.buscarPorId(idUsuario);

    responseBody.message = resultado.length ? "" : "Nenhum usuário encontrado.";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function atualizar(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const idUsuario = req.params.id;

  const nome = req.body.nome;
  const email = req.body.email;
  const cargo = req.body.cargo;

  try {

    const resultado = await usuarioModel.atualizar(idUsuario, nome, email, cargo);

    responseBody.message = "Usuário atualizado com sucesso!";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}

async function editarNome(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const idUsuario = req.params.idUsuario;
  const novoNome = req.body.novoNome;

  if (!novoNome) {

    responseBody.message = "Informe o novo nome";
    return res.status(400).json(responseBody);

  }

  try {

    const resultado = await usuarioModel.editarNome(idUsuario, novoNome);

    responseBody.message = "Nome atualizado com sucesso!";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function excluir(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const idUsuario = req.params.id;

  try {

    const resultado = await usuarioModel.excluir(idUsuario);

    responseBody.message = "Usuário excluído com sucesso!";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function deletarUsuario(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const idUsuario = req.params.idUsuario;

  try {

    const resultado = await usuarioModel.deletarUsuario(idUsuario);

    responseBody.message = "Usuário deletado com sucesso!";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function autenticarCodigo(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const codigo = req.body.codigo;

  if (!codigo) {

    responseBody.message = "Código não informado";
    return res.status(400).json(responseBody);

  }

  try {

    const resultado = await usuarioModel.autenticarCodigo(codigo);

    if (resultado.length === 1) {

      responseBody.message = "Código validado com sucesso!";
      responseBody.data = resultado;
      return res.status(200).json(responseBody);

    }

    responseBody.message = "Código inválido ou expirado";
    return res.status(403).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


async function adicionarCodigo(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const codigo = req.body.codigo;
  const empresaId = req.body.empresaId || req.body.empresa_id;
  const cargo = req.body.cargo;
  const expiraEm = req.body.expiraEm;

  if (!codigo || !empresaId || !cargo || !expiraEm) {

    responseBody.message = "Preencha todos os campos";
    return res.status(400).json(responseBody);

  }

  try {

    const resultado = await usuarioModel.adicionarCodigo(
      codigo,
      empresaId,
      cargo,
      expiraEm
    );

    responseBody.message = "Código adicionado com sucesso!";
    responseBody.data = resultado;
    return res.status(201).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


module.exports = {

  autenticar,
  cadastrar,
  buscarUsuarioPorEmpresa,
  listar,
  pesquisar,
  buscarPorId,
  atualizar,
  editarNome,
  excluir,
  deletarUsuario,
  autenticarCodigo,
  adicionarCodigo
};