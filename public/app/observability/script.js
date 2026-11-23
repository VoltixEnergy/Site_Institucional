const INTERVAL_MINUTES = 20
const TOTAL = (12 * 60) / INTERVAL_MINUTES

const LEGEND = [
  { name: 'Informação', color: '#94a3b8' },
  { name: 'Aviso', color: '#fb923c' },
  { name: 'Erro', color: '#e11d48' }
]

const chartsInstances = {}

const loadData = async () => {
  const data = await getData()

  loadKpis(data.kpis)
  loadCharts(data.chart)
  loadLogs(data.logs)
}

const loadCharts = (data) => {
  const now = new Date()
  now.setMinutes(Math.floor(now.getMinutes() / INTERVAL_MINUTES) * INTERVAL_MINUTES)

  const labels = []
  const formatter = date => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  for (let i = 0; i < TOTAL; i++) 
    labels.push(formatter(new Date(now.getTime() - (TOTAL - 1 - i) * INTERVAL_MINUTES * 60000)))
  
  const legendElement = document.querySelector('#legend') 
  legendElement.innerHTML = LEGEND.map(legend =>
    `<span class="flex items-center gap-1.5"><span class="inline-block w-3 h-3 rounded-sm" style="background:${legend.color}"></span>${legend.name}</span>`
  ).join("")

  chartsInstances["logsPerTime"] = new Chart(document.querySelector('#logsPerTime'), {
    type: 'bar',
    data: {
      labels,
      datasets: LEGEND.map((legend, i) => ({
        label: legend.name,
        data: data.historic[i],
        backgroundColor: legend.color,
        borderWidth: 0,
        categoryPercentage: 1,
        barPercentage: 0.8,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#262626',
          titleColor: '#e5e5e5',
          bodyColor: '#d4d4d4',
          padding: 10,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#334155', maxRotation: 0, autoSkip: true, maxTicksLimit: 9 },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: '#cbd5e1' },
          border: { display: false },
          ticks: { color: '#334155' }
        },
      },
    },
  })

  chartsInstances["serversWithErrors"] = new Chart(document.querySelector('#serversWithErrors'), {
    type: "doughnut",
    data: {
      labels: data.server.labels,
      datasets: [{
        data: data.server.data,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#1e293b',
            font: {
              family: "'Exo 2', sans-serif",
              weight: 'normal'
            },
          }
        }
      }
    }
  })
}

const loadKpis = (data) => {
  document.querySelector("#status").innerText = data.status.message
  document.querySelector("#errorRate").innerText = data.errorRate
  document.querySelector("#logsTotal").innerText = data.logsVolume.total
  document.querySelector("#logsInfo").innerText = data.logsVolume.infos
  document.querySelector("#logsWarn").innerText = data.logsVolume.warnings
  document.querySelector("#logsError").innerText = data.logsVolume.errors
  document.querySelector("#errorCounting").innerText = data.errorCounting
} 

const loadLogs = (data) => {
  const containerElement = document.querySelector("#logsSection")
  let html = ""

  data.forEach(log => {
     html += `
      <div class="bg-slate-100 w-full h-fit flex-1 rounded-md p-4 relative">
        <div class="inline-flex gap-2 text-sm items-center">
          <i class="ph ph-warning text-lg"></i>
          <p>${log.level}</p>
          <span>|</span>
          <p>${log.initialDate} - ${log.endDate}</p>
          <span>|</span>
          <p>${log.scope}</p>
          <span>|</span>
          <p>x${log.count}</p>
        </div>
        <div class="text-sm font-semibold font-mono p-1">
          <p>${log.message}</p>
        </div>
        <div class="flex gap-1 text-sm items-center pt-1 cursor-pointer">
          <i class="ph ph-caret-up text-lg"></i>
          <span>Esconder Stacktrace</span>
          <span class="h-px w-full flex-1 bg-slate-400"></span>
        </div>
        <div class="text-sm font-semibold font-mono p-1">
          <p>${log.stacktrace}</p>
        </div>
        <div class="flex gap-1 text-sm items-center pt-1 cursor-pointer">
          <i class="ph ph-caret-up text-lg"></i>
          <span>Esconder Instâncias Afetadas</span>
          <span class="h-px w-full flex-1 bg-slate-400"></span>
        </div>
        <div class="text-sm font-semibold font-mono p-1 flex flex-wrap gap-1">
          <span class="flex">
            <span class="px-2 py-1 bg-blue-500/90 w-fit rounded-l-full">MDM São Paulo</span>
            <span class="px-2 py-1 bg-slate-500/90 w-fit rounded-r-full">mdm-1 | mdm-2 | mdm-3</span>
          </span>
          <span class="flex">
            <span class="px-2 py-1 bg-blue-500/90 w-fit rounded-l-full">MDM Campinas</span>
            <span class="px-2 py-1 bg-slate-500/90 w-fit rounded-r-full">mdm-1 | mdm-3</span>
          </span>
          <span class="flex">
            <span class="px-2 py-1 bg-blue-500/90 w-fit rounded-l-full">MDM Jundiaí</span>
            <span class="px-2 py-1 bg-slate-500/90 w-fit rounded-r-full">mdm-2</span>
          </span>
        </div>
      </div>
    `
  });

  containerElement.innerHTML += html
}

const getData = async () => {
  const rawResponse = await fetch("http://localhost:8080/dashboard", {
    method: "GET",
    credentials: "include"
  })

  if (!rawResponse.ok)
    return null // implementar toast

  const response = await rawResponse.json()
  const data = JSON.parse(response.data)

  return data
}