// TODO: substituir alerts por toasts
function loadCompanyName(){
  var companyName = sessionStorage.getItem("COMPANY_NAME")
  var companyNameElement = document.getElementById("companyName")

  companyNameElement.innerText = `@ ${companyName}`
}

async function tratarResposta(resposta) {
    const body = await resposta.json();

    if (!resposta.ok) {
        throw new Error(body.message || "Erro na requisição.");
    }

    return body;
}



function buscarUsuarios() {
    var idEmpresa = sessionStorage.ID_EMPRESA;

    console.log("ID da empresa:", idEmpresa);

    if (!idEmpresa) {
        console.log("Empresa não encontrada no sessionStorage.");
        return;
    }

    fetch(`/usuarios/buscarUsuarioPorEmpresa/${idEmpresa}`, {
        method: "GET"
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            console.log("USUÁRIOS DA EMPRESA:", resultado);

            var lista = document.getElementById("listarUsuarios");
            var usuarios = resultado.data || [];

            if (!lista) {
                console.log("Elemento listarUsuarios não encontrado.");
                return;
            }

            lista.innerHTML = `
                <div class="user-list-header">
                    <span>Nome</span>
                    <span>Cargo</span>
                    <span>Ações</span>
                </div>
            `;

            if (usuarios.length == 0) {
                lista.innerHTML += `
                    <div class="user">
                        <p>Nenhum usuário cadastrado.</p>
                    </div>
                `;
                return;
            }

            for (var i = 0; i < usuarios.length; i++) {
                var item = usuarios[i];

                var nomeCargo = "Usuário";

                if (item.cargo == 1) {
                    nomeCargo = "Gestor de TI";
                } else if (item.cargo == 2) {
                    nomeCargo = "Analista NOC";
                } 

                var primeiraLetra = item.nome.charAt(0).toUpperCase();
                var segundaLetra = "";

                if (item.nome.length > 1) {
                    segundaLetra = item.nome.charAt(1).toUpperCase();
                }

                lista.innerHTML += `
                    <div class="user">
                        <div class="infosUser">
                            <p id="userAvatar">${primeiraLetra}${segundaLetra}</p>
                            <div>
                                <p id="userName">${item.nome}</p>
                                <span>${item.email}</span>
                            </div>
                        </div>
                        <p id="userCargo" style="border: 1px solid white; padding: 0.5rem; border-radius: 1rem;">${nomeCargo}</p>
                        <button class="mudarNome" onclick="abrirEditor(${item.id})">
                            <img src="../../assets/imgs/edit.png">
                        </button>
                    </div>
                `;
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar usuários:", erro);
        });
}



function Pesquisar() {
    var nome = document.getElementById("input_pesquisa").value;
    var idUsuario = sessionStorage.ID_USUARIO;

    if (nome == "") {
        buscarUsuarios();
        return;
    }

    fetch(`/usuarios/pesquisar/${nome}?idUsuario=${idUsuario}`, {
        method: "GET"
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            var lista = document.getElementById("listarUsuarios");
            var usuarios = resultado.data || [];

            lista.innerHTML = `
                <div class="user-list-header">
                    <span>Nome</span>
                    <span>Cargo</span>
                    <span>Ações</span>
                </div>
            `;

            if (usuarios.length == 0) {
                lista.innerHTML += `
                    <div class="user">
                        <p>Nenhum usuário encontrado.</p>
                    </div>
                `;
                return;
            }

            for (var i = 0; i < usuarios.length; i++) {
                var item = usuarios[i];

                var nomeCargo = "Usuário";

                if (item.cargo == 1) {
                    nomeCargo = "Gerente de TI";
                } else if (item.cargo == 2) {
                    nomeCargo = "Analista NOC";
                } 

                var primeiraLetra = item.nome.charAt(0).toUpperCase();
                var segundaLetra = "";

                if (item.nome.length > 1) {
                    segundaLetra = item.nome.charAt(1).toUpperCase();
                }

                lista.innerHTML += `
                    <div class="user">
                        <div class="infosUser">
                            <p id="userAvatar">${primeiraLetra}${segundaLetra}</p>
                            <div>
                                <p id="userName">${item.nome}</p>
                                <span>${item.email}</span>
                            </div>
                        </div>
                        <p id="userCargo" style="border: 1px solid white; padding: 0.5rem; border-radius: 1rem;">${nomeCargo}</p>
                        <button class="mudarNome" onclick="abrirEditor(${item.id})">
                            <img src="../../assets/imgs/edit.png">
                        </button>
                    </div>
                `;
            }
        })
        .catch(function (erro) {
            console.log("Erro na pesquisa:", erro);
        });
}



var idUsuarioEditar = null;



function abrirEditor(id) {
    idUsuarioEditar = id;
    document.getElementById("geral_editor").style.display = "flex";
    document.getElementById("alterarNomeArea").style.display = "none";
    document.getElementById("alterarEmailArea").style.display = "none";
    document.getElementById("novoNome").value = "";
    document.getElementById("novoEmail").value = "";
}



function sairEditor() {
    document.getElementById("geral_editor").style.display = "none";
    idUsuarioEditar = null;
    document.getElementById("novoNome").value = "";
    document.getElementById("novoEmail").value = "";
    document.getElementById("alterarNomeArea").style.display = "none";
    document.getElementById("alterarEmailArea").style.display = "none";
}



function mostrarAlterarNome() {
    document.getElementById("alterarNomeArea").style.display = "flex";
    document.getElementById("alterarEmailArea").style.display = "none";
    document.getElementById("novoNome").value = "";
}



function mostrarAlterarEmail() {
    document.getElementById("alterarEmailArea").style.display = "flex";
    document.getElementById("alterarNomeArea").style.display = "none";
    document.getElementById("novoEmail").value = "";
}



function mudarNome() {
    var novoNomeInput = document.getElementById("novoNome");
    var novoNome = novoNomeInput.value.trim();

    if (novoNome == "") {
        alert("Digite um novo nome.");
        return;
    }

    if (novoNome.length < 3) {
        alert("O nome deve ter ao menos 3 caracteres.");
        return;
    }

    if (idUsuarioEditar == null) {
        alert("Nenhum usuário selecionado.");
        return;
    }

    editarNome(novoNome, idUsuarioEditar);
}



function editarNome(novoNome, idUsuario) {
    fetch(`/usuarios/editarNome/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            novoNome: novoNome
        })
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            alert(resultado.message || "Nome atualizado com sucesso!");
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert(erro.message || "Não foi possível atualizar o nome.");
        });
}



function mudarEmail() {
    var novoEmailInput = document.getElementById("novoEmail");
    var novoEmail = novoEmailInput.value.trim();

    if (novoEmail == "") {
        alert("Digite um novo e-mail.");
        return;
    }

    if (!novoEmail.includes("@")) {
        alert("Digite um e-mail válido.");
        return;
    }

    if (idUsuarioEditar == null) {
        alert("Nenhum usuário selecionado.");
        return;
    }

    editarEmail(novoEmail, idUsuarioEditar);
}



function editarEmail(novoEmail, idUsuario) {
    fetch(`/usuarios/atualizar/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: novoEmail
        })
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            alert(resultado.message || "E-mail atualizado com sucesso!");
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert(erro.message || "Não foi possível atualizar o e-mail.");
        });
}



function deletarUsuario() {
    var idUsuario = idUsuarioEditar;

    if (idUsuario == null) {
        alert("Nenhum usuário selecionado!");
        return;
    }

    if (!confirm("Deseja realmente excluir este usuário?")) {
        return;
    }

    fetch(`/usuarios/deletarUsuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            alert(resultado.message || "Conta deletada com sucesso!");
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro na requisição:", erro);
            alert(erro.message || "Erro ao deletar usuário.");
        });
}


function sairAddUser() {
    document.getElementById("geral_addUser").style.display = "none";
}



function cadastrar() {
    var nomeVar = document.getElementById("iptNome").value;
    var emailVar = document.getElementById("iptEmail").value;
    var senhaVar = document.getElementById("iptSenha").value;
    var confirmacaoSenhaVar = document.getElementById("iptReSenha").value;
    var cargoVar = document.getElementById("iptNivelPermissao").value;
    var empresaIdVar = sessionStorage.ID_EMPRESA;

    if (nomeVar == "" || emailVar == "" || senhaVar == "") {
        alert("Preencha todos os campos.");
        return false;
    }

    if (nomeVar.length < 3) {
        alert("O nome deve ter ao menos 3 caracteres.");
        return false;
    }

    if (senhaVar.length < 6) {
        alert("A senha deve ter ao menos 6 caracteres.");
        return false;
    }

    if (senhaVar != confirmacaoSenhaVar) {
        alert("As senhas não coincidem.");
        return false;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nomeVar,
            email: emailVar,
            senha: senhaVar,
            cargo: cargoVar,
            empresaId: empresaIdVar
        })
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            console.log("Usuário cadastrado:", resultado);
            alert(resultado.message || "Usuário cadastrado com sucesso!");
            document.getElementById("iptNome").value = "";
            document.getElementById("iptEmail").value = "";
            document.getElementById("iptSenha").value = "";
            document.getElementById("iptReSenha").value = "";
            sairAddUser();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro no cadastro:", erro);
            alert(erro.message || "Não foi possível cadastrar o usuário.");
        });

    return false;
}