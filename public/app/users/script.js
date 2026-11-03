function tipoToastPorStatus(status) {
    if (status >= 200 && status < 300) return "success";
    if (status >= 400 && status < 500) return "warning";
    return "error";
}

async function tratarResposta(resposta) {
    var body = {};

    try {
        body = await resposta.json();
    } catch (e) {
        body = {};
    }

    if (!resposta.ok) {
        var erro = new Error(body.message || "Erro na requisição.");
        erro.status = resposta.status;
        throw erro;
    }

    return { ...body, status: resposta.status };
}



function buscarUsuarios() {

    fetch(`/usuarios/buscarUsuarioPorEmpresa`, {
        method: "GET",
        credentials: "include",
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
                            <p id="userAvatar" class="userAvatar">${primeiraLetra}${segundaLetra}</p>
                            <div>
                                <p id="userName" class="userName">${item.nome}</p>
                                <span class="userEmail">${item.email}</span>
                            </div>
                        </div>
                        <p id="userCargo" class="userCargo" style="border: 1px solid white; padding: 0.5rem; border-radius: 1rem;">${nomeCargo}</p>
                        <button class="mudarNome" onclick="abrirEditor('${item.id}')">
                            <i class="ph-bold ph-dots-three-vertical"></i>
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

    if (nome == "") {
        buscarUsuarios();
        return;
    }

    fetch(`/usuarios/pesquisar/${nome}`, {
        method: "GET",
        credentials: "include",
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
                            <p id="userAvatar" class="userAvatar">${primeiraLetra}${segundaLetra}</p>
                            <div>
                                <p id="userName" class="userName">${item.nome}</p>
                                <span class="userEmail">${item.email}</span>
                            </div>
                        </div>
                        <p id="userCargo" class="userCargo" style="border: 1px solid white; padding: 0.5rem; border-radius: 1rem;">${nomeCargo}</p>
                        <button class="mudarNome" onclick="abrirEditor('${item.id}')">
                            <i class="ph-bold ph-dots-three-vertical"></i>
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
    document.getElementById("alterarCargoArea").style.display = "none";
    document.getElementById("novoNome").value = "";
}



function mostrarAlterarEmail() {
    document.getElementById("alterarEmailArea").style.display = "flex";
    document.getElementById("alterarNomeArea").style.display = "none";
    document.getElementById("alterarCargoArea").style.display = "none";
    document.getElementById("novoEmail").value = "";
}


function mostrarAlterarCargo() {
    document.getElementById("alterarCargoArea").style.display = "flex";
    document.getElementById("alterarEmailArea").style.display = "none";
    document.getElementById("alterarNomeArea").style.display = "none";
    document.getElementById("novoCargo").value = "";
}



function mudarNome() {
    var novoNomeInput = document.getElementById("novoNome");
    var novoNome = novoNomeInput.value.trim();

    if (novoNome == "") {
        showToast("Digite um novo nome.", "warning");
        return;
    }

    if (novoNome.length < 3) {
        showToast("O nome deve ter ao menos 3 caracteres.", "warning");
        return;
    }

    if (idUsuarioEditar == null) {
        showToast("Nenhum usuário selecionado.", "warning");
        return;
    }

    editarNome(novoNome, idUsuarioEditar);
}


function editarNome(novoNome, idUsuario) {
    fetch(`/usuarios/editarNome/${idUsuario}`, {
        method: "PUT",
        credentials: "include",
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
            showToast(
                resultado.message || "Nome atualizado com sucesso!",
                tipoToastPorStatus(resultado.status)
            );
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            showToast(
                erro.message || "Não foi possível atualizar o nome.",
                tipoToastPorStatus(erro.status)
            );
        });
}


function mudarCargo() {
    var novoCargoInput = document.getElementById("novoCargo");
    var novoCargo = novoCargoInput.value.trim();

    if (novoCargo == "") {
        showToast("Digite um novo cargo.", "warning");
        return;
    }

    if (idUsuarioEditar == null) {
        showToast("Nenhum usuário selecionado.", "warning");
        return;
    }

    editarCargo(novoCargo, idUsuarioEditar);
}


function editarCargo(novoCargo, idUsuario) {
    fetch(`/usuarios/editarCargo/${idUsuario}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cargo: novoCargo
        })
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            showToast(
                resultado.message || "Cargo atualizado com sucesso!",
                tipoToastPorStatus(resultado.status)
            );
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            showToast(
                erro.message || "Não foi possível atualizar o cargo.",
                tipoToastPorStatus(erro.status)
            );
        });
}


function mudarEmail() {
    var novoEmailInput = document.getElementById("novoEmail");
    var novoEmail = novoEmailInput.value.trim();

    if (novoEmail == "") {
        showToast("Digite um novo e-mail.", "warning");
        return;
    }

    if (!novoEmail.includes("@")) {
        showToast("Digite um e-mail válido.", "warning");
        return;
    }

    if (idUsuarioEditar == null) {
        showToast("Nenhum usuário selecionado.", "warning");
        return;
    }

    editarEmail(novoEmail, idUsuarioEditar);
}



function editarEmail(novoEmail, idUsuario) {
    fetch(`/usuarios/editarEmail/${idUsuario}`, {
        method: "PUT",
        credentials: "include",
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
            showToast(
                resultado.message || "E-mail atualizado com sucesso!",
                tipoToastPorStatus(resultado.status)
            );
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            showToast(
                erro.message || "Não foi possível atualizar o e-mail.",
                tipoToastPorStatus(erro.status)
            );
        });
}



function deletarUsuario() {
    var idUsuario = idUsuarioEditar;

    if (idUsuario == null) {
        showToast("Nenhum usuário selecionado!", "warning");
        return;
    }

    if (!confirm("Deseja realmente excluir este usuário?")) {
        return;
    }

    fetch(`/usuarios/deletarUsuario/${idUsuario}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            showToast(
                resultado.message || "Conta deletada com sucesso!",
                tipoToastPorStatus(resultado.status)
            );
            sairEditor();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro na requisição:", erro);
            showToast(
                erro.message || "Erro ao deletar usuário.",
                tipoToastPorStatus(erro.status)
            );
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
        showToast("Preencha todos os campos.", "warning");
        return false;
    }

    if (nomeVar.length < 3) {
        showToast("O nome deve ter ao menos 3 caracteres.", "warning");
        return false;
    }

    if (senhaVar.length < 6) {
        showToast("A senha deve ter ao menos 6 caracteres.", "warning");
        return false;
    }

    if (senhaVar != confirmacaoSenhaVar) {
        showToast("As senhas não coincidem.", "warning");
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
            showToast(
                resultado.message || "Usuário cadastrado com sucesso!",
                tipoToastPorStatus(resultado.status)
            );
            document.getElementById("iptNome").value = "";
            document.getElementById("iptEmail").value = "";
            document.getElementById("iptSenha").value = "";
            document.getElementById("iptReSenha").value = "";
            sairAddUser();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro no cadastro:", erro);
            showToast(
                erro.message || "Não foi possível cadastrar o usuário.",
                tipoToastPorStatus(erro.status)
            );
        });

    return false;
}