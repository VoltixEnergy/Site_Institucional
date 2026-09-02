var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({ aquarios: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var nivelPermissao = req.body.nivelPermissaoServer;
    var fkEmpresa = req.body.fkEmpresaServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.buscarPorCpf(cpf).then((resultado) => {
            if (resultado.length > 0) {
                res
                    .status(401)
                    .json({ mensagem: `O usuário com o CPF ${cpf} já existe` });
            } else {
                usuarioModel.cadastrar(nome, email, senha, cpf, nivelPermissao, fkEmpresa)
                .then(
                    function (resultado) {
                        res.json(resultado);
                    }
                ).catch(
                    function (erro) {
                        console.log(erro);
                        console.log(
                            "\nHouve um erro ao realizar o cadastro! Erro: ",
                            erro.sqlMessage
                        );
                        res.status(500).json(erro.sqlMessage);
                    }
                );
            }
        });
    }

}

function autenticarCodigo(req, res) {
    var codigo = req.body.codigoServer;

    if (codigo == undefined) {
        res.status(400).send("Seu codigo está undefined!");
    } else {

        usuarioModel.autenticarCodigo(codigo)
            .then(
                function (resultadoAutenticarCodigo) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticarCodigo.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticarCodigo)}`); // transforma JSON em String

                    if (resultadoAutenticarCodigo.length == 1) {
                        console.log(resultadoAutenticarCodigo);
                        res.json({
                            id: resultadoAutenticarCodigo[0].id_codigo,
                            codigo: resultadoAutenticarCodigo[0].codigo,
                            status: resultadoAutenticarCodigo[0].estado_codigo,
                        });
                    } else if (resultadoAutenticarCodigo.length == 0) {
                        res.status(403).send("Código inválido!");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!???");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao validar o código! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function buscarUsuarioPorEmpresa(req, res) {
    console.log("controller")
    var idEmpresa = req.params.idEmpresa;
    console.log(idEmpresa)
    usuarioModel.buscarUsuarioPorEmpresa(idEmpresa).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os funcionarios: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
function adicionarCodigo(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var codigo = req.body.codigoServer;

    // Faça as validações dos valores
    if (codigo == undefined) {
        res.status(400).send("Seu codigo está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.adicionarCodigo(codigo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro do código! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function editarNome(req, res) {
    var novoNome = req.body.novoNome;
    var idusuario = req.params.idUsuario;

    usuarioModel.editarNome(novoNome, idusuario)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao editar o nome: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

module.exports = {
    autenticar,
    cadastrar,
    autenticarCodigo,
    buscarUsuarioPorEmpresa,
    adicionarCodigo,
    editarNome
}