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

                            uuid: usuario.uuid,

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

    const uuid = req.params.uuid;

    usuarioModel.listar(uuid)
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
    const uuid = req.query.uuid;

    usuarioModel.pesquisar(nome, uuid)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function buscarPorId(req, res) {

    const uuid = req.params.uuid;

    usuarioModel.buscarPorId(uuid)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


function editarEmail(req, res) {

    const uuid = req.params.uuid;
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            mensagem: "Informe o novo e-mail"
        });
    }

    usuarioModel.editarEmail(
        uuid,
        email
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

    const uuid = req.params.uuid;
    const novoNome = req.body.novoNome;

    if (!novoNome) {

        return res.status(400).json({

            mensagem: "Informe o novo nome"

        });

    }

    usuarioModel.editarNome(
        uuid,
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


function editarCargo(req, res) {

    const uuid = req.params.uuid;
    const novoCargo = req.body.novoCargo;

    if (!novoCargo) {
        return res.status(400).json({
            mensagem: "Informe o novo cargo"
        });
    }

    usuarioModel.editarCargo(
        uuid,
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


function excluir(req, res) {

    const uuid = req.params.uuid;

    usuarioModel.excluir(uuid)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function deletarUsuario(req, res) {

    const uuid = req.params.uuid;

    usuarioModel.deletarUsuario(uuid)
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
    editarEmail,
    editarNome,
    editarCargo,
    excluir,
    deletarUsuario,
    autenticarCodigo,
    adicionarCodigo
};