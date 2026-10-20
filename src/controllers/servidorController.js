const serverModel = require("../models/serverModel");

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

module.exports = {
    cadastrar_instancia,
    pesquisar,
    cadastrar_cpu,
    deletarServidor,
    cadastrar_metrica,
    cadastrar_metrica_perda_pacote,
    cadastrar_perda_pacote,
    cadastrar_rede,
    cadastrar_metrica_rede,
    AddComponentes,
    update_desativar,
    update_ativar
};