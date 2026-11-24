
const ID_DA_EMPRESA = new URLSearchParams(window.location.search).get("empresaId")
  || sessionStorage.getItem("ID_EMPRESA");
const URL_HISTORICO = "/previsao/historico/" + encodeURIComponent(ID_DA_EMPRESA);

// Limite usado só se o servidor não tiver limite cadastrado no banco (tabela metrica)
const LIMITE_PADRAO = 80;

const MAX_LINHAS_ALERTAS = 6; // a tabela mostra só estas linhas

// A ETL guarda um ponto a cada 6 horas (PASSO_BASE_H). Cada cenário junta esses pontos
// em passos maiores (média) para o gráfico nunca passar de 10 pontos (historico + futuros).
const PASSO_BASE_H = 6;
const PONTOS_REGRESSAO = 12; // a regressão usa até os últimos 12 pontos do cenário
const CENARIOS = {
  dia:  { nome: "24 horas", passoH: 6,  historico: 6, futuros: 4, periodo: "as próximas 24 horas" }, // 6 + 4 = 10 pontos
  tres: { nome: "3 dias",   passoH: 12, historico: 4, futuros: 6, periodo: "os próximos 3 dias" },   // 4 + 6 = 10 pontos
  sete: { nome: "7 dias",   passoH: 24, historico: 3, futuros: 7, periodo: "os próximos 7 dias" },   // 3 + 7 = 10 pontos
};
const HORA_MS = 60 * 60 * 1000;

const COMPONENTES = {
  cpu: { nome: "CPU", cor: "#f97316" },
  ram: { nome: "RAM", cor: "#2563eb" },
};

let servidores = [];          // cada um com previsões prontas
let alertasAtuais = [];
let grafico = null;
let componenteAtual = "cpu";
let cenarioAtual = "dia";
let selecionado = "todos";    // "todos" ou o id de um servidor

// ====== Regressão linear ======

// Regressão linear simples (mínimos quadrados): y = a + b*x
function regressaoLinear(ys) {
  const n = ys.length;
  const mx = (n - 1) / 2;            // média dos x (x = 0, 1, 2, ...)

  let soma = 0;
  for (let x = 0; x < n; x++) {
    soma += ys[x];
  }
  const my = soma / n;               // média dos y

  // b = inclinação da reta, a = onde a reta começa
  let num = 0, den = 0;
  for (let x = 0; x < n; x++) {
    num += (x - mx) * (ys[x] - my);
    den += (x - mx) ** 2;
  }
  const b = den === 0 ? 0 : num / den;
  const a = my - b * mx;

  // R² = 1 - (erro da reta / variação total dos dados)
  let sQRes = 0, sQTot = 0;
  for (let x = 0; x < n; x++) {
    sQRes += (ys[x] - (a + b * x)) ** 2;
    sQTot += (ys[x] - my) ** 2;
  }
  const r2 = sQTot === 0 ? 0 : 1 - sQRes / sQTot;
  return { a, b, r2 };
}

function limitar(v) { return Math.max(0, Math.min(100, v)); }

function preverComponente(valores) {
  const janela = valores.slice(-PONTOS_REGRESSAO);
  const { a, b, r2 } = regressaoLinear(janela);
  const futuros = [];
  for (let k = 1; k <= CENARIOS[cenarioAtual].futuros; k++) {
    futuros.push(limitar(a + b * (janela.length - 1 + k)));
  }
  return { futuros, r2 };
}

//Limites (vêm do banco, dentro do JSON de cada servidor)

function limiteDoServidor(servidor, componente) {
  const l = servidor.limites && servidor.limites[componente];
  return typeof l === "number" ? l : LIMITE_PADRAO;
}

// Limite do que está selecionado: o do servidor ou a média dos limites de todos
function limiteSelecionado(componente) {
  if (selecionado !== "todos") return limiteDoServidor(servidores.find((x) => x.id === selecionado), componente);
  let soma = 0;
  for (let i = 0; i < servidores.length; i++) {
    soma += limiteDoServidor(servidores[i], componente);
  }
  return soma / servidores.length;
}

// ====== Datas ======

function rotulosFuturos(labels) {
  const ult = new Date(labels[labels.length - 1]);
  const passo = CENARIOS[cenarioAtual].passoH * HORA_MS;
  const out = [];
  for (let k = 1; k <= CENARIOS[cenarioAtual].futuros; k++) out.push(new Date(ult.getTime() + passo * k).toISOString());
  return out;
}

// No cenário de 7 dias o passo é de 1 dia, então a hora não ajuda: mostra só a data
function dataHora(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "");
  const opcoes = { day: "2-digit", month: "2-digit" };
  if (CENARIOS[cenarioAtual].passoH < 24) { opcoes.hour = "2-digit"; opcoes.minute = "2-digit"; }
  return d.toLocaleString("pt-BR", opcoes);
}

// Rótulo do eixo do gráfico: data e hora em duas linhas, para os 10 pontos caberem sem se sobrepor
function rotuloEixo(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "");
  const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  if (CENARIOS[cenarioAtual].passoH >= 24) return data;
  return [data, d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })];
}

// Junta os pontos de 6 h em pontos do passo do cenário (média), contando de trás para frente
// a partir do último ponto. Devolve { labels, cpu, ram } do servidor.
function agruparServidor(s) {
  const passo = CENARIOS[cenarioAtual].passoH * HORA_MS;
  const base = PASSO_BASE_H * HORA_MS;
  const porBloco = Math.round(passo / base);
  const ultimo = new Date(s.labels[s.labels.length - 1]).getTime();

  const grupos = {}; // k -> { n, cpu, ram }
  for (let i = 0; i < s.labels.length; i++) {
    const k = Math.floor((ultimo - new Date(s.labels[i]).getTime()) / passo);
    if (!grupos[k]) grupos[k] = { n: 0, cpu: 0, ram: 0 };
    grupos[k].n += 1;
    grupos[k].cpu += s.cpu[i];
    grupos[k].ram += s.ram[i];
  }

  let ks = Object.keys(grupos).map(Number).sort((a, b) => b - a); // do mais antigo ao mais novo
  // o grupo mais antigo costuma vir incompleto (faltam pontos): descarta se sobrar outro
  if (ks.length > 1 && grupos[ks[0]].n < porBloco) ks = ks.slice(1);

  // Se faltar algum ponto no meio (buraco no histórico), preenche com uma reta entre os vizinhos,
  // para o eixo do tempo ficar certo e a regressão não ser enganada pelo buraco.
  const media = (k, c) => grupos[k][c] / grupos[k].n;
  const serie = { labels: [], cpu: [], ram: [] };
  for (let k = ks[0]; k >= 0; k--) {
    let cpu, ram;
    if (grupos[k]) {
      cpu = media(k, "cpu"); ram = media(k, "ram");
    } else {
      let ant = k + 1; while (!grupos[ant]) ant++;     // vizinho mais antigo
      let prox = k - 1; while (!grupos[prox]) prox--;  // vizinho mais novo
      const f = (ant - k) / (ant - prox);
      cpu = media(ant, "cpu") + (media(prox, "cpu") - media(ant, "cpu")) * f;
      ram = media(ant, "ram") + (media(prox, "ram") - media(ant, "ram")) * f;
    }
    serie.labels.push(new Date(ultimo - k * passo - (passo - base)).toISOString());
    serie.cpu.push(cpu);
    serie.ram.push(ram);
  }
  return serie;
}

// Refaz as séries e as previsões de todos os servidores para o cenário escolhido
function recalcularCenario() {
  for (let i = 0; i < servidores.length; i++) {
    const s = servidores[i];
    s.serie = agruparServidor(s);
    s.previsao = { cpu: preverComponente(s.serie.cpu), ram: preverComponente(s.serie.ram) };
  }
  alertasAtuais = calcularAlertasPrevistos();
}

// ====== Dados por servidor ======

// Série do que está selecionado: um servidor ou a média de todos
function serieSelecionada(componente) {
  if (selecionado !== "todos") {
    const s = servidores.find((x) => x.id === selecionado);
    return { labels: s.serie.labels, valores: s.serie[componente] };
  }
  // n = quantidade de pontos do servidor que tem menos pontos (todos são cortados nesse tamanho)
  let n = servidores[0].serie[componente].length;
  for (let j = 1; j < servidores.length; j++) {
    if (servidores[j].serie[componente].length < n) n = servidores[j].serie[componente].length;
  }

  const valores = [];
  for (let i = 0; i < n; i++) {
    let soma = 0;
    for (let j = 0; j < servidores.length; j++) {
      const serie = servidores[j].serie[componente];
      soma += serie[serie.length - n + i];
    }
    valores.push(soma / servidores.length);
  }
  const labels = servidores[0].serie.labels.slice(-n);
  return { labels, valores };
}

// Alertas previstos: primeiro momento em que a previsão passa do limite (todos os servidores da empresa)
function calcularAlertasPrevistos() {
  const lista = [];
  const componentes = ["cpu", "ram"];
  for (let i = 0; i < servidores.length; i++) {
    const s = servidores[i];
    const datas = rotulosFuturos(s.serie.labels);

    for (let j = 0; j < componentes.length; j++) {
      const c = componentes[j];
      const prev = s.previsao[c].futuros;
      const limite = limiteDoServidor(s, c);

      // procura o primeiro ponto previsto que passa do limite
      let primeiro = -1;
      for (let k = 0; k < prev.length; k++) {
        if (prev[k] >= limite) { primeiro = k; break; }
      }
      if (primeiro === -1) continue; // não passa do limite no período do cenário

      lista.push({
        data: datas[primeiro],
        servidor: s.nome,
        mensagem: COMPONENTES[c].nome + " deve passar de " + limite.toFixed(0) + "% (prev. " + prev[primeiro].toFixed(1) + "%)",
      });
    }
  }
  lista.sort((x, y) => new Date(x.data) - new Date(y.data));
  return lista;
}

// ====== Tela ======

function desenharGrafico() {
  const info = COMPONENTES[componenteAtual];
  const { labels, valores } = serieSelecionada(componenteAtual);
  const { futuros, r2 } = preverComponente(valores);
  const limite = limiteSelecionado(componenteAtual);
  const cen = CENARIOS[cenarioAtual];

  // o gráfico mostra só os últimos pontos reais do cenário, para não passar de 10 pontos no total
  const labelsGraf = labels.slice(-cen.historico);
  const valoresGraf = valores.slice(-cen.historico);
  const rotulos = labelsGraf.concat(rotulosFuturos(labels)).map(rotuloEixo);

  const dadosReais = valoresGraf.concat(new Array(cen.futuros).fill(null));
  // a linha pontilhada começa no último ponto real para as duas se encontrarem
  const dadosPrev = new Array(valoresGraf.length - 1).fill(null).concat([valoresGraf[valoresGraf.length - 1]], futuros);

  const nomeSel = selecionado === "todos" ? "todos os servidores (média)" : servidores.find((x) => x.id === selecionado).nome;
  const sub = document.getElementById("subtituloGrafico"); // opcional: <p id="subtituloGrafico"> no HTML
  if (sub) sub.textContent = "Linha cheia: medido (de " + cen.passoH + " em " + cen.passoH + " h) · pontilhada: previsão de " + cen.nome;
  document.getElementById("tituloGrafico").textContent = "Previsão de " + info.nome + " — " + nomeSel;
  document.getElementById("avisoPrevisao").textContent =
    "Regressão linear nos últimos " + Math.min(PONTOS_REGRESSAO, valores.length) + " pontos · R² = " + r2.toFixed(2) +
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
        { label: "Limite (" + limite.toFixed(0) + "%)", data: new Array(rotulos.length).fill(limite), borderColor: "#dc2626", backgroundColor: "#dc2626", pointRadius: 0, borderWidth: 1.5, tension: 0 },
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

function atualizarKpis() {
  const componentes = ["cpu", "ram"];
  for (let i = 0; i < componentes.length; i++) {
    const c = componentes[i];
    const { valores } = serieSelecionada(c);
    const { futuros } = preverComponente(valores);
    document.getElementById(c === "cpu" ? "kpiCpu" : "kpiRam").textContent = futuros[futuros.length - 1].toFixed(1) + "%";
  }
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
    if (s.id !== "todos" && emAlerta.has(s.nome)) {
      const marca = document.createElement("i");
      marca.className = "ph ph-warning marca-alerta";
      marca.title = "Alerta previsto";
      tdNome.appendChild(marca);
    }
    tdNome.appendChild(botao);
    tr.appendChild(tdNome);

    const componentes = ["cpu", "ram"];
    for (let j = 0; j < componentes.length; j++) {
      const c = componentes[j];
      const td = document.createElement("td");
      const valores = s.id === "todos" ? serieMedia(c) : s.serie[c];
      const { futuros } = preverComponente(valores);
      td.textContent = futuros[futuros.length - 1].toFixed(1) + "%";
      tr.appendChild(td);
    }
    corpo.appendChild(tr);
  }
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
  document.getElementById("notaAlertas").textContent = resto > 0 ? "+ " + resto + " alerta(s) não exibido(s)." : "";
  if (alertasAtuais.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3; td.className = "vazio"; td.textContent = "Nenhum alerta previsto para " + CENARIOS[cenarioAtual].periodo + ".";
    tr.appendChild(td); corpo.appendChild(tr);
    return;
  }
  const mostrados = Math.min(alertasAtuais.length, MAX_LINHAS_ALERTAS);
  for (let i = 0; i < mostrados; i++) {
    const a = alertasAtuais[i];
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
  if (servidores.length) desenharGrafico();
}

function trocarCenario(c) {
  cenarioAtual = c;
  atualizarBotoes();
  if (!servidores.length) return;
  recalcularCenario();
  atualizarKpis();
  atualizarKpiAlerta();
  mostrarServidores();
  mostrarAlertas();
  desenharGrafico();
}

// Cria os botões "24 horas | 3 dias | 7 dias" ao lado do botão CPU | RAM (sem precisar mexer no HTML)
function criarBotoesCenario() {
  const alternadorComponente = document.querySelector(".alternador");
  if (!alternadorComponente || document.getElementById("alternadorCenario")) return;

  const grupo = document.createElement("div");
  grupo.className = "alternador";
  grupo.id = "alternadorCenario";
  const chaves = Object.keys(CENARIOS); // ["dia", "tres", "sete"]
  for (let i = 0; i < chaves.length; i++) {
    const c = chaves[i];
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.cenario = c;
    botao.textContent = CENARIOS[c].nome;
    botao.addEventListener("click", () => trocarCenario(c));
    grupo.appendChild(botao);
  }

  const caixa = document.createElement("div");
  caixa.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end";
  alternadorComponente.parentNode.insertBefore(caixa, alternadorComponente);
  caixa.appendChild(grupo);
  caixa.appendChild(alternadorComponente);
}

function selecionarServidor(id) {
  selecionado = id;
  mostrarServidores();
  atualizarKpis();
  desenharGrafico();
}

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
    const resp = await fetch(URL_HISTORICO);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const dados = await resp.json();
    servidores = (dados.data && dados.data.servidores) || [];
    if (servidores.length === 0) throw new Error("sem servidores");
    recalcularCenario();
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