/**
 * Soller Analytics Charts System
 * Sistema completo de visualização de dados com Chart.js
 */

class SollerAnalytics {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6',
            dark: '#1f2937',
            light: '#f3f4f6'
        };
        
        this.gradients = {};
        this.currentPeriod = '30days';
        this.currentMetric = 'reach';
        this.data = window.mockData;
    }

    init() {
        // Configurações globais do Chart.js
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = '#6b7280';
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 24, 39, 0.95)';
        Chart.defaults.plugins.tooltip.titleColor = '#f3f4f6';
        Chart.defaults.plugins.tooltip.bodyColor = '#d1d5db';
        Chart.defaults.plugins.tooltip.borderColor = '#374151';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 15;
        
        // Inicializar todos os gráficos
        this.initPerformanceChart();
        this.initCategoryChart();
        this.initContentChart();
        this.initEngagementHeatmap();
        this.initROITrendChart();
        this.initInfluencerPerformanceChart();
        this.initConversionFunnelChart();
        this.initRealtimeMetrics();
    }

    // Criar gradientes para os gráficos
    createGradient(ctx, color1, color2, opacity = 0.1) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color1 + Math.round(opacity * 255).toString(16));
        gradient.addColorStop(1, color2 + '00');
        return gradient;
    }

    // 1. GRÁFICO DE EVOLUÇÃO DE PERFORMANCE
    initPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;

        const chartCtx = ctx.getContext('2d');
        
        // Criar gradientes
        const reachGradient = this.createGradient(chartCtx, this.chartColors.primary, this.chartColors.primary, 0.3);
        const engagementGradient = this.createGradient(chartCtx, this.chartColors.success, this.chartColors.success, 0.3);
        const roiGradient = this.createGradient(chartCtx, this.chartColors.warning, this.chartColors.warning, 0.3);

        // Dados do mockData
        const monthlyData = this.data.analytics.monthly;

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [
                    {
                        label: 'Alcance',
                        data: monthlyData.map(d => d.reach),
                        borderColor: this.chartColors.primary,
                        backgroundColor: reachGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.primary,
                        pointBorderWidth: 2,
                        yAxisID: 'y-reach',
                        hidden: false
                    },
                    {
                        label: 'Engajamento (%)',
                        data: monthlyData.map(d => d.engagement * 10000), // Escala para visualização
                        borderColor: this.chartColors.success,
                        backgroundColor: engagementGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.success,
                        pointBorderWidth: 2,
                        yAxisID: 'y-engagement',
                        hidden: true
                    },
                    {
                        label: 'ROI',
                        data: monthlyData.map(d => d.roi * 100000), // Escala para visualização
                        borderColor: this.chartColors.warning,
                        backgroundColor: roiGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.warning,
                        pointBorderWidth: 2,
                        yAxisID: 'y-roi',
                        hidden: true
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
                        display: false // Controlado pelos botões customizados
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label === 'Alcance') {
                                    label += new Intl.NumberFormat('pt-BR').format(context.parsed.y);
                                } else if (context.dataset.label === 'Engajamento (%)') {
                                    label += (context.parsed.y / 10000).toFixed(1) + '%';
                                } else if (context.dataset.label === 'ROI') {
                                    label += (context.parsed.y / 100000).toFixed(1) + 'x';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
                    },
                    'y-reach': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    notation: 'compact',
                                    compactDisplay: 'short'
                                }).format(value);
                            }
                        }
                    },
                    'y-engagement': {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    'y-roi': {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });

        // Adicionar event listeners aos botões de controle
        this.setupPerformanceControls();
    }

    // 2. GRÁFICO DE PERFORMANCE POR CATEGORIA
    initCategoryChart() {
        const ctx = document.getElementById('category-chart');
        if (!ctx) return;

        const categoryData = this.data.analytics.byCategory;

        this.charts.category = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryData.map(d => d.category),
                datasets: [
                    {
                        label: 'Investimento (R$)',
                        data: categoryData.map(d => d.investment),
                        backgroundColor: this.chartColors.primary,
                        borderRadius: 8,
                        yAxisID: 'y-investment'
                    },
                    {
                        label: 'ROI',
                        data: categoryData.map(d => d.roi),
                        type: 'line',
                        borderColor: this.chartColors.warning,
                        backgroundColor: this.chartColors.warning + '20',
                        borderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.warning,
                        pointBorderWidth: 2,
                        yAxisID: 'y-roi'
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
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label === 'Investimento (R$)') {
                                    label += 'R$ ' + new Intl.NumberFormat('pt-BR').format(context.parsed.y);
                                } else {
                                    label += context.parsed.y.toFixed(1) + 'x';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    'y-investment': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000) + 'k';
                            }
                        }
                    },
                    'y-roi': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + 'x';
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. GRÁFICO DE DISTRIBUIÇÃO DE CONTEÚDO
    initContentChart() {
        const ctx = document.getElementById('content-chart');
        if (!ctx) return;

        const contentData = this.data.analytics.contentPerformance;
        
        // Cores personalizadas para cada tipo de conteúdo
        const colors = [
            this.chartColors.primary,
            this.chartColors.secondary,
            this.chartColors.success,
            this.chartColors.warning
        ];

        this.charts.content = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: contentData.map(d => d.type),
                datasets: [{
                    data: contentData.map(d => d.count),
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const item = contentData[context.dataIndex];
                                return [
                                    `${item.type}: ${item.count} posts`,
                                    `Média de views: ${new Intl.NumberFormat('pt-BR').format(item.avgViews)}`,
                                    `Engajamento: ${item.avgEngagement}%`
                                ];
                            }
                        }
                    }
                }
            }
        });

        // Adicionar texto central
        this.addCenterText(ctx, contentData.reduce((sum, item) => sum + item.count, 0) + ' Posts');
    }

    // 4. HEATMAP DE ENGAJAMENTO POR HORA/DIA
    initEngagementHeatmap() {
        const container = document.querySelector('.analytics-charts');
        if (!container) return;

        // Adicionar novo container para o heatmap
        const heatmapSection = document.createElement('div');
        heatmapSection.className = 'chart-container large';
        heatmapSection.innerHTML = `
            <div class="chart-header">
                <h3>Mapa de Calor - Engajamento</h3>
                <div class="chart-controls">
                    <button class="chart-btn active" onclick="analytics.toggleHeatmapView('hourly')">Por Hora</button>
                    <button class="chart-btn" onclick="analytics.toggleHeatmapView('daily')">Por Dia</button>
                </div>
            </div>
            <canvas id="heatmap-chart" height="200"></canvas>
        `;
        container.appendChild(heatmapSection);

        // Gerar dados simulados de heatmap
        const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        const heatmapData = [];
        days.forEach((day, dayIndex) => {
            hours.forEach((hour, hourIndex) => {
                heatmapData.push({
                    x: hourIndex,
                    y: dayIndex,
                    v: Math.floor(Math.random() * 100) + 20 // Valor simulado de engajamento
                });
            });
        });

        const ctx = document.getElementById('heatmap-chart');
        if (!ctx) return;

        this.charts.heatmap = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Engajamento',
                    data: heatmapData,
                    backgroundColor: (context) => {
                        const value = context.raw.v;
                        const alpha = value / 120; // Normalizar para 0-1
                        return `rgba(99, 102, 241, ${alpha})`;
                    },
                    pointRadius: 15,
                    pointHoverRadius: 17
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -0.5,
                        max: 23.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return hours[value] || '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: 'linear',
                        min: -0.5,
                        max: 6.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return days[value] || '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const item = context[0];
                                return `${days[item.raw.y]}, ${hours[item.raw.x]}`;
                            },
                            label: function(context) {
                                return `Engajamento: ${context.raw.v}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 5. GRÁFICO DE TENDÊNCIA DE ROI
    initROITrendChart() {
        const container = document.querySelector('.analytics-charts');
        if (!container) return;

        const roiSection = document.createElement('div');
        roiSection.className = 'chart-container';
        roiSection.innerHTML = `
            <div class="chart-header">
                <h3>Tendência de ROI</h3>
                <span class="chart-badge success">+15% vs mês anterior</span>
            </div>
            <canvas id="roi-trend-chart" height="250"></canvas>
        `;
        container.appendChild(roiSection);

        const ctx = document.getElementById('roi-trend-chart');
        if (!ctx) return;

        // Dados de ROI com previsão
        const historicalROI = this.data.analytics.monthly.map(d => d.roi);
        const forecast = [5.5, 5.8, 6.1]; // Previsão para próximos 3 meses
        
        const allLabels = [...this.data.analytics.monthly.map(d => d.month), 'Jul', 'Ago', 'Set'];
        const allData = [...historicalROI, ...Array(3).fill(null)];
        const forecastData = [...Array(historicalROI.length).fill(null), historicalROI[historicalROI.length - 1], ...forecast];

        this.charts.roiTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: [
                    {
                        label: 'ROI Histórico',
                        data: allData,
                        borderColor: this.chartColors.success,
                        backgroundColor: this.chartColors.success + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.success,
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Previsão',
                        data: forecastData,
                        borderColor: this.chartColors.info,
                        backgroundColor: this.chartColors.info + '10',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.info,
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.parsed.y !== null) {
                                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + 'x';
                                }
                                return null;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            targetLine: {
                                type: 'line',
                                yMin: 4.0,
                                yMax: 4.0,
                                borderColor: this.chartColors.danger,
                                borderWidth: 2,
                                borderDash: [10, 5],
                                label: {
                                    content: 'Meta: 4.0x',
                                    enabled: true,
                                    position: 'start'
                                }
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
                                return value + 'x';
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
    }

    // 6. GRÁFICO DE PERFORMANCE DOS INFLUENCIADORES
    initInfluencerPerformanceChart() {
        const container = document.querySelector('.analytics-charts');
        if (!container) return;

        const perfSection = document.createElement('div');
        perfSection.className = 'chart-container';
        perfSection.innerHTML = `
            <div class="chart-header">
                <h3>Top Influenciadores - Performance</h3>
            </div>
            <canvas id="influencer-performance-chart" height="250"></canvas>
        `;
        container.appendChild(perfSection);

        const ctx = document.getElementById('influencer-performance-chart');
        if (!ctx) return;

        const topPerformers = this.data.analytics.topPerformers;

        this.charts.influencerPerf = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Alcance', 'Engajamento', 'ROI', 'Conversão', 'Frequência'],
                datasets: topPerformers.map((performer, index) => ({
                    label: performer.influencer,
                    data: [
                        (performer.totalReach / 3000000) * 100, // Normalizado para 100
                        performer.avgROI * 20, // Escala ROI
                        Math.random() * 100, // Dados simulados
                        Math.random() * 100,
                        performer.campaigns * 15
                    ],
                    borderColor: [this.chartColors.primary, this.chartColors.secondary, this.chartColors.success][index],
                    backgroundColor: [this.chartColors.primary, this.chartColors.secondary, this.chartColors.success][index] + '20',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // 7. FUNIL DE CONVERSÃO
    initConversionFunnelChart() {
        const container = document.querySelector('.analytics-tables');
        if (!container) return;

        const funnelSection = document.createElement('div');
        funnelSection.className = 'chart-container';
        funnelSection.innerHTML = `
            <div class="chart-header">
                <h3>Funil de Conversão</h3>
            </div>
            <canvas id="funnel-chart" height="300"></canvas>
        `;
        container.insertBefore(funnelSection, container.firstChild);

        const ctx = document.getElementById('funnel-chart');
        if (!ctx) return;

        const funnelData = [
            { stage: 'Impressões', value: 2400000, color: this.chartColors.info },
            { stage: 'Cliques', value: 320000, color: this.chartColors.primary },
            { stage: 'Visitas', value: 85000, color: this.chartColors.secondary },
            { stage: 'Leads', value: 12000, color: this.chartColors.warning },
            { stage: 'Conversões', value: 5420, color: this.chartColors.success }
        ];

        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: funnelData.map(d => d.stage),
                datasets: [{
                    data: funnelData.map(d => d.value),
                    backgroundColor: funnelData.map(d => d.color),
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                const percentage = ((value / funnelData[0].value) * 100).toFixed(1);
                                return [
                                    new Intl.NumberFormat('pt-BR').format(value),
                                    `${percentage}% do total`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    notation: 'compact',
                                    compactDisplay: 'short'
                                }).format(value);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // 8. MÉTRICAS EM TEMPO REAL (Mini Sparklines)
    initRealtimeMetrics() {
        const container = document.querySelector('.analytics-summary');
        if (!container) return;

        // Adicionar mini gráficos aos cards de resumo
        const summaryCards = container.querySelectorAll('.summary-card');
        
        summaryCards.forEach((card, index) => {
            const sparklineContainer = document.createElement('div');
            sparklineContainer.className = 'sparkline-container';
            sparklineContainer.innerHTML = `<canvas id="sparkline-${index}" height="40"></canvas>`;
            card.querySelector('.summary-content').appendChild(sparklineContainer);

            const ctx = document.getElementById(`sparkline-${index}`);
            if (!ctx) return;

            // Gerar dados aleatórios para sparkline
            const sparklineData = Array.from({length: 7}, () => Math.random() * 100 + 50);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 7}, (_, i) => ''),
                    datasets: [{
                        data: sparklineData,
                        borderColor: this.chartColors.primary,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    interaction: { mode: null }
                }
            });
        });
    }

    // FUNÇÕES AUXILIARES

    setupPerformanceControls() {
        const controls = document.querySelectorAll('.chart-controls .chart-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                controls.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const metric = e.target.textContent.toLowerCase();
                this.updatePerformanceChart(metric);
            });
        });
    }

    updatePerformanceChart(metric) {
        const chart = this.charts.performance;
        if (!chart) return;

        // Resetar visibilidade dos datasets
        chart.data.datasets.forEach((dataset, index) => {
            if (metric === 'alcance' && index === 0) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = true;
                chart.options.scales['y-engagement'].display = false;
                chart.options.scales['y-roi'].display = false;
            } else if (metric === 'engajamento' && index === 1) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = false;
                chart.options.scales['y-engagement'].display = true;
                chart.options.scales['y-roi'].display = false;
            } else if (metric === 'roi' && index === 2) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = false;
                chart.options.scales['y-engagement'].display = false;
                chart.options.scales['y-roi'].display = true;
            } else {
                dataset.hidden = true;
            }
        });

        chart.update();
    }

    toggleHeatmapView(view) {
        // Implementar toggle entre visualização por hora e por dia
        const buttons = document.querySelectorAll('#heatmap-chart').closest('.chart-container').querySelectorAll('.chart-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(view === 'hourly' ? 'hora' : 'dia')) {
                btn.classList.add('active');
            }
        });

        // Atualizar dados do heatmap baseado na view
        this.updateHeatmapData(view);
    }

    updateHeatmapData(view) {
        const chart = this.charts.heatmap;
        if (!chart) return;

        // Gerar novos dados baseados na view
        const newData = [];
        const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        if (view === 'hourly') {
            days.forEach((day, dayIndex) => {
                hours.forEach((hour, hourIndex) => {
                    newData.push({
                        x: hourIndex,
                        y: dayIndex,
                        v: Math.floor(Math.random() * 100) + 20 // Valor simulado
                    });
                });
            });
            chart.options.scales.x.ticks.callback = (value) => hours[value] || '';
            chart.options.scales.y.ticks.callback = (value) => days[value] || '';
            chart.options.scales.x.max = 23.5;
            chart.options.scales.y.max = 6.5;
        } else { // view === 'daily'
            const dailyData = days.map((day, dayIndex) => ({
                x: dayIndex,
                y: 0, // Alinhar na mesma linha para visualização diária
                v: Math.floor(Math.random() * 200) + 50 // Valor simulado mais alto
            }));
            dailyData.forEach(d => newData.push(d));

            chart.options.scales.x.ticks.callback = (value) => days[value] || '';
            chart.options.scales.y.ticks.callback = (value) => ''; // Sem labels no eixo Y
            chart.options.scales.x.max = 6.5;
            chart.options.scales.y.max = 0.5;
        }

        chart.data.datasets[0].data = newData;
        chart.update();

        // Atualizar botões
        const buttons = document.querySelectorAll('.chart-container.large .chart-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.chart-btn[onclick*="toggleHeatmapView('${view}')"]`).classList.add('active');
    }

    // 5. GRÁFICO DE TENDÊNCIA DE ROI
    initROITrendChart() {
        const container = document.querySelector('.analytics-charts');
        if (!container) return;

        const roiSection = document.createElement('div');
        roiSection.className = 'chart-container';
        roiSection.innerHTML = `
            <div class="chart-header">
                <h3>Tendência de ROI</h3>
                <span class="chart-badge success">+15% vs mês anterior</span>
            </div>
            <canvas id="roi-trend-chart" height="250"></canvas>
        `;
        container.appendChild(roiSection);

        const ctx = document.getElementById('roi-trend-chart');
        if (!ctx) return;

        // Dados de ROI com previsão
        const historicalROI = this.data.analytics.monthly.map(d => d.roi);
        const forecast = [5.5, 5.8, 6.1]; // Previsão para próximos 3 meses
        
        const allLabels = [...this.data.analytics.monthly.map(d => d.month), 'Jul', 'Ago', 'Set'];
        const allData = [...historicalROI, ...Array(3).fill(null)];
        const forecastData = [...Array(historicalROI.length).fill(null), historicalROI[historicalROI.length - 1], ...forecast];

        this.charts.roiTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: [
                    {
                        label: 'ROI Histórico',
                        data: allData,
                        borderColor: this.chartColors.success,
                        backgroundColor: this.chartColors.success + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.success,
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Previsão',
                        data: forecastData,
                        borderColor: this.chartColors.info,
                        backgroundColor: this.chartColors.info + '10',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: this.chartColors.info,
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.parsed.y !== null) {
                                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + 'x';
                                }
                                return null;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            targetLine: {
                                type: 'line',
                                yMin: 4.0,
                                yMax: 4.0,
                                borderColor: this.chartColors.danger,
                                borderWidth: 2,
                                borderDash: [10, 5],
                                label: {
                                    content: 'Meta: 4.0x',
                                    enabled: true,
                                    position: 'start'
                                }
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
                                return value + 'x';
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
    }

    // 6. GRÁFICO DE PERFORMANCE DOS INFLUENCIADORES
    initInfluencerPerformanceChart() {
        const container = document.querySelector('.analytics-charts');
        if (!container) return;

        const perfSection = document.createElement('div');
        perfSection.className = 'chart-container';
        perfSection.innerHTML = `
            <div class="chart-header">
                <h3>Top Influenciadores - Performance</h3>
            </div>
            <canvas id="influencer-performance-chart" height="250"></canvas>
        `;
        container.appendChild(perfSection);

        const ctx = document.getElementById('influencer-performance-chart');
        if (!ctx) return;

        const topPerformers = this.data.analytics.topPerformers;

        this.charts.influencerPerf = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Alcance', 'Engajamento', 'ROI', 'Conversão', 'Frequência'],
                datasets: topPerformers.map((performer, index) => ({
                    label: performer.influencer,
                    data: [
                        (performer.totalReach / 3000000) * 100, // Normalizado para 100
                        performer.avgROI * 20, // Escala ROI
                        Math.random() * 100, // Dados simulados
                        Math.random() * 100,
                        performer.campaigns * 15
                    ],
                    borderColor: [this.chartColors.primary, this.chartColors.secondary, this.chartColors.success][index],
                    backgroundColor: [this.chartColors.primary, this.chartColors.secondary, this.chartColors.success][index] + '20',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // 7. FUNIL DE CONVERSÃO
    initConversionFunnelChart() {
        const container = document.querySelector('.analytics-tables');
        if (!container) return;

        const funnelSection = document.createElement('div');
        funnelSection.className = 'chart-container';
        funnelSection.innerHTML = `
            <div class="chart-header">
                <h3>Funil de Conversão</h3>
            </div>
            <canvas id="funnel-chart" height="300"></canvas>
        `;
        container.insertBefore(funnelSection, container.firstChild);

        const ctx = document.getElementById('funnel-chart');
        if (!ctx) return;

        const funnelData = [
            { stage: 'Impressões', value: 2400000, color: this.chartColors.info },
            { stage: 'Cliques', value: 320000, color: this.chartColors.primary },
            { stage: 'Visitas', value: 85000, color: this.chartColors.secondary },
            { stage: 'Leads', value: 12000, color: this.chartColors.warning },
            { stage: 'Conversões', value: 5420, color: this.chartColors.success }
        ];

        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: funnelData.map(d => d.stage),
                datasets: [{
                    data: funnelData.map(d => d.value),
                    backgroundColor: funnelData.map(d => d.color),
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                const percentage = ((value / funnelData[0].value) * 100).toFixed(1);
                                return [
                                    new Intl.NumberFormat('pt-BR').format(value),
                                    `${percentage}% do total`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    notation: 'compact',
                                    compactDisplay: 'short'
                                }).format(value);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // 8. MÉTRICAS EM TEMPO REAL (Mini Sparklines)
    initRealtimeMetrics() {
        const container = document.querySelector('.analytics-summary');
        if (!container) return;

        // Adicionar mini gráficos aos cards de resumo
        const summaryCards = container.querySelectorAll('.summary-card');
        
        summaryCards.forEach((card, index) => {
            const sparklineContainer = document.createElement('div');
            sparklineContainer.className = 'sparkline-container';
            sparklineContainer.innerHTML = `<canvas id="sparkline-${index}" height="40"></canvas>`;
            card.querySelector('.summary-content').appendChild(sparklineContainer);

            const ctx = document.getElementById(`sparkline-${index}`);
            if (!ctx) return;

            // Gerar dados aleatórios para sparkline
            const sparklineData = Array.from({length: 7}, () => Math.random() * 100 + 50);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 7}, (_, i) => ''),
                    datasets: [{
                        data: sparklineData,
                        borderColor: this.chartColors.primary,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    interaction: { mode: null }
                }
            });
        });
    }

    // FUNÇÕES AUXILIARES

    setupPerformanceControls() {
        const controls = document.querySelectorAll('.chart-controls .chart-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                controls.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const metric = e.target.textContent.toLowerCase();
                this.updatePerformanceChart(metric);
            });
        });
    }

    updatePerformanceChart(metric) {
        const chart = this.charts.performance;
        if (!chart) return;

        // Resetar visibilidade dos datasets
        chart.data.datasets.forEach((dataset, index) => {
            if (metric === 'alcance' && index === 0) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = true;
                chart.options.scales['y-engagement'].display = false;
                chart.options.scales['y-roi'].display = false;
            } else if (metric === 'engajamento' && index === 1) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = false;
                chart.options.scales['y-engagement'].display = true;
                chart.options.scales['y-roi'].display = false;
            } else if (metric === 'roi' && index === 2) {
                dataset.hidden = false;
                chart.options.scales['y-reach'].display = false;
                chart.options.scales['y-engagement'].display = false;
                chart.options.scales['y-roi'].display = true;
            } else {
                dataset.hidden = true;
            }
        });

        chart.update();
    }
}
