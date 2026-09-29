function entrar() {

    aguardar();

    var emailVar = email_input.value;
    var senhaVar = senha_input.value;

    if (emailVar == "" || senhaVar == "") {

        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos";

        setTimeout(function () {
            sumirMensagem();
        }, 4000);

        finalizarAguardar();
        return false;

    } else {

        setInterval(sumirMensagem, 5000);
    }

    console.log("FORM LOGIN:", emailVar);
    console.log("FORM SENHA:", senhaVar);

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

        console.log("ESTOU NO THEN DO entrar()!");

        if (resposta.ok) {

            console.log("Login realizado com sucesso!");

            resposta.json().then(function (json) {

                console.log(json);

                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.id;
                sessionStorage.ID_EMPRESA = json.empresa;
                sessionStorage.FUNCIONARIOS = JSON.stringify(json.funcionarios);

                window.location = "../app";

            });

        } else {

            console.log("Houve um erro ao tentar realizar o login!");

            cardErro.style.display = "block";
            mensagem_erro.innerHTML = "E-mail ou senha inválidos";

            setTimeout(function () {
                sumirMensagem();
            }, 4000);

            resposta.text().then(function (texto) {

                console.error(texto);

                finalizarAguardar(texto);

            });
        }

    }).catch(function (erro) {

        console.log("Erro no login:", erro);

        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Erro ao conectar com o servidor";

        setTimeout(function () {
            sumirMensagem();
        }, 4000);

        finalizarAguardar();

    });

    return false;
}


function sumirMensagem() {

    cardErro.style.display = "none";

}