function entrar() {
  aguardar();

  var emailVar = email_input.value;
  var senhaVar = senha_input.value;

  if (emailVar == "" || senhaVar == "") {
    cardErro.style.display = "block"
    mensagem_erro.innerHTML = "Preencha todos os campos";
    setTimeout(function () {
      sumirMensagem();
    }, 4000);
    finalizarAguardar();
    return false;
  }
  else {
    setInterval(sumirMensagem, 5000)
  }

  console.log("FORM LOGIN: ", emailVar);
  console.log("FORM SENHA: ", senhaVar);

  // botao_cadastrar.innerHTML ='<img src="./assets/imgs/aguarde-orange.gif" width="25">';

  fetch("/usuarios/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailVar,
      senha: senhaVar
    })
  }).then(function (resposta) {
    console.log("ESTOU NO THEN DO entrar()!")

    if (resposta.ok) {
      console.log(resposta);

      resposta.json().then(json => {
        console.log(json);
        console.log(JSON.stringify(json));
        sessionStorage.EMAIL_USUARIO = json.dados.email;
        sessionStorage.NOME_USUARIO = json.dados.nome;
        sessionStorage.ID_USUARIO = json.dados.id;
        sessionStorage.ID_EMPRESA = json.dados.empresa;
        sessionStorage.FUNCIONARIOS = JSON.stringify(json.dados.funcionarios);
        window.location = "../app";
        setTimeout(function () {
          window.location = "../app";
        }, 1000); // apenas para exibir o loading

      });

    } else {

      console.log("Houve um erro ao tentar realizar o login!");
      cardErro.style.display = "block"
      mensagem_erro.innerHTML = "usuário não encontrado";
      setTimeout(function () {
        sumirMensagem();
      }, 4000);
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

function sumirMensagem() {
  cardErro.style.display = "none"
}