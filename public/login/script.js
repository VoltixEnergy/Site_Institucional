async function entrar() {

    aguardar();

    var emailVar = email_input.value;
    var senhaVar = senha_input.value;

    if (emailVar == "" || senhaVar == "") {

        showToast("Preencha todos os campos", "error");

        finalizarAguardar();
        return false;

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
            sessionStorage.COMPANY_NAME = json.data.nome_fantasia;
            sessionStorage.FUNCIONARIOS = JSON.stringify(json.data.funcionarios);
            window.location = "../app";

            } else {

                console.log("Houve um erro ao tentar realizar o login!");

                showToast("E-mail ou senha inválidos", "error");

                const texto = await resposta.text();

                console.error(texto);

                finalizarAguardar(texto);
            }

    } catch (erro) {

        console.log("Erro no login:", erro);

        showToast("Erro ao conectar com o servidor", "error");

        finalizarAguardar();

    }

    return false;
}

