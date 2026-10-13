function cadastrar() {
  // aguardar();

  //Recupere o valor da nova input pelo nome do id
  // Agora vá para o método fetch logo abaixo
  var nomeVar = nome_input.value;
  var emailVar = email_input.value;
  var senhaVar = senha_input.value;
  var confirmacaoSenhaVar = confirmacao_senha_input.value;
  var codigoAtivacaoVar = codigo_ativacao_input.value;
  // Verificando se há algum campo em branco
  if (
    nomeVar == "" ||
    emailVar == "" ||
    senhaVar == "" ||
    codigoAtivacaoVar == ""
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
  } else if (codigoAtivacaoVar.length !== 6) {
    cardErro.style.display = "block";
    mensagem_erro.innerHTML =
      "O código de ativação deve ter 6 caracteres";

    return false;
  }else {
    setInterval(sumirMensagem, 5000);
  }

  botao_cadastrar.innerHTML = '<img src="../assets/imgs/aguarde-orange.gif" width="25">';
  // Enviando o valor da nova input
  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // crie um atributo que recebe o valor recuperado aqui
      // Agora vá para o arquivo routes/usuario.js
      nome: nomeVar,
      email: emailVar,
      senha: senhaVar,
      codigo: codigoAtivacaoVar,
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        cardErro.style.display = "block";

        mensagem_erro.innerHTML =
          "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

        setTimeout(() => {
          window.location = "../login";
        }, "2000");

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

function sumirMensagem() {
  cardErro.style.display = "none";
}