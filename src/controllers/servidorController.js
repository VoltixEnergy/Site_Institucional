const serverModel = require("../models/serverModel ");


function autenticar(req, res) {

    const email = req.body.email;
    const senha = req.body.senha || req.body.password;

    if (!email || !senha) {

        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios"
        });

    }

    serverModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {

            if (resultadoAutenticar.length == 1) {

                const usuario = resultadoAutenticar[0];

                serverModel.buscarUsuarioPorEmpresa(usuario.empresa_id)
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



function AddComponentes(req, res) {

    const empresaId = req.params.empresaId || req.params.empresa_id;

    if (!empresaId) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.AddComponentes(

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



function cadastrar_instancia(req, res) {

    const regiao = req.body.regiao;
    const mac = req.body.mac;
    const categoria = req.body.categoria;
    const empresaId = req.body.empresaId || req.body.empresa_id;

    if (!regiao || !mac || !categoria || !empresaId) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_instancia(
        regiao,
        mac,
        categoria,
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

// COMEÇO CPU

function cadastrar_cpu(req, res) {

    const nome = req.body.nome;



    if (!nome) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_cpu(
       nome
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function cadastrar_metrica(req, res) {

    
    const maximo = req.body.maximo;
    const minimo = req.body.minimo;
    const unidade_medida = req.body.unidade_medida;
    const idEspecificacao = req.body.idEspecificacao;
    const idInstancia = req.body.idInstancia;

    if (!maximo || !minimo || !unidade_medida || !idEspecificacao || !idInstancia) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_metrica(
       maximo,
       minimo,
       unidade_medida,
       idEspecificacao,
       idInstancia
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



// COMEÇO REDES
function cadastrar_rede(req, res) {

    const nome = req.body.nome;



    if (!nome) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_rede(
       nome
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function cadastrar_metrica_rede(req, res) {

    
    const minimo = req.body.minimo;
    const unidade_medida = req.body.unidade_medida;
    const idEspecificacao = req.body.idEspecificacao;
    const idInstancia = req.body.idInstancia;

    if (!minimo || !unidade_medida || !idEspecificacao || !idInstancia) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_metrica_rede(
       minimo,
       unidade_medida,
       idEspecificacao,
       idInstancia
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

// FIM REDE

// COMEÇO PERDA DE PACOTES
function cadastrar_perda_pacote(req, res) {
    
    const nome = req.body.nome;



    if (!nome) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_perda_pacote(
       nome
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function cadastrar_metrica_perda_pacote(req, res) {

    
    const maximo = req.body.maximo;
    const unidade_medida = req.body.unidade_medida;
    const idEspecificacao = req.body.idEspecificacao;
    const idInstancia = req.body.idInstancia;

    if (!maximo || !unidade_medida || !idEspecificacao || !idInstancia) {

        return res.status(400).json({

            mensagem: "Preencha todos os campos obrigatórios"

        });

    }

    serverModel.cadastrar_metrica_perda_pacote(
       maximo,
       unidade_medida,
       idEspecificacao,
       idInstancia
    )
        .then(function (resultado) {

            res.status(201).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

// FIM PERDA DE PACOTES


/* =====================================================
   BUSCAR USUÁRIOS DA EMPRESA
   ===================================================== */

function buscarUsuarioPorEmpresa(req, res) {

    const empresaId = req.params.idEmpresa;

    serverModel.buscarUsuarioPorEmpresa(empresaId)
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

    serverModel.listar(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function update_desativar(req, res) {

    const idServidor = req.params.idServidor;

    serverModel.update_desativar(idServidor)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}

function update_ativar(req, res) {

    const idServidor = req.params.idServidor;

    serverModel.update_ativar( idServidor)
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
    const empresaId = req.params.empresaId;

    serverModel.pesquisar(nome, empresaId)
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

    serverModel.buscarPorId(idUsuario)
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

    serverModel.atualizar(
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


/* =====================================================
   EDITAR NOME
   ===================================================== */

function editarNome(req, res) {

    const idUsuario = req.params.idUsuario;
    const novoNome = req.body.novoNome;

    if (!novoNome) {

        return res.status(400).json({

            mensagem: "Informe o novo nome"

        });

    }

    serverModel.editarNome(
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

    serverModel.excluir(idUsuario)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}



function deletarServidor(req, res) {

    const idServidor = req.params.idServidor;

    serverModel.deletarServidor(idServidor)
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

    serverModel.autenticarCodigo(codigo)
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

    serverModel.adicionarCodigo(
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
    cadastrar_instancia,
    buscarUsuarioPorEmpresa,
    listar,
    pesquisar,
    buscarPorId,
    atualizar,
    editarNome,
    excluir,
    cadastrar_cpu,
    deletarServidor,
    autenticarCodigo,
    adicionarCodigo,
    cadastrar_metrica,
    cadastrar_metrica_perda_pacote,
    cadastrar_perda_pacote,
    cadastrar_rede,
    cadastrar_metrica_rede,
    AddComponentes,
    update_desativar,
    update_ativar
};