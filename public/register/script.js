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
    showToast("Preencha todos os campos", "error");
    return false;
  } else if (nomeVar.length < 3) {
    showToast("O nome deve ter ao menos 3 caracteres", "error");
    return false;
  } else if (senhaVar.length < 6) {
    showToast("A senha deve ter ao menos 6 caracteres", "error");
    return false;
  } else if (senhaVar != confirmacaoSenhaVar) {
    showToast("As senhas não coincidem", "error");
    return false;
  } else if (codigoAtivacaoVar.length !== 6) {
    showToast("O código de ativação deve ter 6 caracteres", "error");
    return false;
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
        showToast("Cadastro realizado com sucesso! Redirecionando para tela de Login...", "success");

        setTimeout(() => {
          window.location = "../login";
        }, 2000);

        limparFormulario();
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      showToast("Houve um erro ao tentar realizar o cadastro!", "error");
    });

  return false;
}

function sumirMensagem() {
  cardErro.style.display = "none";
}