var cpu = 'NA';
var ram = 'NA';
var disco = 'NA';
var perda_pacote = 'NA';
var rede_enviada = 'NA';
var rede_recebida = 'NA';

function buscarServidores() {
  // var idEmpresa = sessionStorage.ID_EMPRESA;

  fetch(`/server/AddComponentes`, {
    credentials: "include",
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

        if (servidor[i]['componente'] == 'cpu_use_percent' && (servidor[i]['min'] || servidor[i]['max'])) {
          cpu = servidor[i]['componente'] == 'cpu_use_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'ram_use_percent'&& (servidor[i]['min'] || servidor[i]['max'])) {
          ram = servidor[i]['componente'] == 'ram_use_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'disk_use_percent'&& (servidor[i]['min'] || servidor[i]['max'])) {
          disco = servidor[i]['componente'] == 'disk_use_percent' ? servidor[i]['min'] + '% - ' + servidor[i]['max'] + '%' : '';

        }
        if (servidor[i]['componente'] == 'package_drop_total'&& (servidor[i]['min'] || servidor[i]['max'])) {
          perda_pacote = servidor[i]['componente'] == 'package_drop_total' ? (servidor[i]['max']) + ' pacotes/s' : '';

        }
        if (servidor[i]['componente'] == 'network_sent'&& (servidor[i]['min'] || servidor[i]['max'])) {
          rede_enviada = servidor[i]['componente'] == 'network_sent' ? (servidor[i]['min']) + 'KB/s ' : "";

        }
        if (servidor[i]['componente'] == 'network_received'&& (servidor[i]['min'] || servidor[i]['max'])) {
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

          <button onclick="abrirEditor('${servidor[i]['instancia_id']}')" id="img_atualizar"><img src="../../assets/imgs/edit.png"
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
    // var empresaId = sessionStorage.ID_EMPRESA;

    if (nome == "") {
        buscarUsuarios();
        return;
    }

    fetch(`/server/pesquisar/${nome}`, {
        credentials: "include",
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

          <button onclick="abrirEditor('${servidor[i]['instancia_id']}')" id="img_atualizar"><img src="../../assets/imgs/edit.png"
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


var idServidorEditar = null
// const mudarNomeDiv = document.getElementById("mudarNome")
// const editorWrapper = document.getElementById("editorWrapper")
const editor = document.getElementById("editor")

async function abrirEditor(id) {
  idServidorEditar = id;
  document.getElementById("geral_editor").style.display = "flex";

  let regiaoVar = document.getElementById("ipt_regiao_edit");
  let macVar = document.getElementById("ipt_mac_edit");
  // let categoriaVar = document.getElementById("ipt_categoria_edit");
  let cpuVar = document.getElementById("ipt_cpu_edit");
  let cpu_minVar = document.getElementById("ipt_cpu_min_edit");
  let cpu_maxVar = document.getElementById("ipt_cpu_max_edit");
  let ramVar = document.getElementById("ipt_ram_edit");
  let ram_minVar = document.getElementById("ipt_ram_min_edit");
  let ram_maxVar = document.getElementById("ipt_ram_max_edit");
  let discoVar = document.getElementById("ipt_disco_edit");
  let disco_minVar = document.getElementById("ipt_disco_min_edit");
  let disco_maxVar = document.getElementById("ipt_disco_max_edit");
  let perda_pacotesVar = document.getElementById("ipt_perda_pacotes_edit");
  let perda_pacotes_maxVar = document.getElementById("ipt_perda_pacotes_max_edit");
  let rede_recebidaVar = document.getElementById("ipt_rede_recebida_edit");
  let rede_recebida_minVar = document.getElementById("ipt_rede_recebida_min_edit");
  let rede_enviadaVar = document.getElementById("ipt_rede_enviada_edit");
  let rede_enviada_minVar = document.getElementById("ipt_rede_enviada_min_edit");

  const response = await fetch("/server/dados-instancia/" + idServidorEditar, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (response.status != 200) 
    return alert("algo de errado");
  
  const responseJson = await response.json();

  const data = responseJson.data;
  console.log(data);

  console.log(data[0].regiao)
  console.log(data[0].endereco_mac)

  regiaoVar.value = data[0].regiao

  let enderecoMac = ""
  for(let i = 0; i < data[0].endereco_mac.length; i++) {
    enderecoMac += data[0].endereco_mac[i]
    if (i > 0 && i < 11 && i % 2 != 0)
      enderecoMac += ":"
  }

  macVar.value = enderecoMac
  
  for (let i = 0; i < data.length; i++) {
    const comp = data[i].componente;
    switch (comp) {
      case "cpu_use_percent":
        cpuVar.checked = true;
        cpu_minVar.value = data[i].min;
        cpu_maxVar.value = data[i].max;
        break;
      case "ram_use_percent":
        ramVar.checked = true;
        ram_minVar.value = data[i].min;
        ram_maxVar.value = data[i].max;
        break;
      case "disk_use_percent":
        discoVar.checked = true;
        disco_minVar.value = data[i].min;
        disco_maxVar.value = data[i].max;
        break;
      case "network_sent":
        rede_enviadaVar.checked = true;
        rede_enviada_minVar.value = data[i].min;
        break;
      case "network_received":
        rede_recebidaVar.checked = true;
        rede_recebida_minVar.value = data[i].min;
        break;
      case "package_drop_total":
        perda_pacotesVar.checked = true;
        perda_pacotes_maxVar.value = data[i].max;
        break;
    }
  }
  // document.getElementById("alterarNomeArea").style.display = "none";
  // document.getElementById("alterarEmailArea").style.display = "none";
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
    credentials: "include",
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



async function cadastrar() {
  var regiaoVar = document.getElementById("ipt_regiao").value;
  var macVar = document.getElementById("ipt_mac").value;
  // var categoriaVar = document.getElementById("ipt_categoria").value;
  var cpuVar = document.getElementById("ipt_cpu");
  var cpu_minVar = document.getElementById("ipt_cpu_min").value;
  var cpu_maxVar = document.getElementById("ipt_cpu_max").value;
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

  const body = {
    mac: macVar,
    name: regiaoVar
  }

  if (cpuVar.checked) {
    body.cpu = {
      min: cpu_minVar,
      max: cpu_maxVar,
    }
  }

  if (ramVar.checked) {
    body.ram = {
      min: ram_minVar,
      max: ram_maxVar,
    }
  }

  if (discoVar.checked) {
    body.disk = {
      min: disco_minVar,
      max: disco_maxVar,
    }
  }

  if (perda_pacotesVar.checked) {
    body.packageDrop = {
      max: perda_pacotes_maxVar,
    }
  }

  if (rede_recebidaVar.checked) {
    body.networkRecv = {
      min: rede_recebida_minVar,
    }
  }

  if (rede_enviadaVar.checked) {
    body.networkSent = {
      min: rede_enviada_minVar,
    }
  }

  const registerResponse = await fetch("/server/cadastrar-instancia", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  if (registerResponse.status != 201) 
    return alert("algo de errado")
  
  const responseJson = await registerResponse.json()

  alert(responseJson.mensagem)
  console.log(responseJson)

  setInterval(() => window.location.reload(), 3000)
}

function buttonDesativar() {

  var idServidor = idServidorEditar;
  console.log(idServidor)
  if (idServidor == null) {
    alert("Nenhum servidor selecionado!");
    return;
  }

  fetch(`/server/update_desativar/${idServidor}`, {
    credentials: "include",
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
    credentials: "include",
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

async function updateMetrics () {
  const serverId = idServidorEditar

  if (serverId == null) {
    alert("Nenhum servidor selecionado!");
    return;
  }

  let regiaoVar = document.getElementById("ipt_regiao_edit");
  let cpu_minVar = document.getElementById("ipt_cpu_min_edit");
  let cpu_maxVar = document.getElementById("ipt_cpu_max_edit");
  let ram_minVar = document.getElementById("ipt_ram_min_edit");
  let ram_maxVar = document.getElementById("ipt_ram_max_edit");
  let disco_minVar = document.getElementById("ipt_disco_min_edit");
  let disco_maxVar = document.getElementById("ipt_disco_max_edit");
  let perda_pacotes_maxVar = document.getElementById("ipt_perda_pacotes_max_edit");
  let rede_recebida_minVar = document.getElementById("ipt_rede_recebida_min_edit");
  let rede_enviada_minVar = document.getElementById("ipt_rede_enviada_min_edit");

  if (regiaoVar.value.trim() == "") {
    return alert("O nome da instância não pode ficar vazio.");
  }

  const response = await fetch("/server/dados-instancia/" + serverId, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (response.status != 200)
    return alert("algo de errado");

  const responseJson = await response.json();
  const data = responseJson.data

  const body = {}

  if (regiaoVar.value != data[0].regiao) {
    body.name = regiaoVar.value
  }

  for (let i = 0; i < data.length; i++) {
    const comp = data[i].componente;
    switch (comp) {
      case "cpu_use_percent":
        if (Number(cpu_minVar.value) != Number(data[i].min) || Number(cpu_maxVar.value) != Number(data[i].max)) {
          body.cpu = { min: cpu_minVar.value, max: cpu_maxVar.value }
        }
        break;
      case "ram_use_percent":
        if (Number(ram_minVar.value) != Number(data[i].min) || Number(ram_maxVar.value) != Number(data[i].max)) {
          body.ram = { min: ram_minVar.value, max: ram_maxVar.value }
        }
        break;
      case "disk_use_percent":
        if (Number(disco_minVar.value) != Number(data[i].min) || Number(disco_maxVar.value) != Number(data[i].max)) {
          body.disk = { min: disco_minVar.value, max: disco_maxVar.value }
        }
        break;
      case "network_sent":
        if (Number(rede_enviada_minVar.value) != Number(data[i].min)) {
          body.networkSent = { min: rede_enviada_minVar.value }
        }
        break;
      case "network_received":
        if (Number(rede_recebida_minVar.value) != Number(data[i].min)) {
          body.networkRecv = { min: rede_recebida_minVar.value }
        }
        break;
      case "package_drop_total":
        if (Number(perda_pacotes_maxVar.value) != Number(data[i].max)) {
          body.packageDrop = { max: perda_pacotes_maxVar.value }
        }
        break;
    }
  }

  if (Object.keys(body).length == 0) {
    return alert("Nenhuma alteração foi feita.");
  }

  const updateResponse = await fetch(`/server/atualizar/${serverId}`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (updateResponse.ok) {
    alert("Métricas atualizadas com sucesso");
    window.location.reload();
  } else {
    alert("Erro ao atualizar métricas.");
  }
}