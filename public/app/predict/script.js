// ====== CONFIGURAÇÃO ======
// A previsão (regressão linear, R², cenários e alertas) é calculada na ETL e já vem pronta
// em previsao/<id_da_empresa>.json. Esta página só busca esse JSON e mostra na tela.
//
// Formato que a página usa (resumido):
// { servidores: [ { id, nome } ],
//   previsao: { dia|tres|sete: {
//       nome, passo_horas, periodo, alertas: [ { data, servidor, mensagem } ],
//       servidores_em_alerta, total_servidores,
//       visoes: { todos|<mac>: { labels, labels_previsao,
//                                cpu|ram|disco: { medido, previsto, limite, r2, pontos_regressao } } } } } }

// O id da empresa vem de ?empresaId=... na URL ou, se não tiver, do sessionStorage ("ID_EMPRESA").
const ID_DA_EMPRESA = new URLSearchParams(window.location.search).get("empresaId")
  || sessionStorage.getItem("ID_EMPRESA");
const URL_PREVISAO = "/previsao/historico/" + encodeURIComponent(ID_DA_EMPRESA);

const MAX_LINHAS_ALERTAS = 6; // a tabela mostra só estas linhas

// Componentes: nome, cor da linha, texto do KPI e ids do KPI na página (título e valor)
const COMPONENTES = {
  cpu:   { nome: "CPU",   cor: "#f97316", textoKpi: "CPU prevista",    kpi: "kpiCpu",   tituloKpi: "tituloKpiCpu" },
  ram:   { nome: "RAM",   cor: "#2563eb", textoKpi: "RAM prevista",    kpi: "kpiRam",   tituloKpi: "tituloKpiRam" },
  disco: { nome: "Disco", cor: "#16a34a", textoKpi: "Disco previsto",  kpi: "kpiDisco", tituloKpi: "tituloKpiDisco" },
};
const LISTA_COMPONENTES = ["cpu", "ram", "disco"];

// Cenários: só o texto dos botões (os números vêm da ETL)
const NOMES_CENARIOS = { dia: "24 horas", tres: "3 dias", sete: "7 dias" };

let servidores = [];          // [{ id, nome }]
let previsao = null;          // a previsão pronta dos 3 cenários
let grafico = null;
let componenteAtual = "cpu";
let cenarioAtual = "dia";
let selecionado = "todos";    // "todos" ou o id (MAC) de um servidor

// ====== Datas (só para mostrar) ======

// No cenário de 7 dias o passo é de 1 dia, então a hora não ajuda: mostra só a data
function dataHora(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "");
  const opcoes = { day: "2-digit", month: "2-digit" };
  if (previsao[cenarioAtual].passo_horas < 24) { opcoes.hour = "2-digit"; opcoes.minute = "2-digit"; }
  return d.toLocaleString("pt-BR", opcoes);
}

// Rótulo do eixo do gráfico: data e hora em duas linhas, para os 10 pontos caberem sem se sobrepor
function rotuloEixo(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "");
  const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  if (previsao[cenarioAtual].passo_horas >= 24) return data;
  return [data, d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })];
}

// ====== Dados prontos ======

// A previsão do cenário atual
function cenario() {
  return previsao[cenarioAtual];
}

// Último valor previsto de um componente (é o que aparece nos KPIs e na tabela de servidores)
function ultimoPrevisto(idDaVisao, componente) {
  const previstos = cenario().visoes[idDaVisao][componente].previsto;
  return previstos[previstos.length - 1];
}

// ====== Tela ======

function desenharGrafico() {
  const info = COMPONENTES[componenteAtual];
  const visao = cenario().visoes[selecionado];
  const dado = visao[componenteAtual];

  // eixo x: os pontos medidos seguidos dos pontos previstos
  const datas = visao.labels.concat(visao.labels_previsao);
  const rotulos = [];
  for (let i = 0; i < datas.length; i++) {
    rotulos.push(rotuloEixo(datas[i]));
  }

  // linha cheia: medido, e vazio nos pontos previstos
  const dadosReais = dado.medido.slice();
  for (let i = 0; i < dado.previsto.length; i++) {
    dadosReais.push(null);
  }

  // linha pontilhada: vazio nos pontos medidos, começa no último medido para as duas se encontrarem
  const dadosPrev = [];
  for (let i = 0; i < dado.medido.length - 1; i++) {
    dadosPrev.push(null);
  }
  dadosPrev.push(dado.medido[dado.medido.length - 1]);
  for (let i = 0; i < dado.previsto.length; i++) {
    dadosPrev.push(dado.previsto[i]);
  }

  // reta horizontal no limite do componente
  const dadosLimite = [];
  for (let i = 0; i < rotulos.length; i++) {
    dadosLimite.push(dado.limite);
  }

  let nomeSel = "todos os servidores (média)";
  if (selecionado !== "todos") {
    for (let i = 0; i < servidores.length; i++) {
      if (servidores[i].id === selecionado) nomeSel = servidores[i].nome;
    }
  }
  const sub = document.getElementById("subtituloGrafico"); // opcional: <span id="subtituloGrafico"> no HTML
  if (sub) {
    sub.textContent = "Linha cheia: medido (de " + cenario().passo_horas + " em " + cenario().passo_horas +
      " h) · pontilhada: previsão de " + cenario().nome;
  }
  document.getElementById("tituloGrafico").textContent = "Previsão de " + info.nome + " — " + nomeSel;
  document.getElementById("avisoPrevisao").textContent =
    "Regressão linear nos últimos " + dado.pontos_regressao + " pontos · R² = " + dado.r2.toFixed(2) +
    " (perto de 1 = a reta explica bem)";

  if (grafico) grafico.destroy();
  if (Chart.defaults && Chart.defaults.font) Chart.defaults.font.family = "'Exo 2', sans-serif";
  grafico = new Chart(document.getElementById("graficoPrevisao"), {
    type: "line",
    data: {
      labels: rotulos,
      datasets: [
        { label: info.nome + " medido", data: dadosReais, borderColor: info.cor, backgroundColor: info.cor, pointRadius: 0, borderWidth: 2, tension: 0.2 },
        { label: info.nome + " previsto", data: dadosPrev, borderColor: info.cor, backgroundColor: info.cor, pointRadius: 0, borderWidth: 2, borderDash: [6, 6], tension: 0 },
        { label: "Limite (" + dado.limite.toFixed(0) + "%)", data: dadosLimite, borderColor: "#dc2626", backgroundColor: "#dc2626", pointRadius: 0, borderWidth: 1.5, tension: 0 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } },
        x: { ticks: { maxTicksLimit: 10, maxRotation: 0, autoSkip: false } },
      },
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 } } },
    },
  });
}

// KPIs de CPU, RAM e disco: o valor previsto no FIM do cenário, do que está selecionado.
// O título diz para quando é ("CPU prevista em 24 horas") e o número mostra a data exata ao passar o mouse.
function atualizarKpis() {
  const visao = cenario().visoes[selecionado];
  const dataFinal = dataHora(visao.labels_previsao[visao.labels_previsao.length - 1]);

  for (let i = 0; i < LISTA_COMPONENTES.length; i++) {
    const c = LISTA_COMPONENTES[i];
    const valor = document.getElementById(COMPONENTES[c].kpi);
    valor.textContent = ultimoPrevisto(selecionado, c).toFixed(1) + "%";
    valor.title = "Previsto para " + dataFinal;

    const titulo = document.getElementById(COMPONENTES[c].tituloKpi);
    if (titulo) titulo.textContent = COMPONENTES[c].textoKpi + " em " + cenario().nome;
  }
}

// KPI da empresa inteira (não muda com o filtro, só com o cenário)
function atualizarKpiAlerta() {
  document.getElementById("kpiAlerta").textContent =
    cenario().servidores_em_alerta + " de " + cenario().total_servidores;
  const titulo = document.getElementById("tituloKpiAlerta");
  if (titulo) titulo.textContent = "Servidores em alerta (" + cenario().nome + ")";
}

function mostrarServidores() {
  const corpo = document.getElementById("corpoServidores");
  corpo.innerHTML = "";

  // nomes dos servidores que têm algum alerta previsto
  const emAlerta = {};
  for (let i = 0; i < cenario().alertas.length; i++) {
    emAlerta[cenario().alertas[i].servidor] = true;
  }

  const linhas = [{ id: "todos", nome: "Todos (média)" }].concat(servidores);
  for (let i = 0; i < linhas.length; i++) {
    const s = linhas[i];
    const tr = document.createElement("tr");
    if (s.id === selecionado) tr.className = "selecionado";

    const tdNome = document.createElement("td");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-servidor";
    botao.textContent = s.nome;
    botao.addEventListener("click", () => selecionarServidor(s.id));
    if (s.id !== "todos" && emAlerta[s.nome]) {
      const marca = document.createElement("i");
      marca.className = "ph ph-warning marca-alerta";
      marca.title = "Alerta previsto";
      tdNome.appendChild(marca);
    }
    tdNome.appendChild(botao);
    tr.appendChild(tdNome);

    for (let j = 0; j < LISTA_COMPONENTES.length; j++) {
      const td = document.createElement("td");
      td.textContent = ultimoPrevisto(s.id, LISTA_COMPONENTES[j]).toFixed(1) + "%";
      tr.appendChild(td);
    }
    corpo.appendChild(tr);
  }
}

function mostrarAlertas() {
  const corpo = document.getElementById("corpoAlertas");
  corpo.innerHTML = "";

  const alertas = cenario().alertas;
  const resto = alertas.length - MAX_LINHAS_ALERTAS;
  document.getElementById("notaAlertas").textContent = resto > 0 ? "+ " + resto + " alerta(s) não exibido(s)." : "";

  if (alertas.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3; td.className = "vazio"; td.textContent = "Nenhum alerta previsto para " + cenario().periodo + ".";
    tr.appendChild(td); corpo.appendChild(tr);
    return;
  }

  const mostrados = Math.min(alertas.length, MAX_LINHAS_ALERTAS);
  for (let i = 0; i < mostrados; i++) {
    const a = alertas[i];
    const tr = document.createElement("tr");
    const textos = [dataHora(a.data), a.servidor, a.mensagem];
    for (let j = 0; j < textos.length; j++) {
      const td = document.createElement("td");
      td.textContent = textos[j]; // textContent evita injeção de HTML
      tr.appendChild(td);
    }
    corpo.appendChild(tr);
  }
}

// Atualiza tudo que depende do cenário, do servidor ou do componente
function atualizarTela() {
  atualizarKpis();
  atualizarKpiAlerta();
  mostrarServidores();
  mostrarAlertas();
  desenharGrafico();
}

// ====== Botões ======

function atualizarBotoes() {
  const botoes = document.querySelectorAll(".alternador button");
  for (let i = 0; i < botoes.length; i++) {
    const b = botoes[i];
    const ativo = b.dataset.componente ? b.dataset.componente === componenteAtual : b.dataset.cenario === cenarioAtual;
    b.classList.toggle("ativo", ativo);
    b.setAttribute("aria-pressed", ativo ? "true" : "false");
  }
}

function trocarComponente(c) {
  componenteAtual = c;
  atualizarBotoes();
  if (previsao) desenharGrafico();
}

function trocarCenario(c) {
  cenarioAtual = c;
  atualizarBotoes();
  if (previsao) atualizarTela();
}

function selecionarServidor(id) {
  selecionado = id;
  if (previsao) atualizarTela();
}

// Cria os botões "24 horas | 3 dias | 7 dias" ao lado do botão CPU | RAM | Disco (sem precisar mexer no HTML)
function criarBotoesCenario() {
  const alternadorComponente = document.querySelector(".alternador");
  if (!alternadorComponente || document.getElementById("alternadorCenario")) return;

  const grupo = document.createElement("div");
  grupo.className = "alternador";
  grupo.id = "alternadorCenario";
  const chaves = Object.keys(NOMES_CENARIOS); // ["dia", "tres", "sete"]
  for (let i = 0; i < chaves.length; i++) {
    const c = chaves[i];
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.cenario = c;
    botao.textContent = NOMES_CENARIOS[c];
    botao.addEventListener("click", () => trocarCenario(c));
    grupo.appendChild(botao);
  }

  const caixa = document.createElement("div");
  caixa.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end";
  alternadorComponente.parentNode.insertBefore(caixa, alternadorComponente);
  caixa.appendChild(grupo);
  caixa.appendChild(alternadorComponente);
}

// ====== Carregar ======

async function carregarPrevisao() {
  criarBotoesCenario();
  const botoesComponente = document.querySelectorAll(".alternador button[data-componente]");
  for (let i = 0; i < botoesComponente.length; i++) {
    const b = botoesComponente[i];
    b.addEventListener("click", () => trocarComponente(b.dataset.componente));
  }
  atualizarBotoes();

  try {
    if (!ID_DA_EMPRESA) throw new Error("id da empresa não informado");
    const resp = await fetch(URL_PREVISAO);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const dados = await resp.json();

    servidores = (dados.data && dados.data.servidores) || [];
    previsao = (dados.data && dados.data.previsao) || null;
    if (servidores.length === 0) throw new Error("sem servidores");
    if (!previsao) throw new Error("JSON no formato antigo: rode a ETL da previsão de novo");

    atualizarTela();
  } catch (e) {
    console.error(e);
    document.getElementById("avisoPrevisao").textContent = "Não foi possível carregar a previsão agora.";
    // sem previsão carregada, mostra a tabela de alertas vazia
    document.getElementById("corpoAlertas").innerHTML = "";
  }
}