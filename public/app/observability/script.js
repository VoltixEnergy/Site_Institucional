const INTERVAL_MINUTES = 20
const TOTAL = (12 * 60) / INTERVAL_MINUTES

const LEGEND = [
  { name: 'Informação', color: '#94a3b8' },
  { name: 'Aviso', color: '#fb923c' },
  { name: 'Erro', color: '#e11d48' }
]

const chartsInstances = {}

const loadData = () => {
  const data = getData()

  loadKpis(data.kpis)
  loadCharts(data.chart)
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
      labels: ["MDM São Paulo", "MDM Campinas", "MDM Jundiaí"],
      datasets: [{
        data: data.server,
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
  document.querySelector("#status").innerText = data.status
  document.querySelector("#errorRate").innerText = data.errorRate
  document.querySelector("#logsVolume").innerText = data.logsVolume
  document.querySelector("#errorCounting").innerText = data.errorCounting
}

const getData = () => {
  const response = {
    chart: {
      historic: null,
      server: null,
    },
    kpis: {
      status: "Capacidade Reduzida",
      errorRate: "0.8%",
      logsVolume: 2470,
      errorCounting: 3
    }
  }

  response.chart.historic = LEGEND.map(
    _ => {
      const legendData = []
      for (let i = 0; i < TOTAL; i++)
        legendData.push(Math.round(2 + Math.random() * (14 - 2)))

      return legendData
    }
  )

  response.chart.server = [10, 80, 10]

  return response
}