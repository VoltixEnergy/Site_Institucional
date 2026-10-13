async function entrar() {

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

    try {

        const resposta = await fetch("/usuarios/autenticar", {

            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: emailVar,
                password: senhaVar
            })

        });

        console.log("ESTOU NO THEN DO entrar()!");

        if (resposta.ok) {

            console.log("Login realizado com sucesso!");

            const json = await resposta.json();

            console.log(json);
            sessionStorage.EMAIL_USUARIO = json.data.email;
            sessionStorage.NOME_USUARIO = json.data.nome;
            sessionStorage.ID_USUARIO = json.data.id;
            sessionStorage.ID_EMPRESA = json.data.empresa;
            sessionStorage.FUNCIONARIOS = JSON.stringify(json.data.funcionarios);
            window.location = "../app";

        } else {

            console.log("Houve um erro ao tentar realizar o login!");

            cardErro.style.display = "block";
            mensagem_erro.innerHTML = "E-mail ou senha inválidos";

            setTimeout(function () {
                sumirMensagem();
            }, 4000);

            const texto = await resposta.text();

            console.error(texto);

            finalizarAguardar(texto);
        }

    } catch (erro) {

        console.log("Erro no login:", erro);

        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Erro ao conectar com o servidor";

        setTimeout(function () {
            sumirMensagem();
        }, 4000);

        finalizarAguardar();

    }

    return false;
}


function sumirMensagem() {

    cardErro.style.display = "none";

}