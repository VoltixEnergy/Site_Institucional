const usuarioModel = require("../models/usuarioModel");
const jwtMiddleware = require("../middlewares/jwt.middleware")
const codeModel = require("../models/codeModel")

const bcrypt = require("bcrypt");

async function senhaHash(senhaPura) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(senhaPura, saltRounds);
  return hash;
}

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

      if (!usuario) {
        responseBody.message = "Usuário não encontrado";
        return res.status(403).json(responseBody);
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha); // bcrypt --> comparando a senha fornecida com a senha armazenada no banco de dados

      if (!senhaCorreta) {
        responseBody.message = "E-mail e/ou senha inválidos";
        return res.status(403).json(responseBody);
      }

      responseBody.message = "Usuário autenticado com sucesso!";
      responseBody.data.id = usuario.id
      responseBody.data.nome = usuario.nome
      responseBody.data.email = usuario.email
      responseBody.data.empresa = usuario.empresa_id
      responseBody.data.empresa = usuario.cargo
      responseBody.data.funcionarios = []

      if (usuario.cargo === 1) {
        const resultadoFuncionarios = await usuarioModel.buscarUsuarioPorEmpresa(usuario.empresa_id)
        responseBody.data.funcionarios = resultadoFuncionarios
      }
      
      const token = await jwtMiddleware.generate({
        id: usuario.id,
        companyId: usuario.empresa_id,
        role: usuario.cargo,
      })

      res.cookie('jwt', token, {
        maxAge: parseInt(process.env.JWT_EXPIRES) * 1000, // de segundos para milisegundos,
        httpOnly: true,
        secure: false // false para http, true para https
      })

      return res.status(200).json(responseBody);
    }
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
  const codigo = req.body.codigo || req.body.code;

  if (!nome) {
    responseBody.message = "Nome inválido."
    return res.status(400).json(responseBody)
  }
  if (!email) {
    responseBody.message = "Email inválido."
    return res.status(400).json(responseBody)
  }

  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  if (!isEmailValid) {
    responseBody.message = "Informe um e-mail válido";
     return res.status(400).json(responseBody);
  }

  if (!senha) {
    responseBody.message = "Senha inválida."
    return res.status(400).json(responseBody)
  }

  if (!codigo) {
    responseBody.message = "Código de ativação inválido."
    return res.status(400).json(responseBody)
  }

  try {
    const codeResponse = await codeModel.getCompanyAndRoleByCode(codigo)
    
    if (!codeResponse || codeResponse.length === 0) {
      retorno.message = "Seu código está inválido"
      return res.status(401).json(retorno)
    }
    
    const senhaCriptografada = await senhaHash(senha);
    const resultado = await usuarioModel.cadastrar(nome, email, senhaCriptografada, codeResponse[0].cargo, codeResponse[0].empresa_id)

    if (resultado.affectedRows !== 1) {
      retorno.message = "O usuário não foi cadastrado. Tente novamente mais tarde."
      return res.status(500).json(retorno)
    }

    const codeUpdateResponse = await codeModel.setCodeUsedByCode(codigo)

    if (codeUpdateResponse.affectedRows !== 1) {
      retorno.message = "Não foi possível cadastrar o usuário. Tente novamente mais tarde"
      res.status(500).json(retorno)
    }

    retorno.message = "Cadastro realizado com sucesso! Faça login para prosseguir"
    retorno.data = {
      id: resultado.insertId
    }
    
    return res.status(201).json(retorno)
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

  const { role, companyId } = req.token;

  if (role !== 1){
    responseBody.message = "Somente Gestores de TI têm acesso aos usuários do sistema."
    res.status(401).json(responseBody)
  }

  try {
    const resultado = await usuarioModel.buscarUsuarioPorEmpresa(companyId);

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
  const { role, companyId } = req.token;

  if (role !== 1){
    responseBody.message = "Somente Gestores de TI têm acesso aos usuários do sistema."
    res.status(401).json(responseBody)
  }

  try {

    const resultado = await usuarioModel.pesquisar(companyId, nome);

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

async function editarNome(req, res) {
  
  const responseBody = {
    message: "",
    data: {}
  };
  
  const idUsuario = req.params.idUsuario;
  const novoNome = req.body.novoNome;
  
  const { role, companyId } = req.token;

  if (role !== 1){
    responseBody.message = "Somente Gestores de TI têm acesso aos usuários do sistema."
    res.status(401).json(responseBody)
  }

  if (!novoNome) {

    responseBody.message = "Informe o novo nome";
    return res.status(400).json(responseBody);

  }

  try {

    const resultado = await usuarioModel.editarNome(idUsuario, novoNome, companyId);

    responseBody.message = "Nome atualizado com sucesso!";
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
  const { companyId, role } = req.token;

  if (role !== 1) {
    responseBody.message = "Somente Gestores de TI têm acesso aos usuários do sistema."
    return res.status(401).json(responseBody)
  }

  if (!idUsuario) {
    responseBody.message = "ID do usuário não informado";
    return res.status(400).json(responseBody);
  }

  try {

    const resultado = await usuarioModel.deletarUsuario(idUsuario, companyId);

    responseBody.message = "Usuário deletado com sucesso!";
    responseBody.data = resultado;
    return res.status(200).json(responseBody);

  } catch (erro) {

    console.error(erro);

    responseBody.message = "Algo deu errado. Tente novamente mais tarde.";
    return res.status(500).json(responseBody);

  }
}


function editarEmail(req, res) {

    const { role, companyId } = req.token;

    if (role !== 1) {
        return res.status(403).json({
            mensagem: "Acesso negado. Apenas gestores de TI podem editar e-mails."
        });
    }

    const idUsuario = req.params.id;
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            mensagem: "Informe o novo e-mail"
        });
    }

    usuarioModel.editarEmail(
        idUsuario,
        email,
        companyId
    )
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function editarCargo(req, res) {

    const { role, companyId } = req.token;

    if (role !== 1) {
        return res.status(403).json({
            mensagem: "Acesso negado. Apenas gestores de TI podem editar cargos."
        });
    }

    const idUsuario = req.params.idUsuario;
    const novoCargo = req.body.cargo;

    if (!novoCargo) {
        return res.status(400).json({
            mensagem: "Informe o novo cargo"
        });
    }

    usuarioModel.editarCargo(
        idUsuario,
        novoCargo,
        companyId
    )
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}


module.exports = {

    autenticar,
    cadastrar,
    buscarUsuarioPorEmpresa,
    listar,
    pesquisar,
    buscarPorId,
    editarEmail,
    editarNome,
    editarCargo,
    deletarUsuario,
};