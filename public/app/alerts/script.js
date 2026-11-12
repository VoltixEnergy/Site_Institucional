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



function listaDeAlertas() {

    fetch(`/alerta/buscarAlertasPorEmpresa`, {
        method: "GET",
        credentials: "include",
    })
        .then(function (resposta) {
            return tratarResposta(resposta);
        })
        .then(function (resultado) {
            console.log("ALERTAS DA EMPRESA:", resultado);

            var lista = document.getElementById("listarAlertas");
            var alerta = resultado.data || [];

            alerta.sort(function (a, b) {
                return new Date(b.criado_em) - new Date(a.criado_em);
            });

            if (!lista) {
                console.log("Elemento listar não encontrado.");
                return;
            }

            

            lista.innerHTML = `
                <div class="user-list-header">
                    <span>ID</span>
                    <span>Servidor</span>
                    <span>Alerta</span>
                    <span>Data-hora</span>
                </div>
            `;

            if (alerta.length == 0) {
                lista.innerHTML += `
                    <div class="alert">
                        <p>Nenhum alerta encontrado.</p>
                    </div>
                `;
                return;
            }

            for (var i = 0; i < alerta.length; i++) {
                var item = alerta[i];
                var id = alerta.length - i;

                var servidor = item.servidor || "Servidor";
                var data = new Date(item.enviado_em).toLocaleString("pt-BR");

                var classe;

                if (item.prioridade == 3) {
                    classe = "alerta-vermelho";
                } else if (item.prioridade == 1){
                    classe = "alerta-azul";
                } else {
                    classe = "alerta-amarelo";
                }


                    lista.innerHTML += `
                    <div class="alert">
                        <p class="id">${String(id).padStart(2, '0')}</p>
                        <p class="servidor">${servidor}</p>
                        <p class="${classe}" >${item.descricao}</p>
                        <p class="data">${data}</p>
                    </div>
                `;
            }
            })
        
        .catch(function (erro) {
            console.log("Erro ao buscar alertas:", erro);
        });
}


document.getElementById("alerta01").style

