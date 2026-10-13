const usuarioModel = require("../models/usuarioModel");
const jwtMiddleware = require("../middlewares/jwt.middleware")

async function autenticar(req, res) {

  const responseBody = {
    message: "",
    data: {}
  };

  const email = req.body.email;
  const senha = req.body.password;

  console.log(email, senha)
  if (!email || !senha) {

    responseBody.message = "E-mail e senha são obrigatórios";
    return res.status(400).json(responseBody);

  }

  try {

    const resultadoAutenticar = await usuarioModel.autenticar(email, senha);

    if (resultadoAutenticar.length === 1) {

      const usuario = resultadoAutenticar[0];

      responseBody.message = "Usuário autenticado com sucesso!";
      responseBody.data = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        empresa: usuario.empresa_id,
        cargo: usuario.cargo
      };
      
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

    const idUsuario = req.params.idUsuario;
    const novoCargo = req.body.cargo;

    if (!novoCargo) {
        return res.status(400).json({
            mensagem: "Informe o novo cargo"
        });
    }

    usuarioModel.editarCargo(
        idUsuario,
        novoCargo
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