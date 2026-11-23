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
  document.querySelector("#status").innerText = data.status
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
     html = `
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

const getData = () => {
  const response = {
    chart: {
      historic: null,
      server: {
        labels: ["MDM São Paulo", "MDM Jundiaí", "MDM Campinas"],
        data: [10, 80, 10]
      },
    },
    kpis: {
      status: "Capacidade Reduzida",
      errorRate: "0.1%",
      logsVolume: {
        total: 2470,
        infos: 2450,
        warnings: 19,
        errors: 1  
      },
      errorCounting: 1,
    },
    logs: [
      {
        level: "ERROR",
        initialDate: "16h59",
        endDate: "19h40",
        scope: "UDP Server",
        count: 247,
        message: "The provided token is malformed or otherwise invalid. (Service: S3, Status Code: 400, Request ID: B737WWP5VXWJKZPV, Extended Request ID: gwpWj3FZ/mmfXcDuRgAal4eXywH9nuo2mqx2lSRv2azP4laRSpQGyJP8V0RQTEw9ogG2g14yMiCZrgnE/BuhfZRWXYglU5ak) (SDK Attempt Count: 1)",
        stacktrace: `software.amazon.awssdk.services.s3.model.S3Exception: The provided token is malformed or otherwise invalid. (Service: S3, Status Code: 400, Request ID: B737WWP5VXWJKZPV, Extended Request ID: gwpWj3FZ/mmfXcDuRgAal4eXywH9nuo2mqx2lSRv2azP4laRSpQGyJP8V0RQTEw9ogG2g14yMiCZrgnE/BuhfZRWXYglU5ak) (SDK Attempt Count: 1)	at software.amazon.awssdk.services.s3.model.S3Exception$BuilderImpl.build(S3Exception.java:113)	at software.amazon.awssdk.services.s3.model.S3Exception$BuilderImpl.build(S3Exception.java:61)	at software.amazon.awssdk.core.internal.http.pipeline.stages.utils.RetryableStageHelper.retryPolicyDisallowedRetryException(RetryableStageHelper.java:251)	at software.amazon.awssdk.core.internal.http.pipeline.stages.RetryableStage.execute(RetryableStage.java:86)	at software.amazon.awssdk.core.internal.http.pipeline.stages.RetryableStage.execute(RetryableStage.java:39)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.StreamManagingStage.execute(StreamManagingStage.java:53)	at software.amazon.awssdk.core.internal.http.StreamManagingStage.execute(StreamManagingStage.java:35)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.executeWithTimer(ApiCallTimeoutTrackingStage.java:82)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.execute(ApiCallTimeoutTrackingStage.java:62)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.execute(ApiCallTimeoutTrackingStage.java:43)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ExecutionFailureExceptionReportingStage.execute(ExecutionFailureExceptionReportingStage.java:37)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ExecutionFailureExceptionReportingStage.execute(ExecutionFailureExceptionReportingStage.java:26)	at software.amazon.awssdk.core.internal.http.AmazonSyncHttpClient$RequestExecutionBuilderImpl.execute(AmazonSyncHttpClient.java:213)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.invoke(BaseSyncClientHandler.java:105)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.doExecute(BaseSyncClientHandler.java:176)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.lambda$execute$1(BaseSyncClientHandler.java:82)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.measureApiCall(BaseSyncClientHandler.java:200)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.execute(BaseSyncClientHandler.java:76)	at software.amazon.awssdk.core.client.handler.SdkSyncClientHandler.execute(SdkSyncClientHandler.java:45)	at software.amazon.awssdk.awscore.client.handler.AwsSyncClientHandler.execute(AwsSyncClientHandler.java:53)	at software.amazon.awssdk.services.s3.DefaultS3Client.putObject(DefaultS3Client.java:13463)	at com.voltix.Mdm.main(Mdm.java:115)`,
        instances: {
          "MDM São Paulo": ["mdm-1", "mdm-2", "mdm-3"]
        }
      },
      {
        level: "ERROR",
        initialDate: "16h59",
        endDate: "19h40",
        scope: "UDP Server",
        count: 247,
        message: "The provided token is malformed or otherwise invalid. (Service: S3, Status Code: 400, Request ID: B737WWP5VXWJKZPV, Extended Request ID: gwpWj3FZ/mmfXcDuRgAal4eXywH9nuo2mqx2lSRv2azP4laRSpQGyJP8V0RQTEw9ogG2g14yMiCZrgnE/BuhfZRWXYglU5ak) (SDK Attempt Count: 1)",
        stacktrace: `software.amazon.awssdk.services.s3.model.S3Exception: The provided token is malformed or otherwise invalid. (Service: S3, Status Code: 400, Request ID: B737WWP5VXWJKZPV, Extended Request ID: gwpWj3FZ/mmfXcDuRgAal4eXywH9nuo2mqx2lSRv2azP4laRSpQGyJP8V0RQTEw9ogG2g14yMiCZrgnE/BuhfZRWXYglU5ak) (SDK Attempt Count: 1)	at software.amazon.awssdk.services.s3.model.S3Exception$BuilderImpl.build(S3Exception.java:113)	at software.amazon.awssdk.services.s3.model.S3Exception$BuilderImpl.build(S3Exception.java:61)	at software.amazon.awssdk.core.internal.http.pipeline.stages.utils.RetryableStageHelper.retryPolicyDisallowedRetryException(RetryableStageHelper.java:251)	at software.amazon.awssdk.core.internal.http.pipeline.stages.RetryableStage.execute(RetryableStage.java:86)	at software.amazon.awssdk.core.internal.http.pipeline.stages.RetryableStage.execute(RetryableStage.java:39)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.StreamManagingStage.execute(StreamManagingStage.java:53)	at software.amazon.awssdk.core.internal.http.StreamManagingStage.execute(StreamManagingStage.java:35)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.executeWithTimer(ApiCallTimeoutTrackingStage.java:82)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.execute(ApiCallTimeoutTrackingStage.java:62)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ApiCallTimeoutTrackingStage.execute(ApiCallTimeoutTrackingStage.java:43)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.pipeline.RequestPipelineBuilder$ComposingRequestPipelineStage.execute(RequestPipelineBuilder.java:206)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ExecutionFailureExceptionReportingStage.execute(ExecutionFailureExceptionReportingStage.java:37)	at software.amazon.awssdk.core.internal.http.pipeline.stages.ExecutionFailureExceptionReportingStage.execute(ExecutionFailureExceptionReportingStage.java:26)	at software.amazon.awssdk.core.internal.http.AmazonSyncHttpClient$RequestExecutionBuilderImpl.execute(AmazonSyncHttpClient.java:213)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.invoke(BaseSyncClientHandler.java:105)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.doExecute(BaseSyncClientHandler.java:176)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.lambda$execute$1(BaseSyncClientHandler.java:82)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.measureApiCall(BaseSyncClientHandler.java:200)	at software.amazon.awssdk.core.internal.handler.BaseSyncClientHandler.execute(BaseSyncClientHandler.java:76)	at software.amazon.awssdk.core.client.handler.SdkSyncClientHandler.execute(SdkSyncClientHandler.java:45)	at software.amazon.awssdk.awscore.client.handler.AwsSyncClientHandler.execute(AwsSyncClientHandler.java:53)	at software.amazon.awssdk.services.s3.DefaultS3Client.putObject(DefaultS3Client.java:13463)	at com.voltix.Mdm.main(Mdm.java:115)`,
        instances: {
          "MDM São Paulo": ["mdm-1", "mdm-2", "mdm-3"]
        }
      }
    ]
  }

  response.chart.historic = LEGEND.map(
    _ => {
      const legendData = []
      for (let i = 0; i < TOTAL; i++)
        legendData.push(Math.round(2 + Math.random() * (14 - 2)))

      return legendData
    }
  )

  return response
}