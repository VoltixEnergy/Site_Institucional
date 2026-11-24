const URL_API = "http://localhost:3333";

const S3_URL = "https://voltix-s3-bucket-gold.s3.us-east-1.amazonaws.com";
const ID_EMPRESA = sessionStorage.getItem("ID_EMPRESA");
const URL_DASHBOARD = `${S3_URL}/gold/${ID_EMPRESA}.json`;

const URL_SERVIDORES =`${URL_API}/nocDashboard/buscarserverPorEmpresa/${encodeURIComponent(ID_EMPRESA)}`;
const URL_ALERTAS_API = `${URL_API}/nocDashboard/buscarAlertasPorEmpresa`;



function tipoToastPorStatus(status) {
    if (status >= 200 && status < 300) return "success";
    if (status >= 400 && status < 500) return "warning";
    return "error";
}

async function tratarResposta(resposta) {
    const texto = await resposta.text();
    console.log("TEXTO EM JSON: "+ texto);

    let body = {};

    try {
        body = texto ? JSON.parse(texto) : {};
    } catch (erro) {
        throw new Error("O arquivo recebido não contém um JSON válido.");
    }

    if (!resposta.ok) {
        const erro = new Error(
            body.message ||
            body.Message ||
            `Erro ao acessar o S3: HTTP ${resposta.status}`
        );

        erro.status = resposta.status;
        throw erro;
    }

    return {
        ...body,
        status: resposta.status
    };
}



var servidores = [];
var alertas = [];
var dadosDashboard = null;

var filtroServidorAtual = "todos";
var filtroAlertaAtual = "todos";



async function buscarDados(url) {
    const resposta = await fetch(url, {
        method: "GET",
        cache: "no-store"
    });

    return await tratarResposta(resposta);
}


function normalizarMac(mac) {
    if (!mac) return "";

    return String(mac)
        .replace(/[^a-fA-F0-9]/g, "")
        .toUpperCase();
}


async function buscarServidoresCadastrados() {
    const token = sessionStorage.getItem("TOKEN");

    const resposta = await fetch(URL_SERVIDORES, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    });

    if (!resposta.ok) {
        throw new Error("Erro ao buscar servidores cadastrados.");
    }

    const dados = await resposta.json();

    return Array.isArray(dados) ? dados : dados.data || [];
}



async function buscarLimitesServidor(id) {
    const token = sessionStorage.getItem("TOKEN");

    const resposta = await fetch(
        `${URL_API}/server/dados-instancia/${id}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        }
    );

    if (!resposta.ok) {
        throw new Error("Erro ao buscar limites do servidor.");
    }

    const dados = await resposta.json();

    return dados.data || [];
}



function relacionarNomesServidores(instancias, cadastrados) {
    return instancias.map(function (instancia) {

        const servidorCadastrado = cadastrados.find(function (servidor) {
            return normalizarMac(servidor.endereco_mac) ===
                   normalizarMac(instancia.mac_address || instancia.name);
        });

        return {
            ...instancia,

            id: servidorCadastrado ? servidorCadastrado.id : null,

            mac_address: instancia.mac_address || instancia.name,

            name: servidorCadastrado
                ? servidorCadastrado.nome
                : instancia.name,

            limites: []
        };
    });
}


function obterNomeServidor(servidor) {
    return servidor.name || "Servidor sem nome";
}


function obterStatusServidor(servidor) {
    return servidor.isActive ? "ativo" : "inativo";
}



function obterNomeServidorAlerta(alerta) {

    const servidor = servidores.find(function (item) {
        return (
            item.id === alerta.instancia_id ||
            normalizarMac(item.mac_address) ===
            normalizarMac(alerta.mac_address)
        );
    });

    return servidor
        ? servidor.name
        : alerta.server_name || "Servidor";
}



function servidorTemAlerta(servidor) {
    return alertas.some(function (alerta) {
        return obterNomeServidorAlerta(alerta) === servidor.name;
    });
}



function atualizarKPIs(kpis) {
    if (!kpis) return;

    
    const totalServidores = servidores.length;

    
    const servidoresAtivos = servidores.filter(function (servidor) {
        return servidor.isActive;
    }).length;

    
    const servidoresEmAlerta = servidores.filter(function (servidor) {
        return servidorTemAlerta(servidor);
    }).length;

    
    document.getElementById("kpiServidoresAtivos").textContent =
        `${servidoresAtivos}/${totalServidores} total`;

    
    document.getElementById("kpiServidoresAlertas").textContent =
    servidoresAtivos == 0
        ? "0/0 ativos"
        : `${servidoresEmAlerta}/${servidoresAtivos} ativos`;


    const servidorMenorEficiencia = servidores.find(function (servidor) {
        return normalizarMac(servidor.mac_address) === normalizarMac(kpis.server_efficiency);
    });

    document.getElementById("kpiMenorEficiencia").textContent =
        servidorMenorEficiencia
            ? servidorMenorEficiencia.name
            : kpis.server_efficiency ?? "-";

    document.getElementById("kpiMaiorTemperatura").textContent =
        server_termometro
            ? server_termometro.name
            : kpis.server_termometro ?? "-";
}


async function services() {
    try {
        if (!ID_EMPRESA) {
            throw new Error("ID da empresa não encontrado na sessão.");
        }

        const [dados, servidoresCadastrados] = await Promise.all([
            buscarDados(URL_DASHBOARD),
            buscarServidoresCadastrados()
        ]);

        dadosDashboard = dados.dashboard;

        if (!dadosDashboard) {
            throw new Error(
                "Estrutura do dashboard não encontrada no JSON."
            );
        }

        const servidoresRelacionados = relacionarNomesServidores(
    dadosDashboard.instances || [],
    servidoresCadastrados
);

servidores = await Promise.all(
    servidoresRelacionados.map(async function (servidor) {

        if (!servidor.id) {
            return servidor;
        }

        try {
            const limites = await buscarLimitesServidor(servidor.id);

            return {
                ...servidor,
                limites: limites
            };

        } catch (erro) {
            console.error(
                `Erro ao buscar limites de ${servidor.name}:`,
                erro
            );

            return servidor;
        }
    })
);

        listarServidores();
        carregarFiltroAlertas(servidores);
        listarAlertas();

    } catch (erro) {
        console.error("Erro ao carregar servidores:", erro);
    }
}



function listarServidores() {
    var lista = document.getElementById("listaServidores");

    if (!lista) return;

    var campoPesquisa = document.getElementById("input_pesquisa");
    var pesquisa = campoPesquisa ? campoPesquisa.value : "";
    var servidoresFiltrados = servidores.filter(function (servidor) {

        var nome = obterNomeServidor(servidor);

        var correspondePesquisa = nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase());

        var correspondeFiltro = true;

        if (filtroServidorAtual === "ativos") {
            correspondeFiltro =
                obterStatusServidor(servidor) === "ativo";

        } else if (filtroServidorAtual === "inativos") {
            correspondeFiltro =
                obterStatusServidor(servidor) === "inativo";

        } else if (filtroServidorAtual === "alertas") {
            correspondeFiltro = servidorTemAlerta(servidor);
        }

        return correspondePesquisa && correspondeFiltro;
    });

    lista.innerHTML = "";

    if (servidoresFiltrados.length === 0) {
        lista.innerHTML = "<p>Nenhum servidor encontrado.</p>";
        return;
    }

    servidoresFiltrados.forEach(function (servidor) {
        lista.innerHTML += criarComponente(servidor);
    });
}



function criarComponente(servidor) {
    var nome = servidor.name;
    var ativo = servidor.isActive;

    var classeStatus = ativo
        ? "button-add-status"
        : "button-add-status-inativo";

    var classeNome = ativo
        ? "nome-ativo"
        : "nome-inativo";

    var classeDados = ativo
        ? "server-dados"
        : "server-dados-inativo";

    


    var statusTexto = ativo ? "Ativo" : "Inativo";

    var cpu = servidor.cpu_percent;
    var ram = servidor.ram_percent;
    var disco = servidor.disk_percent;

    var enviado = servidor.network_sent;
    var recebido = servidor.network_received;
    var perdido = servidor.package_drop;

    var classeCpu = classificarMetrica(cpu, servidor, ["cpu"]);
    var classeRam = classificarMetrica(ram, servidor, ["ram"]);
    var classeDisco = classificarMetrica(disco, servidor, ["disco"]);
    var ClasseEnviado = classificarMetrica(enviado, servidor, ["enviado"]);
    var ClasseRecebido = classificarMetrica(recebido, servidor, ["recebido"]);
    var ClassePerdido = classificarMetrica(perdido, servidor, ["perdido"]);

    return `
        <div class="box">

            <div class="status-box">
                <span class="${classeStatus}"></span>
                <span>${statusTexto}</span>

                <a href="../caminho/pagina/especifica?id=${servidor.id}"
                class="${classeNome}">
                    ${nome}
                </a>

            </div>

            <div class="${classeDados}">

                <div class="ordem">
                    <span>CPU</span>
                    <span class="${classeCpu}">${cpu}%</span>
                </div>

                <div class="ordem">
                    <span>RAM</span>
                    <span class="${classeRam}">${ram}%</span>
                </div>

                <div class="ordem">
                    <span>Disco</span>
                    <span class="${classeDisco}">${disco}%</span>
                </div>

                <div class="ordem">
                    <span>Enviado</span>
                    <span class="${ClasseEnviado}">${enviado} MB</span>
                </div>

                <div class="ordem">
                    <span>Recebido</span>
                    <span class="${ClasseRecebido}">${recebido} MB</span>
                </div>

                <div class="ordem">
                    <span>Perdido</span>
                    <span class="${ClassePerdido}">${perdido}</span>
                </div>

            </div>

        </div>
    `;
}



function classificarMetrica(valor, servidor, componentes) {
    const valorNumerico = Number(valor);

    if (!Number.isFinite(valorNumerico)) {
        return "";
    }

    const limite = servidor.limites.find(function (item) {
        const nomeComponente = item.componente
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        return componentes.includes(nomeComponente);
    });

    if (!limite) {
        return "";
    }

    const minimo = Number(limite.min);
    const maximo = Number(limite.max);

    if (!Number.isFinite(minimo) || !Number.isFinite(maximo)) {
        return "";
    }

    if (valorNumerico < minimo) {
        return "metrica-baixa";
    }

    if (valorNumerico > maximo) {
        return "metrica-perigo";
    }

    if (valorNumerico >= maximo * 0.8) {
        return "metrica-alerta";
    }

    return "metrica-ideal";
}



function adicionarFiltroServidor() {
    filtroServidorAtual =
        document.getElementById("filtroServidores").value;

    listarServidores();
}


function Pesquisar() {
    listarServidores();
}



function carregarFiltroAlertas(listaServidores) {
    var filtro = document.getElementById("filtroAlertas");

    if (!filtro) return;

    var valorSelecionado = filtro.value;

    filtro.innerHTML = `
        <option value="todos">Todos os Alertas</option>
    `;

    var nomesAdicionados = [];

    listaServidores.forEach(function (servidor) {

        var nome = obterNomeServidor(servidor);

        if (
            nome !== "Servidor sem nome" &&
            !nomesAdicionados.includes(nome)
        ) {
            nomesAdicionados.push(nome);

            var opcao = document.createElement("option");

            opcao.value = nome;
            opcao.textContent = nome;

            filtro.appendChild(opcao);
        }
    });

    var opcaoAindaExiste = Array.from(filtro.options).some(
        function (opcao) {
            return opcao.value === valorSelecionado;
        }
    );

    filtro.value = opcaoAindaExiste
        ? valorSelecionado
        : "todos";

    filtroAlertaAtual = filtro.value;
}






async function alerts() {
    try {
        if (!ID_EMPRESA) {
            throw new Error("ID da empresa não encontrado na sessão.");
        }

        const token = sessionStorage.getItem("TOKEN");

        const resposta = await fetch(URL_ALERTAS_API, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error("Resposta da API:", erro);
            throw new Error(`Erro ao buscar alertas: HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log("Resposta completa da API:", dados);

        let listaAlertas = [];

        if (Array.isArray(dados)) listaAlertas = dados;
        else if (Array.isArray(dados.data)) listaAlertas = dados.data;
        else if (Array.isArray(dados.alertas)) listaAlertas = dados.alertas;
        else if (Array.isArray(dados.resultado)) listaAlertas = dados.resultado;

        alertas = listaAlertas.map(function (alerta) {
            return {
                ...alerta,
                title: alerta.title || alerta.tipo || "Alerta",
                description: alerta.description || alerta.descricao || "",
                server_name: alerta.server_name || ""
            };
        });

        console.log("Alertas carregados:", alertas);

        listarAlertas();
        listarServidores();

    } catch (erro) {
        console.error("Erro ao carregar alertas:", erro);
        alertas = [];
        listarAlertas();
        listarServidores();
    }
}





function listarAlertas() {
    var lista = document.getElementById("listaAlertas");

    if (!lista) return;

    var alertasFiltrados = alertas.filter(function (alerta) {

        var nomeServidor = obterNomeServidorAlerta(alerta);

        return (
            filtroAlertaAtual === "todos" ||
            nomeServidor === filtroAlertaAtual
        );
    });

    lista.innerHTML = "";

    if (alertasFiltrados.length === 0) {
        lista.innerHTML = "<p>Nenhum alerta hoje.</p>";
        return;
    }

    alertasFiltrados.forEach(function (alerta) {
        lista.innerHTML += criarComponenteAlerta(alerta);
    });
}




function criarComponenteAlerta(alerta) {
    var nomeServidor = obterNomeServidorAlerta(alerta);

    var tipo = alerta.tipo || "Alerta";

    var descricao = alerta.descricao || alerta.description || "";

    var prioridade = Number(alerta.prioridade);

    // Define a cor conforme a prioridade recebida do banco
    var classeAlerta = "";

    if (prioridade === 1) {
        classeAlerta = "alert-dados-azul";

    } else if (prioridade === 2) {
        classeAlerta = "alert-dados-amarelo";

    } else if (prioridade === 3) {
        classeAlerta = "alert-dados";

    } else {
        classeAlerta = "alert-dados";
    }

    var dataEnviada = alerta.enviado_em;

    var dataFormatada = "Data não informada";

    if (dataEnviada) {
        dataFormatada = new Date(dataEnviada).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    return `
        <div class="${classeAlerta}">

            <div class="dados-alertas">

                <span>${nomeServidor}</span>

                <span>${tipo}</span>

            </div>

            <p>${descricao}</p>

            <p>${dataFormatada}</p>

        </div>
    `;
}




function adicionarFiltroAlertas() {
    filtroAlertaAtual =
        document.getElementById("filtroAlertas").value;

    listarAlertas();
}



function atualizarData() {
    var elemento = document.querySelector(".data");

    if (!elemento) return;

    var agora = new Date();

    elemento.innerHTML = `
        <p>
            Última atualização:

            ${agora.toLocaleDateString("pt-BR")}

            ${agora.toLocaleTimeString("pt-BR")}
        </p>
    `;
}




var atualizacaoEmAndamento = false;

async function carregarDashboard() {

    if (atualizacaoEmAndamento) return;

    atualizacaoEmAndamento = true;

    try {
        if (!ID_EMPRESA) {
            console.error(
                "ID da empresa não encontrado na sessão."
            );

            return;
        }

        await Promise.all([
            services(),
            alerts()
        ]);

        if (dadosDashboard) {
            atualizarKPIs(dadosDashboard.kpis);
        }

        atualizarData();

        console.log("Dashboard atualizado com sucesso!");

    } catch (erro) {
        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    } finally {
        atualizacaoEmAndamento = false;
    }
}


carregarDashboard();
setInterval(carregarDashboard, 2000);
