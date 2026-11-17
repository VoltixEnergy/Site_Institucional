document.addEventListener("DOMContentLoaded", function () {
    const configComum = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: window.devicePixelRatio *  2,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 16,
                    color: '#111827',
                    font: {
                        family: "'Exo 2', sans-serif",
                        size: 11,
                        weight: '700'
                    }
                }
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#111827',
                    font: {
                        family: "'Exo 2', sans-serif",
                        size: 12,
                        weight: '700'
                    }
                }
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.45)'
                },
                ticks: {
                    color: '#111827',
                    font: {
                        family: "'Exo 2', sans-serif",
                        size: 12,
                        weight: '700'
                    }
                }
            }
        }
    };

    // Gráfico 1: Hardware
    const ctxHardware = document.getElementById('graficoHardware').getContext('2d');
    new Chart(ctxHardware, {
        type: 'bar',
        data: {
            labels: ['CPU', 'RAM', 'Disco'],
            datasets: [
                {
                    label: 'Penúltima',
                    data: [45, 57, 57],
                    backgroundColor: '#3b71f3',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    barPercentage: 0.75,
                    categoryPercentage: 0.75
                },
                {
                    label: 'Atual',
                    data: [69, 70, 78],
                    backgroundColor: '#a78bfa',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    barPercentage: 0.75,
                    categoryPercentage: 0.75
                }
            ]
        },
        options: {
            ...configComum,
            scales: {
                ...configComum.scales,
                y: {
                    ...configComum.scales.y,
                    max: 85,
                    ticks: {
                        ...configComum.scales.y.ticks,
                        stepSize: 20
                    }
                }
            }
        }
    });

    // Gráfico 2: Rede
    const ctxRede = document.getElementById('graficoRede').getContext('2d');
    new Chart(ctxRede, {
        type: 'bar',
        data: {
            labels: ['Perda de pacotes', 'Rede Recebida', 'Rede Enviada'],
            datasets: [
                {
                    label: 'Penúltima',
                    data: [30, 110, 90],
                    backgroundColor: '#3b71f3',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    barPercentage: 0.75,
                    categoryPercentage: 0.75
                },
                {
                    label: 'Atual',
                    data: [25, 120, 85],
                    backgroundColor: '#a78bfa',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    barPercentage: 0.75,
                    categoryPercentage: 0.75
                }
            ]
        },
        options: {
            ...configComum,
            scales: {
                ...configComum.scales,
                y: {
                    ...configComum.scales.y,
                    max: 125,
                    ticks: {
                        ...configComum.scales.y.ticks,
                        stepSize: 20
                    }
                }
            }
        }
    });
});