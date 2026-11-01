const serverModel = require("../models/serverModel");

function AddComponentes(req, res) {

    const { role, companyId: empresaId } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
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



async function cadastrar_instancia(req, res) {

  const reqBody = req.body
  const mac = reqBody.mac;
  const name = reqBody.name;
  const { role, companyId: empresaId } = req.token;

  const specificationsIds = {
    cpu_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c67",
    ram_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c68",
    disk_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c70",
    network_sent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c71",
    network_received: "f5ae3d95-02da-49f6-ba72-4a3913bb6c72",
    package_drop_total: "f5ae3d95-02da-49f6-ba72-4a3913bb6c73",
  }

  if (role !== 1){
    return res.status(401).json({
      mensagem: "Somente Gestores de TI têm acesso às instâncias da empresa."
    })
  }

  if (!mac || !name) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios"
    });
  }

  try {
    const instanceResponse = await serverModel.cadastrar_instancia(
      name,
      mac.toUpperCase().replaceAll(":", ""),
      empresaId
    )
  
    const idInstance = instanceResponse.uuid
    if (instanceResponse.affectedRows != 1 || !idInstance)
      throw new Error()

    if (reqBody.cpu) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.cpu_use_percent, reqBody.cpu.max || 0, reqBody.cpu.min || 0, '%')
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.ram) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.ram_use_percent, reqBody.ram.max || 0, reqBody.ram.min || 0, '%')
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.disk) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.disk_use_percent, reqBody.disk.max || 0, reqBody.disk.min || 0, '%')
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.packageDrop) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.package_drop_total, reqBody.packageDrop.max || 0, 0, 'un')
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.networkRecv) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.network_received, 0, reqBody.networkRecv.min || 0, 'Kb/s')
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.networkSent) {
      const response = await serverModel.createMetric(idInstance, specificationsIds.network_sent, 0, reqBody.networkSent.min || 0, 'Kb/s')
      if (response.affectedRows != 1)
        throw new Error()
    }
  
  return res.status(201).json({
    mensagem: "Instância cadastrada com sucesso"
  })

  } catch (e) {
    console.error(e)
    return res.status(500).json({
      mensagem: "Algo deu errado! Tente novamente mais tarde"
    })
  }
}

async function atualizar(req, res) {

  const reqBody = req.body
  const idInstance = req.params.id;
  const { role, companyId: empresaId } = req.token;

  const specificationsIds = {
    cpu_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c67",
    ram_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c68",
    disk_use_percent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c70",
    network_sent: "f5ae3d95-02da-49f6-ba72-4a3913bb6c71",
    network_received: "f5ae3d95-02da-49f6-ba72-4a3913bb6c72",
    package_drop_total: "f5ae3d95-02da-49f6-ba72-4a3913bb6c73",
  }

  if (role !== 1){
    return res.status(401).json({
      mensagem: "Somente Gestores de TI têm acesso às instâncias da empresa."
    })
  }

  if (!reqBody.name && !reqBody.cpu && !reqBody.ram && !reqBody.disk &&
      !reqBody.packageDrop && !reqBody.networkRecv && !reqBody.networkSent) {
    return res.status(400).json({
      mensagem: "Nenhuma alteração para atualizar"
    });
  }

  try {
    const instance = await serverModel.buscarDadosInstancia(idInstance, empresaId)
    if (instance.length == 0) {
      return res.status(404).json({
        mensagem: "Instância não encontrada"
      })
    }

    if (reqBody.name) {
      const response = await serverModel.updateInstanceName(idInstance, reqBody.name)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.cpu) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.cpu_use_percent, reqBody.cpu.max || 0, reqBody.cpu.min || 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.ram) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.ram_use_percent, reqBody.ram.max || 0, reqBody.ram.min || 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.disk) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.disk_use_percent, reqBody.disk.max || 0, reqBody.disk.min || 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.packageDrop) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.package_drop_total, reqBody.packageDrop.max || 0, 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.networkRecv) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.network_received, 0, reqBody.networkRecv.min || 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    if (reqBody.networkSent) {
      const response = await serverModel.updateMetric(idInstance, specificationsIds.network_sent, 0, reqBody.networkSent.min || 0)
      if (response.affectedRows != 1)
        throw new Error()
    }

    return res.status(200).json({
      mensagem: "Instância atualizada com sucesso"
    })

  } catch (e) {
    console.error(e)
    return res.status(500).json({
      mensagem: "Algo deu errado! Tente novamente mais tarde"
    })
  }
}

// COMEÇO CPU

function cadastrar_cpu(req, res) {

    const nome = req.body.nome;

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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

  const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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
    const { role, companyId: empresaId } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

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
    const { role } = req.token;

    if (role !== 1){
      return res.status(401).json({
        mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
      })
    }

    serverModel.deletarServidor(idServidor)
        .then(function (resultado) {

            res.status(200).json(resultado);

        })
        .catch(function (erro) {

            console.log(erro);

            res.status(500).json(erro);

        });
}


// async function listServers (req, res) {
//   const { role, companyId } = req.token;

//   if (role !== 1){
//     return res.status(401).json({
//       mensagem: "Somente Gestores de TI têm acesso aos servidores do sistema."
//     })
//   }

//   try {
//     const dbResponse = await serverModel.listServers(companyId)
    
//     let servers = []

//     if (dbResponse.length == 0) {
//       return res.status(200).json({
//         mensagem: "Nenhum servidor cadastrado.",
//         servers
//       })
//     }

  
//     for (let i = 0; i < dbResponse.length; i++) {
//       servers.push(dbResponse[i])
//     }

//   } catch (e) {
//     console.error(e)
//     return req.status(500).json({
//       mensagem: "Algo deu errado. Tente novamente mais tarde."
//     })
//   }
// }


async function buscarDadosInstancia(req, res) {
  const { role, companyId } = req.token;
  const { id } = req.params

  if (role !== 1){
    return res.status(401).json({
      mensagem: "Somente Gestores de TI têm acesso às instâncias da empresa."
    })
  }

  try {
    const queryResult = await serverModel.buscarDadosInstancia(id, companyId) 
    if (!queryResult)
      throw new Error()

    console.log("após consulta no banco", queryResult)
    return res.status(200).json({
      data: queryResult
    })

  } catch (e) {
    console.error(e)
    return res.status(500).json({
      mensagem: "Algo deu errado. Tente novamente mais tarde"
    })

  }


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
    update_ativar,
    buscarDadosInstancia,
    atualizar
    // listServers
};