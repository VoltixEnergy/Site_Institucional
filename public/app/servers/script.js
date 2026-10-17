var cpu = 'NA';
var ram = 'NA';
var disco = 'NA';
var perda_pacote = 'NA';
var rede_enviada = 'NA';
var rede_recebida = 'NA';

function buscarServidores() {
  var idEmpresa = sessionStorage.ID_EMPRESA;

  console.log("ID da empresa:", idEmpresa);

  if (!idEmpresa) {
    console.log("Empresa não encontrada no sessionStorage.");
    return;
  }

  fetch(`/server/AddComponentes/${idEmpresa}`, {
    method: "GET"
  })
    .then(function (resposta) {
      console.log("Resposta:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        console.log("Houve um erro ao tentar listar usuários!");
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error(texto);
        });
      }
    })
    .then(function (servidor) {
      console.log("USUÁRIOS DA EMPRESA:", servidor);

      var lista = document.getElementById("listarUsuarios");

      if (!lista) {
        console.log("Elemento listarUsuarios não encontrado.");
        return;
      }



      if (servidor.length == 0) {
        lista.innerHTML += `
                    <div class="user">
                        <p>Nenhum servidor cadastrado.</p>
                    </div>
                `;
        return;
      }

      var servidores = []

      console.log(servidor)

      for (var i = 0; i < servidor.length; i++) {

        // var nomeCargo = "Usuário";

        // if (item.cargo == 1) {
        //   nomeCargo = "Gestor de TI";
        // } else if (item.cargo == 2) {
        //   nomeCargo = "Analista NOC";
        // }

        // var primeiraLetra = item.nome.charAt(0).toUpperCase();
        // var segundaLetra = "";

        // if (item.nome.length > 1) {
        //   segundaLetra = item.nome.charAt(1).toUpperCase();
        // }

        if (servidor[i]['componente'] == 'cpu_use_percent') {
          cpu = servidor[i]['componente'] == 'cpu_use_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'ram_total_percent') {
          ram = servidor[i]['componente'] == 'ram_total_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'disk_free_percent') {
          disco = servidor[i]['componente'] == 'disk_free_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'package_drop_total') {
          perda_pacote = servidor[i]['componente'] == 'package_drop_total' ? (servidor[i]['max']) + 'KB/s' : '';

        }
        if (servidor[i]['componente'] == 'network_sent') {
          rede_enviada = servidor[i]['componente'] == 'network_sent' ? (servidor[i]['min']) + 'KB/s ' : "";

        }
        if (servidor[i]['componente'] == 'network_received') {
          rede_recebida = servidor[i]['componente'] == 'network_received' ? (servidor[i]['min']) + 'KB/s ' : "";

        }








        if (i == servidor.length - 1 || servidor[i]['regiao'] != servidor[i + 1]['regiao']) {
          console.log(cpu)
          console.log(ram)
          console.log(disco)
          console.log(perda_pacote)
          console.log(rede_enviada)
          console.log(rede_recebida)
          lista.innerHTML += `
        <div class="user-list-header">
          <span>${servidor[i]['regiao']}</span>
          <span>${cpu}</span>
          <span>${ram}</span>
          <span>${disco}</span>
          <span>${perda_pacote}</span>
          <span>${rede_enviada}</span>
          <span>${rede_recebida}</span>
          <span id="status" class = "cor">${servidor[i]['status'] == '1' ? 'Ativo' : "Inativo"}</span>

          <button onclick="abrirEditor(${servidor[i]['instancia_id']})" id="img_atualizar"><img src="../../assets/imgs/edit.png"
              width="18px"></button>

        </div>`

          cpu = 'NA';
          ram = 'NA';
          disco = 'NA';
          perda_pacote = 'NA';
          rede_enviada = 'NA';
          rede_recebida = 'NA';



              
        }
        
        StatusCor()

        //  lista.innerHTML += `
        //              <div class="user-list-header">
        //                  <span>${servidor[i]['regiao']}</span>`

        // if(servidor[i]['componente'] == 'cpu_use_percent'){
        //   lista.innerHTML += `<span>${servidor[i]['min']}% - ${servidor[i]['max']}%</span>`
        // }
        // if(servidor[i]['componente'] == 'ram_total_percent'){
        //   lista.innerHTML += `<span>${servidor[i]['min']}% - ${servidor[i]['max']}%</span>`
        // }
        // if(servidor[i]['componente'] == 'disk_free_percent'){
        //   lista.innerHTML += `<span>${servidor[i]['min']}% - ${servidor[i]['max']}%</span>`
        // }
        // if(servidor[i]['componente'] == 'package_drop_total'){
        //   lista.innerHTML += `<span>${servidor[i]['max']}KB/s</span>`
        // }
        // if(servidor[i]['componente'] == 'network_sent'){
        //   lista.innerHTML += `<span>${servidor[i]['min']}%KB/s</span>`
        // }
        // if(servidor[i]['componente'] == 'network_received'){
        //   lista.innerHTML += `<span>${servidor[i]['min']}KB/s</span>`
        // }
        // if(servidor[i]['status'] == '1'){
        //   lista.innerHTML += `<span>Ativo</span>
        //   <button onclick="abrirEditor()" id="img_atualizar"><img src="../../assets/imgs/edit.png"
        //                  width="18px"></button> </div>`
        // }else{
        //   lista.innerHTML += `
        //   <span>Desativo</span>
        //   <button onclick="abrirEditor()" id="img_atualizar"><img src="../../assets/imgs/edit.png"
        //                  width="18px"></button> </div>`
        // }

      }
    })
    .catch(function (erro) {
      console.log("Erro ao buscar usuários:", erro);
    });
}

function StatusCor(){
  var status_CORES = document.querySelectorAll('.cor')
  
  status_CORES.forEach((status_COR) => {

    if(status_COR.innerHTML == "Inativo"){
      status_COR.style.color = "red";
    }
});
}


function Pesquisar() {
    var nome = document.getElementById("input_pesquisa").value;
    var empresaId = sessionStorage.ID_EMPRESA;

    if (nome == "") {
        buscarUsuarios();
        return;
    }

    fetch(`/server/pesquisar/${nome}/${empresaId}`, {
        method: "GET"
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro ao pesquisar usuários.");
            }
        })
        .then(function (servidor) {
            var lista = document.getElementById("listarUsuarios");
          lista.innerHTML = `<div class="user-list-header">
          <span>Região</span>
          <span>CPU</span>
          <span>RAM</span>
          <span>Disco</span>
          <span>Perda de pacotes</span>
          <span>Rede Enviada</span>
          <span>Rede Recebida</span>
          <span>Status</span>
          <span>Atualizar</span>
        </div>`
            for (var i = 0; i < servidor.length; i++) {

  
        if (servidor[i]['componente'] == 'cpu_use_percent') {
          cpu = servidor[i]['componente'] == 'cpu_use_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'ram_total_percent') {
          ram = servidor[i]['componente'] == 'ram_total_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'disk_free_percent') {
          disco = servidor[i]['componente'] == 'disk_free_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'package_drop_total') {
          perda_pacote = servidor[i]['componente'] == 'package_drop_total' ? (servidor[i]['max']) + 'KB/s' : '';

        }
        if (servidor[i]['componente'] == 'network_sent') {
          rede_enviada = servidor[i]['componente'] == 'network_sent' ? (servidor[i]['min']) + 'KB/s ' : "";

        }
        if (servidor[i]['componente'] == 'network_received') {
          rede_recebida = servidor[i]['componente'] == 'network_received' ? (servidor[i]['min']) + 'KB/s ' : "";

        }

        if (i == servidor.length - 1 || servidor[i]['regiao'] != servidor[i + 1]['regiao']) {
          console.log(cpu)
          console.log(ram)
          console.log(disco)
          console.log(perda_pacote)
          console.log(rede_enviada)
          console.log(rede_recebida)
          lista.innerHTML += `
        <div class="user-list-header">
          <span>${servidor[i]['regiao']}</span>
          <span>${cpu}</span>
          <span>${ram}</span>
          <span>${disco}</span>
          <span>${perda_pacote}</span>
          <span>${rede_enviada}</span>
          <span>${rede_recebida}</span>
          <span id="status" class = "cor">${servidor[i]['status'] == '1' ? 'Ativo' : "Inativo"}</span>

          <button onclick="abrirEditor(${servidor[i]['instancia_id']})" id="img_atualizar"><img src="../../assets/imgs/edit.png"
              width="18px"></button>

        </div>`

          cpu = 'NA';
          ram = 'NA';
          disco = 'NA';
          perda_pacote = 'NA';
          rede_enviada = 'NA';
          rede_recebida = 'NA';



              
        }
        
        StatusCor()

            }
        })
        .catch(function (erro) {
            console.log("Erro na pesquisa:", erro);
        });
}



function editarNome(novoNome, idUsuario) {
  fetch("/usuarios/editarNome/:idUsuario", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      novoNome: novoNome,
      idUsuario: idUsuario
    })
  }).then(function (resposta) {
    console.log("ESTOU NO THEN DO entrar()!")

    if (resposta.ok) {
      console.log(resposta);
      let funcionarios = JSON.parse(sessionStorage.FUNCIONARIOS);
      for (let i = 0; i < funcionarios.length; i++) {

        if (funcionarios[i].id_usuario == idUsuario) {

          funcionarios[i].nome = novoNome;

        }
      }
      sessionStorage.FUNCIONARIOS = JSON.stringify(funcionarios);

      window.location.reload()
      resposta.json().then(json => {
        console.log(json);

      });

    } else {

      console.log("Houve um erro ao tentar atualizar os dados!");

      resposta.text().then(texto => {
        console.error(texto);
        finalizarAguardar(texto);
      });
    }

  }).catch(function (erro) {
    console.log(erro);
  })

  return false;
}


let idServidorEditar = null
// const mudarNomeDiv = document.getElementById("mudarNome")
// const editorWrapper = document.getElementById("editorWrapper")
const editor = document.getElementById("editor")

function abrirEditor(id) {
  idServidorEditar = id;
  document.getElementById("geral_editor").style.display = "flex";
  document.getElementById("alterarNomeArea").style.display = "none";
  document.getElementById("alterarEmailArea").style.display = "none";
}

function sairEditor() {
  document.getElementById("geral_editor").style.display = "none";
  idServidorEditar = null;
}

function abrirAddUser() {
  document.getElementById("geral_addUser").style.display = "flex";
}

function sairAddUser() {
  document.getElementById("geral_addUser").style.display = "none";
}


function deletarServidor() {
  var idServidor = idServidorEditar;
  console.log(idServidor)
  if (idServidor == null) {
    alert("Nenhum servidor selecionado!");
    return;
  }

  fetch(`/server/deletarservidor/${idServidor}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.ok) {
        alert("Conta deletada com sucesso!");

        window.location.reload();
      } else {
        response.json().then(erro => alert(erro.erro || "Erro ao deletar"));
      }
    })
    .catch(erro => console.error("Erro na requisição:", erro));
}



function cadastrar() {
  var regiaoVar = document.getElementById("ipt_regiao").value;
  var macVar = document.getElementById("ipt_mac").value;
  var categoriaVar = document.getElementById("ipt_categoria").value;
  var cpuVar = document.getElementById("ipt_cpu");
  var ramVar = document.getElementById("ipt_ram");
  var ram_minVar = document.getElementById("ipt_ram_min").value;
  var ram_maxVar = document.getElementById("ipt_ram_max").value;
  var discoVar = document.getElementById("ipt_disco");
  var disco_minVar = document.getElementById("ipt_disco_min").value;
  var disco_maxVar = document.getElementById("ipt_disco_max").value;
  var perda_pacotesVar = document.getElementById("ipt_perda_pacotes");
  var perda_pacotes_maxVar = document.getElementById("ipt_perda_pacotes_max").value;
  var rede_recebidaVar = document.getElementById("ipt_rede_recebida");
  var rede_recebida_minVar = document.getElementById("ipt_rede_recebida_min").value;
  var rede_enviadaVar = document.getElementById("ipt_rede_enviada");
  var rede_enviada_minVar = document.getElementById("ipt_rede_enviada_min").value;
  var empresaIdVar = sessionStorage.ID_EMPRESA;
  var idInstancia = 0;





  // if (nomeVar.length < 3) {
  //     alert("O nome deve ter ao menos 3 caracteres.");
  //     return false;
  // }

  // if (senhaVar.length < 6) {
  //     alert("A senha deve ter ao menos 6 caracteres.");
  //     return false;
  // }

  // if (senhaVar != confirmacaoSenhaVar) {
  //     alert("As senhas não coincidem.");
  //     return false;
  // }

  fetch("/server/cadastrar-instancia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      regiao: regiaoVar,
      mac: macVar,
      categoria: categoriaVar,
      empresaId: empresaIdVar,
    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();

      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar intância.");
        });
      }
    })
    .then(function (resultado) {
      console.log("Intância cadastrado:", resultado);
      alert("Intância cadastrado com sucesso!");
      idInstancia = resultado.insertId;
      if (cpuVar.checked) {
        cadastrar_cpu(idInstancia);
      }
      if (ramVar.checked) {
        cadastrar_ram(idInstancia);
      }
      if (discoVar.checked) {
        cadastrar_disco(idInstancia);
      }
      if (perda_pacotesVar.checked) {
        cadastrar_perda_pacote(idInstancia);
      }
      if (rede_enviadaVar.checked) {
        cadastrar_rede_enviada(idInstancia);
      }
      if (rede_recebidaVar.checked) {
        cadastrar_rede_recebida(idInstancia);
      }

    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
      alert("Não foi possível cadastrar o intância.");

    });




  return false;


}

// CPU
function cadastrar_cpu(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-cpu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'cpu_use_percent',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar especificação.");
        });
      }
    })
    .then(function (resultado) {
      console.log("Especificação. cadastrado:", resultado);
      alert("Especificação. cadastrado com sucesso!");
      idEspecificacao = resultado.insertId;

      cpu_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
      alert("Não foi possível cadastrar o especificação..");
    });



  return null;

}

function cpu_metrica(idEspecificacao, idInstancia) {

  var cpu_minVar = document.getElementById("ipt_cpu_min").value;
  var cpu_maxVar = document.getElementById("ipt_cpu_max").value;
  var unidade_medidaVar = '%';



  fetch("/server/cadastrar-metrica", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      maximo: cpu_maxVar,
      minimo: cpu_minVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar métrica.");
        });
      }
    })
    .then(function (resultado) {
      console.log("Métrica cadastrado:", resultado);
      window.location.reload()

    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });

  return null;
}

// RAM

function cadastrar_ram(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-cpu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'ram_total_percent',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar ram.");
        });
      }
    })
    .then(function (resultado) {
      console.log("RAM. cadastrado:", resultado);
      idEspecificacao = resultado.insertId;

      ram_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;

}

function ram_metrica(idEspecificacao, idInstancia) {

  var ram_minVar = document.getElementById("ipt_ram_min").value;
  var ram_maxVar = document.getElementById("ipt_ram_max").value;
  var unidade_medidaVar = '%';

  fetch("/server/cadastrar-metrica", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      maximo: ram_maxVar,
      minimo: ram_minVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar ram.");
        });
      }
    })
    .then(function (resultado) {
      console.log("ram cadastrado:", resultado);
      window.location.reload()
    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });

  return null;
}

// Disco


function cadastrar_disco(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-cpu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'disk_free_percent',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar disco.");
        });
      }
    })
    .then(function (resultado) {
      console.log("disco. cadastrado:", resultado);
      idEspecificacao = resultado.insertId;

      disco_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;

}

function disco_metrica(idEspecificacao, idInstancia) {

  var disco_minVar = document.getElementById("ipt_disco_min").value;
  var disco_maxVar = document.getElementById("ipt_disco_max").value;
  var unidade_medidaVar = '%';

  fetch("/server/cadastrar-metrica", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      maximo: disco_maxVar,
      minimo: disco_minVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar DISCO.");
        });
      }
    })
    .then(function (resultado) {
      console.log("DISCO cadastrado:", resultado);
      window.location.reload()
    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });

  return null;
}

// PERDA DE PACOTE


function cadastrar_perda_pacote(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-perda-pacote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'package_drop_total',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar perda de pacotes.");
        });
      }
    })
    .then(function (resultado) {
      console.log("perda de pacotes. cadastrado:", resultado);
      idEspecificacao = resultado.insertId;

      perda_pacotes_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;

}

function perda_pacotes_metrica(idEspecificacao, idInstancia) {

  var perda_pacotes_maxVar = document.getElementById("ipt_perda_pacotes_max").value;
  var unidade_medidaVar = 'KB/s';



  fetch("/server/cadastrar-metrica-perda-pacote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      maximo: perda_pacotes_maxVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar perda de pacotes.");
        });
      }
    })
    .then(function (resultado) {
      console.log("perda de pacotes cadastrado:", resultado);

    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });

  return null;
}

// REDE ENVIADA

function cadastrar_rede_enviada(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-rede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'network_sent',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar Rede enviada.");
        });
      }
    })
    .then(function (resultado) {
      console.log("Rede. cadastrado:", resultado);
      idEspecificacao = resultado.insertId;

      rede_enviada_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;

}

function rede_enviada_metrica(idEspecificacao, idInstancia) {

  var rede_enviada_minVar = document.getElementById("ipt_rede_enviada_min").value;
  var unidade_medidaVar = 'KB/s';


  fetch("/server/cadastrar-metrica-rede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({

      minimo: rede_enviada_minVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar rede enviada.");
        });
      }
    })
    .then(function (resultado) {
      console.log("rede enviada cadastrado:", resultado);

    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });

  return null;
}


// REDE RECEBIDA

function cadastrar_rede_recebida(idInstancia) {


  var idEspecificacao = 0;

  // Especificação
  fetch("/server/cadastrar-rede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: 'network_received',

    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {

        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar rede recebida.");
        });
      }
    })
    .then(function (resultado) {
      console.log("rede recebida. cadastrado:", resultado);
      idEspecificacao = resultado.insertId;

      rede_recebida_metrica(idEspecificacao, idInstancia);


    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;

}

function rede_recebida_metrica(idEspecificacao, idInstancia) {

  var rede_recebida_minVar = document.getElementById("ipt_rede_recebida_min").value;
  var unidade_medidaVar = 'KB/s';

  // alert(rede_recebida_maxVar)
  // alert(rede_recebida_minVar)
  // alert(unidade_medidaVar)
  // alert(idEspecificacao)
  // alert(idInstancia)

  fetch("/server/cadastrar-metrica-rede", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      minimo: rede_recebida_minVar,
      unidade_medida: unidade_medidaVar,
      idEspecificacao: idEspecificacao,
      idInstancia: idInstancia,


    })
  })
    .then(function (resposta) {
      console.log("Resposta cadastro:", resposta);

      if (resposta.ok) {
        return resposta.json();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          throw new Error("Erro ao cadastrar rede recebida.");
        });
      }
    })
    .then(function (resultado) {

      console.log("rede recebida cadastrado:", resultado);
      window.location.reload();
    })
    .catch(function (erro) {
      console.log("Erro no cadastro:", erro);
    });



  return null;
}

function buttonDesativar() {

  var idServidor = idServidorEditar;
  console.log(idServidor)
  if (idServidor == null) {
    alert("Nenhum servidor selecionado!");
    return;
  }

  fetch(`/server/update_desativar/${idServidor}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function (resposta) {
      if (resposta.ok) {
        alert("Desativado com sucesso!");
        window.location.reload();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          alert("Erro ao desativar instância");
        });
      }
    })
    .catch(function (erro) {
      console.log("Erro na requisição:", erro);
    });
}

function buttonAtivar() {
  var idServidor = idServidorEditar;
  console.log(idServidor)
  if (idServidor == null) {
    alert("Nenhum servidor selecionado!");
    return;
  }

  fetch(`/server/update_ativar/${idServidor}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function (resposta) {
      if (resposta.ok) {
        alert("Ativado com sucesso!");
        window.location.reload();
      } else {
        return resposta.text().then(function (texto) {
          console.error(texto);
          alert("Erro ao ativar instância");
        });
      }
    })
    .catch(function (erro) {
      console.log("Erro na requisição:", erro);
    });
}
