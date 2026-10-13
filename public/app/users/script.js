function loadCompanyName(){
  var companyName = sessionStorage.getItem("COMPANY_NAME")
  var companyNameElement = document.getElementById("companyName")

  companyNameElement.innerText = `@ ${companyName}`
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
        .then(function (usuarios) {
            console.log("USUÁRIOS DA EMPRESA:", usuarios);

            var lista = document.getElementById("listarUsuarios");

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
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro ao pesquisar usuários.");
            }
        })
        .then(function (usuarios) {
            var lista = document.getElementById("listarUsuarios");

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
            if (resposta.ok) {
                alert("Nome atualizado com sucesso!");
                sairEditor();
                buscarUsuarios();
            } else {
                return resposta.text().then(function (texto) {
                    console.error(texto);
                    throw new Error("Erro ao atualizar nome.");
                });
            }
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert("Não foi possível atualizar o nome.");
        });
}


function mudarCargo() {
    var novoCargoInput = document.getElementById("novoCargo");
    var novoCargo = novoCargoInput.value.trim();

    if (novoCargo == "") {
        alert("Digite um novo cargo.");
        return;
    }

    if (idUsuarioEditar == null) {
        alert("Nenhum usuário selecionado.");
        return;
    }

    editarCargo(novoCargo, idUsuarioEditar);
}


function editarCargo(novoCargo, idUsuario) {
    fetch(`/usuarios/editarCargo/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cargo: novoCargo
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("Cargo atualizado com sucesso!");
                sairEditor();
                buscarUsuarios();
            } else {
                return resposta.text().then(function (texto) {
                    console.error(texto);
                    throw new Error("Erro ao atualizar cargo.");
                });
            }
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert("Não foi possível atualizar o cargo.");
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
    fetch(`/usuarios/editarEmail/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: novoEmail
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("E-mail atualizado com sucesso!");
                sairEditor();
                buscarUsuarios();
            } else {
                return resposta.text().then(function (texto) {
                    console.error(texto);
                    throw new Error("Erro ao atualizar e-mail.");
                });
            }
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert("Não foi possível atualizar o e-mail.");
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
            if (resposta.ok) {
                alert("Conta deletada com sucesso!");
                sairEditor();
                buscarUsuarios();
            } else {
                return resposta.text().then(function (texto) {
                    console.error(texto);
                    alert("Erro ao deletar usuário.");
                });
            }
        })
        .catch(function (erro) {
            console.log("Erro na requisição:", erro);
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
            console.log("Resposta cadastro:", resposta);

            if (resposta.ok) {
                return resposta.json();
            } else {
                return resposta.text().then(function (texto) {
                    console.error(texto);
                    throw new Error("Erro ao cadastrar usuário.");
                });
            }
        })
        .then(function (resultado) {
            console.log("Usuário cadastrado:", resultado);
            alert("Usuário cadastrado com sucesso!");
            document.getElementById("iptNome").value = "";
            document.getElementById("iptEmail").value = "";
            document.getElementById("iptSenha").value = "";
            document.getElementById("iptReSenha").value = "";
            sairAddUser();
            buscarUsuarios();
        })
        .catch(function (erro) {
            console.log("Erro no cadastro:", erro);
            alert("Não foi possível cadastrar o usuário.");
        });

    return false;
}