const ForecastCharts = {
    instances: {},
    
    colors: {
        primary: '#7c3aed',
        success: '#0ea846',
        warning: '#f59e0b',
        danger: '#dc2626',
        info: '#3b82f6',
        gray: '#6c6c6cff',
        purple: '#8b5cf6',
        pink: '#ec4899',
        teal: '#10b981',
        indigo: '#6366f1'
    },
    
    projectionData: null,
    currentMonth: 23,
    
    init(projections) {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está carregado');
            return false;
        }
        
        this.projectionData = projections;
        
        this.createMainProjectionChart(projections);
        this.createContributionChart(projections);
        this.createCompositionChart(projections, 23);
        this.createValuationChart(projections);
        
        return true;
    },
    
    createMainProjectionChart(projections) {
        const canvas = document.getElementById('mainProjectionChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.instances.mainChart) {
            this.instances.mainChart.destroy();
        }
        
        this.instances.mainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: projections.months,
                datasets: [
                    {
                        label: 'GMV',
                        data: projections.gmv,
                        borderColor: this.colors.primary,
                        backgroundColor: this.hexToRgba(this.colors.primary, 0.1),
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Valor Soller',
                        data: projections.valorSoller,
                        borderColor: this.colors.success,
                        backgroundColor: this.hexToRgba(this.colors.success, 0.1),
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            },
                            color: '#6c6c6cff'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += ForecastCharts.formatCurrency(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return ForecastCharts.formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    createValuationChart(projections) {
    const canvas = document.getElementById('valuationEvolutionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (this.instances.valuationChart) {
        this.instances.valuationChart.destroy();
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, this.hexToRgba(this.colors.primary, 0.3));
    gradient.addColorStop(1, this.hexToRgba(this.colors.primary, 0.01));
    
    this.instances.valuationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: projections.months,
            datasets: [{
                label: 'Valuation Estimado',
                data: projections.valuation,
                borderColor: this.colors.primary,
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = 'Valuation: ' + this.formatCurrency(context.parsed.y);
                            
                            const monthIndex = context.dataIndex;
                            const valorSoller = projections.valorSoller[monthIndex];
                            if (valorSoller > 0) {
                                const annualizedRevenue = valorSoller * 12;
                                const multiple = context.parsed.y / annualizedRevenue;
                                label += ` (${multiple.toFixed(1)}x revenue)`;
                            }
                            
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => this.formatCurrency(value)
                    }
                }
            }
        }
    });
},
    
    // Função original de createContributionChart no arquivo projection-charts.js
createContributionChart(projections) {
    const canvas = document.getElementById('gatilhosImpactChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.instances.contributionChart) {
        this.instances.contributionChart.destroy();
    }

    const contributions = projections.contributionByInitiative || {};

    // Removido o array datasets fixo. Agora será construído dinamicamente.
    const datasets = [];

    // Mapeamento de cores e labels para cada iniciativa
    const initiativeMap = {
        'baseline': { label: 'Base', color: this.colors.gray },
        'techStack': { label: 'Tech Stack', color: this.colors.info },
        'customerSuccess': { label: 'Customer Success', color: this.colors.success },
        'marketplace': { label: 'Marketplace', color: this.colors.purple },
        'microinfluencers': { label: 'Microinfluencers', color: this.colors.warning },
        'international': { label: 'Enterprise & LatAm', color: this.colors.danger }
    };
    
    // Itera sobre o mapa de iniciativas para criar os datasets
    for (const key in initiativeMap) {
        if (contributions[key] && contributions[key].some(value => value > 0)) {
            const config = initiativeMap[key];
            datasets.push({
                label: config.label,
                data: contributions[key],
                backgroundColor: this.hexToRgba(config.color, 0.5),
                borderColor: config.color,
                borderWidth: 2
            });
        }
    }

    // A criação do gráfico agora usa o array 'datasets' construído dinamicamente
    this.instances.contributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projections.months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return ForecastCharts.formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        },
                        color: '#6c6c6cff'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = ForecastCharts.formatCurrency(context.parsed.y);
                            return label + value;
                        },
                        afterLabel: function(context) {
                            const total = context.chart.data.datasets.reduce((sum, dataset) => {
                                return sum + (dataset.data[context.dataIndex] || 0);
                            }, 0);
                            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
                            return `${percentage}% do total`;
                        }
                    }
                }
            }
        }
    });
},
    
    createCompositionChart(projections, monthIndex = 23) {
        const canvas = document.getElementById('compositionChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.instances.compositionChart) {
            this.instances.compositionChart.destroy();
        }
        
        this.currentMonth = monthIndex;
        const contributions = projections.contributionByInitiative || {};
        
        const techStackValue = (contributions.techStack?.[monthIndex] || 0);
        
        const data = {
            labels: ['Base', 'Tech Stack', 'Customer Success', 'Marketplace', 'Microinfluencers', 'Enterprise & LatAm'],
            values: [
                contributions.baseline?.[monthIndex] || 0,
                techStackValue,
                contributions.customerSuccess?.[monthIndex] || 0,
                contributions.marketplace?.[monthIndex] || 0,
                contributions.microinfluencers?.[monthIndex] || 0,
                contributions.international?.[monthIndex] || 0
            ]
        };
        
        const filteredData = {
            labels: [],
            values: []
        };
        
        data.labels.forEach((label, i) => {
            if (data.values[i] > 0) {
                filteredData.labels.push(label);
                filteredData.values.push(data.values[i]);
            }
        });
        
        this.instances.compositionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: filteredData.labels,
                datasets: [{
                    data: filteredData.values,
                    backgroundColor: [
                        this.hexToRgba(this.colors.gray, 0.7),
                        this.hexToRgba(this.colors.info, 0.7),
                        this.hexToRgba(this.colors.success, 0.7),
                        this.hexToRgba(this.colors.purple, 0.7),
                        this.hexToRgba(this.colors.warning, 0.7),
                        this.hexToRgba(this.colors.danger, 0.7)
                    ],
                    borderColor: [
                        this.colors.gray,
                        this.colors.info,
                        this.colors.success,
                        this.colors.purple,
                        this.colors.warning,
                        this.colors.danger
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            },
                            color: '#6c6c6cff'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = ForecastCharts.formatCurrency(context.parsed);
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    },
    
    updateCompositionChart(monthIndex) {
        if (!this.projectionData) return;
        this.createCompositionChart(this.projectionData, monthIndex);
    },
    
    updateAll(projections) {
        this.projectionData = projections;
        this.createMainProjectionChart(projections);
        this.createContributionChart(projections);
        this.createCompositionChart(projections, this.currentMonth);
        this.createValuationChart(projections); 
    },
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    
    formatCurrency(value) {
        if (!value || isNaN(value)) return 'R$ 0';
        
        if (value >= 1000000000) {
            return `R$ ${(value / 1000000000).toFixed(1)}B`;
        } else if (value >= 1000000) {
            return `R$ ${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(0)}K`;
        } else {
            return `R$ ${value.toFixed(0)}`;
        }
    },
    
    destroyAll() {
        Object.values(this.instances).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.instances = {};
    }
};

window.ForecastCharts = ForecastCharts;