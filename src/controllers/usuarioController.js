const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

async function autenticar(req, res) {

    const email = req.body.email;
    const senha = req.body.senha || req.body.password;

    if (email == undefined || senha == undefined) {
        return res.status(400).json({
            mensagem: "Email ou senha não informados"
        });
    }
    try{
        const resultado = await usuarioModel.autenticar(email); // await --> afisa que a função é assíncrona e espera o resultado da autenticação

        if (!usuario) {
            return res.status(403).json({
                mensagem: "Usuario não encontrado"
            });
        }

        const usuario = resultado[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha); // bcrypt --> comparando a senha fornecida com a senha armazenada no banco de dados

        if (senhaCorreta) {
            res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                empresa: usuario.empresa_id,
                funcionarios: usuario.funcionarios || []
            })
            }else {
                res.status(403).json({
                    mensagem: "Email ou senha inválidos"
                });
            }
    }catch (erro) {
        console.log("Erro interno: " + erro);
        res.status(500).json({ mensagem: "Erro interno no servidor ao tentar logar"});
    }
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
    editarEmail,
    editarNome,
    editarCargo,
    excluir,
    deletarUsuario,
    autenticarCodigo,
    adicionarCodigo
};