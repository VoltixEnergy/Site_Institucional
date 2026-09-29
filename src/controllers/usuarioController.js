const usuarioModel = require("../models/usuarioModel");


function autenticar(req, res) {

    const email = req.body.email;
    const senha = req.body.senha || req.body.password;

    if (!email || !senha) {

        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios"
        });

    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {

            if (resultadoAutenticar.length == 1) {

                const usuario = resultadoAutenticar[0];

                usuarioModel.buscarUsuarioPorEmpresa(usuario.empresa_id)
                    .then(function (resultadoFuncionarios) {

                        res.status(200).json({

                            id: usuario.id,

                            email: usuario.email,

                            nome: usuario.nome,

                            empresa: usuario.empresa_id,

                            cargo: usuario.cargo,

                            funcionarios: resultadoFuncionarios

                        });

                    })
                    .catch(function (erro) {

                        console.log(erro);

                        res.status(500).json(erro);

                    });

            } else {

                res.status(403).json({

                    mensagem: "E-mail e/ou senha inválidos"

                });

            }

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function cadastrar(req, res) {

    const nome = req.body.nome || req.body.name;
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;
    const cargo = req.body.cargo || 1;
    const empresaId = req.body.empresaId || req.body.empresa_id;

    if (!nome || !email || !senha || !empresaId) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    usuarioModel.cadastrar(
        nome,
        email,
        senha,
        null,
        cargo,
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


/* =====================================================
   BUSCAR USUÁRIOS DA EMPRESA
   ===================================================== */

function buscarUsuarioPorEmpresa(req, res) {

    const empresaId = req.params.idEmpresa;

    usuarioModel.buscarUsuarioPorEmpresa(empresaId)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function listar(req, res) {

    const idUsuario = req.params.id;

    usuarioModel.listar(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function pesquisar(req, res) {

    const nome = req.params.nome;
    const idUsuario = req.query.idUsuario;

    usuarioModel.pesquisar(nome, idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function buscarPorId(req, res) {

    const idUsuario = req.params.id;

    usuarioModel.buscarPorId(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function atualizar(req, res) {

    const idUsuario = req.params.id;

    const nome = req.body.nome;
    const email = req.body.email;
    const cargo = req.body.cargo;

    usuarioModel.atualizar(
        idUsuario,
        nome,
        email,
        cargo
    )
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function editarNome(req, res) {

    const idUsuario = req.params.idUsuario;
    const novoNome = req.body.novoNome;

    if (!novoNome) {

        return res.status(400).json({

            mensagem: "Informe o novo nome"

        });

    }

    usuarioModel.editarNome(
        idUsuario,
        novoNome
    )
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function excluir(req, res) {

    const idUsuario = req.params.id;

    usuarioModel.excluir(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function deletarUsuario(req, res) {

    const idUsuario = req.params.idUsuario;

    usuarioModel.deletarUsuario(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function autenticarCodigo(req, res) {

    const codigo = req.body.codigo;

    if (!codigo) {

        return res.status(400).json({

            mensagem: "Código não informado"

        });

    }

    usuarioModel.autenticarCodigo(codigo)
        .then(function (resultado) {

            if (resultado.length == 1) {

                res.status(200).json(resultado);

            } else {

                res.status(403).json({

                    mensagem: "Código inválido ou expirado"

                });

            }

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function adicionarCodigo(req, res) {

    const codigo = req.body.codigo;
    const empresaId = req.body.empresaId || req.body.empresa_id;
    const cargo = req.body.cargo;
    const expiraEm = req.body.expiraEm;

    if (!codigo || !empresaId || !cargo || !expiraEm) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos"

        });

    }

    usuarioModel.adicionarCodigo(
        codigo,
        empresaId,
        cargo,
        expiraEm
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

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
    atualizar,
    editarNome,
    excluir,
    deletarUsuario,
    autenticarCodigo,
    adicionarCodigo
};