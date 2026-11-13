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



var alerta = [];

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

            alerta = resultado.data || [];


            // exemplo: limite de 6 meses
            // var dataLimite = new Date();
            // dataLimite.setMonth(dataLimite.getMonth() - 6);


            // alerta = alerta.filter(function (item) {
            //     var dataAlerta = new Date(item.enviado_em);
            //     return dataAlerta >= dataLimite;
            // });


            alerta.sort(function (a, b) {
                return new Date(b.enviado_em) - new Date(a.enviado_em);
            });

            adicionarFiltro();

        })
        .catch(function (erro) {
            console.log("Erro ao buscar alertas:", erro);
        });
}



function adicionarFiltro() {

    var filtro = document.getElementById("filter").value;
    var alertasFiltrados = alerta;

    if (filtro === "todos") {
        alertasFiltrados = alerta;

    } else if (filtro === "ram" || filtro === "cpu" || filtro === "disco" || filtro === "rede" || filtro === "perdas" || filtro === "er"){
         alertasFiltrados = alerta.filter(function (item) {
        return String(item.tipo).toLowerCase() === filtro;
        });

    } else {
        alertasFiltrados = alerta.filter(function (item) {
            return String(item.prioridade) === filtro;
        });
    }

         listaDeAlertasFiltrados(alertasFiltrados);

    }

   


function listaDeAlertasFiltrados(alertas) {

    var lista = document.getElementById("listarAlertas");

    if (!lista) {
        console.log("Elemento listar não encontrado.");
        return;
    }


    lista.innerHTML = "";

    
    if (alertas.length === 0) {
        lista.innerHTML += `
            <div class="mensagem-sem-alertas">
                <p>Nenhum alerta encontrado para esse filtro.</p>
            </div>
        `;
        return;
    }


    for (var i = 0; i < alertas.length; i++) {
        var item = alertas[i];
        var id = String(alertas.length - i).padStart(2, '0');
        var servidor = item.servidor || "Servidor";
        var data = new Date(item.enviado_em).toLocaleString("pt-BR");

        var classe;

        if (item.prioridade == 3) {
            classe = "alerta-vermelho";
        } else if (item.prioridade == 1) {
            classe = "alerta-azul";
        } else {
            classe = "alerta-amarelo";
        }

        lista.innerHTML += `
            <div class="alert">
                <p class="id">${id}</p>
                <p class="servidor">${servidor}</p>
                <p class="${classe}">${item.descricao}</p>
                <p class="data">${data}</p>
            </div>
        `;
    }
}




