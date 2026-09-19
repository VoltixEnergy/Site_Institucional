function buscarUsuarios() {
  // var idEmpresa = 1
  // console.log("Listando funcionarios da empresa!")
  // fetch(`/usuarios/buscarUsuarioPorEmpresa/${idEmpresa}`, {
  //     method: "GET"
  // })
  //     .then(function (resposta) {
  //         console.log(resposta)
  //         console.log("ESTOU NO THEN DO entrar()!")
  //         if (resposta.ok) {
  //             console.log(resposta);
  //             return resposta.json()
  //         } else {

  //             console.log("Houve um erro ao tentar listar usuários!");

  //             resposta.text().then(texto => {
  //                 console.error(texto);
  //                 finalizarAguardar(texto);
  //             });
  //         }

  //     })
  //     .then(function (json) {

  //         console.log(json);

  JSON.parse(sessionStorage.FUNCIONARIOS).forEach(item => {
    let nomeCargo = "Func"
    if (item.nivel_permissao == 0) {
      nomeCargo = "Admin"
    }
    document.getElementById("usersBox").innerHTML +=
      `<div class="user">
                          <div class="infosUser">
                          <p id="userAvatar">${item.nome[0] + item.nome[1]}</p>
                          <p id="userName">${item.nome}</p>
                          
                          </div>
                          <p id="userCargo" style = "border: 1px solid white; padding: 0.5rem; border-radius: 1rem;">${nomeCargo}</p>
                          <button class="mudarNome" id="mudarNome" onclick="abrirEditor(${item.id_usuario})"><img src="../../assets/imgs/edit.png"></button>
                      </div>`
  });
  // }).catch(function (erro) {
  //     console.log(erro);
  // })
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


let idUsuarioEditar = null
// const mudarNomeDiv = document.getElementById("mudarNome")
// const editorWrapper = document.getElementById("editorWrapper")
const editor = document.getElementById("editor")

function abrirEditor(id) {
  document.getElementById("geral_editor").style.display = "flex";
  idUsuarioEditar = id;
}

function sairEditor() {
  document.getElementById("geral_editor").style.display = "none";
  idUsuarioEditar = null;
}

function abrirAddUser() {
  document.getElementById("geral_addUser").style.display = "flex";
}

function sairAddUser() {
  document.getElementById("geral_addUser").style.display = "none";
}

function mudarNome() {
  novoNome = novoNome.value
  editarNome(novoNome, idUsuarioEditar)
}
function deletarUsuario() {
  var idUsuario = idUsuarioEditar;

  if (idUsuario == null) {
    alert("Nenhum usuário selecionado!");
    return;
  }

  fetch(`/usuarios/deletarUsuario/${idUsuario}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.ok) {
        alert("Conta deletada com sucesso!");
        let funcionarios = JSON.parse(sessionStorage.FUNCIONARIOS);
        for (let i = 0; i < funcionarios.length; i++) {

          if (funcionarios[i].id_usuario == idUsuario) {
            funcionarios.splice(i, 1);

          }
        }
        sessionStorage.FUNCIONARIOS = JSON.stringify(funcionarios);
        window.location.reload();
      } else {
        response.json().then(erro => alert(erro.erro || "Erro ao deletar"));
      }
    })
    .catch(erro => console.error("Erro na requisição:", erro));
}

function cadastrar() {
  // aguardar();

  //Recupere o valor da nova input pelo nome do id
  // Agora vá para o método fetch logo abaixo
  var nomeVar = iptNome.value;
  var emailVar = iptEmail.value;
  var senhaVar = iptSenha.value;
  var confirmacaoSenhaVar = iptReSenha.value;
  var cpfVar = iptCpf.value;
  var nivelPermissaoVar = 1;
  var fkEmpresaVar = sessionStorage.ID_EMPRESA;
  // Verificando se há algum campo em branco
  if (
    nomeVar == "" ||
    emailVar == "" ||
    senhaVar == ""
  ) {
    cardErro.style.display = "block";
    mensagem_erro.innerHTML =
      "Preencha todos os campos";

    return false;
  } else if (nomeVar.length < 3) {
    cardErro.style.display = "block";
    mensagem_erro.innerHTML =
      "O nome deve ter ao menos 3 caracteres";

    return false;
  } else if (senhaVar.length < 6) {
    cardErro.style.display = "block";
    mensagem_erro.innerHTML =
      "A senha deve ter ao menos 6 caracteres";

    return false;
  } else if (senhaVar != confirmacaoSenhaVar) {
    cardErro.style.display = "block";
    mensagem_erro.innerHTML =
      "As senhas não coincidem";

    return false;
  } else {
    // setInterval(sumirMensagem, 5000);
  }

  // botao_cadastrar.innerHTML ='<img src="./assets/imgs/aguarde-orange.gif" width="25">';

  // Enviando o valor da nova input
  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // crie um atributo que recebe o valor recuperado aqui
      // Agora vá para o arquivo routes/usuario.js
      nomeServer: nomeVar,
      emailServer: emailVar,
      senhaServer: senhaVar,
      cpfServer: cpfVar,
      nivelPermissaoServer: nivelPermissaoVar,
      fkEmpresaServer: fkEmpresaVar
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        // cardErro.style.display = "block";

        // mensagem_erro.innerHTML =
        //     "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

        resposta.json().then(json => {
          console.log(json);
          console.log(JSON.stringify(json));
          let funcionarios = JSON.parse(sessionStorage.FUNCIONARIOS);
          funcionarios.push({ "id_usuario": json.insertId, "nome": nomeVar, "email": emailVar, "nivel_permissao": nivelPermissaoVar })
          sessionStorage.FUNCIONARIOS = JSON.stringify(funcionarios);
          window.location.reload()
          document.getElementById('geral_addUser').style.display = "none"
        });

        limparFormulario();

      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      // finalizarAguardar();
    });

  return false;
}