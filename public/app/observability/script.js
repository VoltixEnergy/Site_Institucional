const chartsInstances = {}

const loadCharts = () => {
  const charts = [{
    element: document.querySelector("#logsPerTime"),
    type: "line",
    title: "Logs pelo Tempo",
    datasets: [{
      label: ["Erros"],
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#f00',
      backgroundColor: '#f00',
      borderWidth: 1
    }, 
    {
      label: ["Avisos"],
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#f90',
      backgroundColor: '#f90',
      borderWidth: 1
    },
    {
      label: ["Infos"],
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#999',
      backgroundColor: '#999',
      borderWidth: 1
    }]
  }, 
  {
    element: document.querySelector("#scopeByError"),
    type: "doughnut",
    title: "Escopos de Erro",
    datasets: [{
      label: "Quantidade",
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#1e293b',
      // backgroundColor: colors,
      borderWidth: 1
    }]
  }, 
  {
    element: document.querySelector("#scopeByWarning"),
    type: "doughnut",
    title: "Escopos de Avisos",
    datasets: [{
      label: "Quantidade",
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#1e293b',
      // backgroundColor: colors,
      borderWidth: 1
    }]
  },
  {
    element: document.querySelector("#scopeByInfo"),
    type: "doughnut",
    title: "Escopos de Informações",
    datasets: [{
      label: "Quantidade",
      data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      borderColor: '#1e293b',
      // backgroundColor: colors,
      borderWidth: 1
    }]
  }]

  charts.forEach(chart => drawChart(chart))
}

const drawChart = (chart) => {
  chartsInstances[chart.element.id] = new Chart(chart.element, {
    type: chart.type,
    data: {
      labels: ["Validation", "UDP Server", "S3 Client"],
      datasets: chart.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200
      },
      plugins: {
        title: {
          display: true,
          text: chart.title,
          align: 'center',
          color: '#020617',
          font: {
            size: 18,
            family: "'Exo 2', sans-serif",
            weight: 500
          }
        },
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