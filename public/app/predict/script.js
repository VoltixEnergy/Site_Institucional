// ====== CONFIGURAÇÃO======
// Formato esperado, valores em % e um ponto a cada 12 horas:
// { servidores: [ { id, nome, labels: [ISO...], cpu: [], ram: [] } ] }
const URL_HISTORICO = "./historico-exemplo.json";
const ENVIAR_EMAIL_URL = "/api/alertas/enviar-email"; // rota que envia o e-mail

// Limites para gerar os alertas previstos (valores de exemplo: troque pelos limites do banco)
const LIMITES = { cpu: 80, ram: 80 };

const PONTOS_USADOS = 14;   // últimos pontos usados na regressão (14 x 12 h = 7 dias)
const PONTOS_FUTUROS = 6;   // pontos previstos (6 x 12 h = 3 dias)
const MAX_LINHAS_ALERTAS = 6; // a tabela mostra só estas linhas (o e-mail leva todos)
const PASSO_PADRAO = 12 * 60 * 60 * 1000; // 12 horas, se não der para calcular pelo histórico

const COMPONENTES = {
  cpu: { nome: "CPU", cor: "#f97316" },
  ram: { nome: "RAM", cor: "#2563eb" },
};

let servidores = [];          // cada um com previsões prontas
let alertasAtuais = [];
let grafico = null;
let componenteAtual = "cpu";
let selecionado = "todos";    // "todos" ou o id de um servidor

// ====== Regressão linear ======

// Regressão linear simples (mínimos quadrados): y = a + b*x
function regressaoLinear(ys) {
  const n = ys.length;
  const mx = (n - 1) / 2;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0, den = 0;
  ys.forEach((y, x) => { num += (x - mx) * (y - my); den += (x - mx) ** 2; });
  const b = den === 0 ? 0 : num / den;
  const a = my - b * mx;
  // R² = 1 - (erro da reta / variação total dos dados)
  let sQRes = 0, sQTot = 0;
  ys.forEach((y, x) => { sQRes += (y - (a + b * x)) ** 2; sQTot += (y - my) ** 2; });
  const r2 = sQTot === 0 ? 0 : 1 - sQRes / sQTot;
  return { a, b, r2 };
}

function limitar(v) { return Math.max(0, Math.min(100, v)); }

function preverComponente(valores) {
  const janela = valores.slice(-PONTOS_USADOS);
  const { a, b, r2 } = regressaoLinear(janela);
  const futuros = [];
  for (let k = 1; k <= PONTOS_FUTUROS; k++) {
    futuros.push(limitar(a + b * (janela.length - 1 + k)));
  }
  return { futuros, r2 };
}

// ====== Datas ======

function rotulosFuturos(labels) {
  const ult = new Date(labels[labels.length - 1]);
  let passo = PASSO_PADRAO;
  if (labels.length > 1) {
    const ant = new Date(labels[labels.length - 2]);
    if (!isNaN(ult - ant) && ult - ant > 0) passo = ult - ant;
  }
  const out = [];
  for (let k = 1; k <= PONTOS_FUTUROS; k++) out.push(new Date(ult.getTime() + passo * k).toISOString());
  return out;
}

function dataHora(iso) {
  const d = new Date(iso);
  return isNaN(d) ? String(iso || "") : d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

// ====== Dados por servidor ======

// Série do que está selecionado: um servidor ou a média de todos
function serieSelecionada(componente) {
  if (selecionado !== "todos") {
    const s = servidores.find((x) => x.id === selecionado);
    return { labels: s.labels, valores: s[componente] };
  }
  const n = Math.min(...servidores.map((s) => s[componente].length));
  const valores = [];
  for (let i = 0; i < n; i++) {
    let soma = 0;
    servidores.forEach((s) => { soma += s[componente][s[componente].length - n + i]; });
    valores.push(soma / servidores.length);
  }
  const labels = servidores[0].labels.slice(-n);
  return { labels, valores };
}

// Alertas previstos: primeiro momento em que a previsão passa do limite (todos os servidores da empresa)
function calcularAlertasPrevistos() {
  const lista = [];
  servidores.forEach((s) => {
    const futuros = rotulosFuturos(s.labels);
    Object.keys(COMPONENTES).forEach((c) => {
      const prev = s.previsao[c].futuros;
      const i = prev.findIndex((v) => v >= LIMITES[c]);
      if (i === -1) return; // não passa do limite nos próximos 3 dias
      lista.push({
        data: futuros[i],
        servidor: s.nome,
        mensagem: COMPONENTES[c].nome + " deve passar de " + LIMITES[c] + "% (prev. " + prev[i].toFixed(1) + "%)",
      });
    });
  });
  lista.sort((x, y) => new Date(x.data) - new Date(y.data));
  return lista;
}

// ====== Tela ======

function desenharGrafico() {
  const info = COMPONENTES[componenteAtual];
  const { labels, valores } = serieSelecionada(componenteAtual);
  const { futuros, r2 } = preverComponente(valores);
  const rotulos = labels.concat(rotulosFuturos(labels)).map(dataHora);

  const dadosReais = valores.concat(new Array(PONTOS_FUTUROS).fill(null));
  // a linha pontilhada começa no último ponto real para as duas se encontrarem
  const dadosPrev = new Array(valores.length - 1).fill(null).concat([valores[valores.length - 1]], futuros);

  const nomeSel = selecionado === "todos" ? "todos os servidores (média)" : servidores.find((x) => x.id === selecionado).nome;
  document.getElementById("tituloGrafico").textContent = "Previsão de " + info.nome + " — " + nomeSel;
  document.getElementById("avisoPrevisao").textContent =
    "Regressão linear nos últimos " + Math.min(PONTOS_USADOS, valores.length) + " pontos · R² = " + r2.toFixed(2) +
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
        // reta horizontal no limite do componente
        { label: "Limite (" + LIMITES[componenteAtual] + "%)", data: new Array(rotulos.length).fill(LIMITES[componenteAtual]), borderColor: "#dc2626", backgroundColor: "#dc2626", pointRadius: 0, borderWidth: 1.5, tension: 0 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } },
        x: { ticks: { maxTicksLimit: 7, maxRotation: 0, autoSkip: true } },
      },
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 } } },
    },
  });
}

function atualizarKpis() {
  ["cpu", "ram"].forEach((c) => {
    const { valores } = serieSelecionada(c);
    const { futuros } = preverComponente(valores);
    document.getElementById(c === "cpu" ? "kpiCpu" : "kpiRam").textContent = futuros[futuros.length - 1].toFixed(1) + "%";
  });
}

// KPI da empresa inteira (não muda com o filtro)
function atualizarKpiAlerta() {
  const emAlerta = new Set(alertasAtuais.map((a) => a.servidor));
  document.getElementById("kpiAlerta").textContent = emAlerta.size + " de " + servidores.length;
}

function mostrarServidores() {
  const corpo = document.getElementById("corpoServidores");
  corpo.innerHTML = "";
  const emAlerta = new Set(alertasAtuais.map((a) => a.servidor));

  const linhas = [{ id: "todos", nome: "Todos (média)" }].concat(servidores);
  linhas.forEach((s) => {
    const tr = document.createElement("tr");
    if (s.id === selecionado) tr.className = "selecionado";

    const tdNome = document.createElement("td");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-servidor";
    botao.textContent = s.nome;
    botao.addEventListener("click", () => selecionarServidor(s.id));
    if (s.id !== "todos" && emAlerta.has(s.nome)) {
      const marca = document.createElement("i");
      marca.className = "ph ph-warning marca-alerta";
      marca.title = "Alerta previsto";
      tdNome.appendChild(marca);
    }
    tdNome.appendChild(botao);
    tr.appendChild(tdNome);

    ["cpu", "ram"].forEach((c) => {
      const td = document.createElement("td");
      const valores = s.id === "todos" ? serieMedia(c) : s[c];
      const { futuros } = preverComponente(valores);
      td.textContent = futuros[futuros.length - 1].toFixed(1) + "%";
      tr.appendChild(td);
    });
    corpo.appendChild(tr);
  });
}

// média de todos os servidores (usada na linha "Todos" da tabela)
function serieMedia(componente) {
  const guardado = selecionado;
  selecionado = "todos";
  const { valores } = serieSelecionada(componente);
  selecionado = guardado;
  return valores;
}

function mostrarAlertas() {
  const corpo = document.getElementById("corpoAlertas");
  corpo.innerHTML = "";
  const resto = alertasAtuais.length - MAX_LINHAS_ALERTAS;
  document.getElementById("notaAlertas").textContent = resto > 0 ? "+ " + resto + " alerta(s) não exibido(s); todos vão no e-mail." : "";
  if (alertasAtuais.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3; td.className = "vazio"; td.textContent = "Nenhum alerta previsto para os próximos 3 dias.";
    tr.appendChild(td); corpo.appendChild(tr);
    return;
  }
  alertasAtuais.slice(0, MAX_LINHAS_ALERTAS).forEach((a) => {
    const tr = document.createElement("tr");
    [dataHora(a.data), a.servidor, a.mensagem].forEach((txt) => {
      const td = document.createElement("td");
      td.textContent = txt; // textContent evita injeção de HTML
      tr.appendChild(td);
    });
    corpo.appendChild(tr);
  });
}

function atualizarBotoes() {
  document.querySelectorAll(".alternador button").forEach((b) => {
    const ativo = b.dataset.componente === componenteAtual;
    b.classList.toggle("ativo", ativo);
    b.setAttribute("aria-pressed", ativo ? "true" : "false");
  });
}

function trocarComponente(c) {
  componenteAtual = c;
  atualizarBotoes();
  if (servidores.length) desenharGrafico();
}

function selecionarServidor(id) {
  selecionado = id;
  mostrarServidores();
  atualizarKpis();
  desenharGrafico();
}

async function carregarPrevisao() {
  document.querySelectorAll(".alternador button").forEach((b) => {
    b.addEventListener("click", () => trocarComponente(b.dataset.componente));
  });
  try {
    const resp = await fetch(URL_HISTORICO);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const dados = await resp.json();
    servidores = dados.servidores || [];
    if (servidores.length === 0) throw new Error("sem servidores");
    servidores.forEach((s) => {
      s.previsao = { cpu: preverComponente(s.cpu), ram: preverComponente(s.ram) };
    });
    alertasAtuais = calcularAlertasPrevistos();
    atualizarKpis();
    atualizarKpiAlerta();
    mostrarServidores();
    mostrarAlertas();
    desenharGrafico();
  } catch (e) {
    console.error(e);
    document.getElementById("avisoPrevisao").textContent = "Não foi possível carregar a previsão agora.";
    mostrarAlertas();
  }
}

async function enviarEmail() {
  const botao = document.getElementById("botaoEmail");
  const status = document.getElementById("statusEmail");
  if (alertasAtuais.length === 0) {
    status.className = "status-email erro";
    status.textContent = "Não há alertas previstos para enviar.";
    return;
  }
  botao.disabled = true;
  status.className = "status-email";
  status.textContent = "Enviando...";
  try {
    const resp = await fetch(ENVIAR_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertas: alertasAtuais }),
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    status.className = "status-email ok";
    status.textContent = "E-mail enviado.";
  } catch (e) {
    console.error(e);
    status.className = "status-email erro";
    status.textContent = "Não foi possível enviar o e-mail.";
  } finally {
    botao.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botaoEmail").addEventListener("click", enviarEmail);
});