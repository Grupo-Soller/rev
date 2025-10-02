let projectionCalculator = null;
let customPanelOpen = false;
let recalcDebounceTimer = null;
let monteCarloInterval = null;
let lastSimulatedParams = null;

function getRandomValueAroundPercentile(arr, percentile, range) {
    const pIndex = Math.floor(arr.length * (percentile / 100));
    const startRange = Math.max(0, pIndex - Math.floor(arr.length * (range / 100)));
    const endRange = Math.min(arr.length - 1, pIndex + Math.floor(arr.length * (range / 100)));
    
    const randomIndex = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
    return arr[randomIndex];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedRecalculate = debounce(() => {
    recalculateProjections();
}, 300);

window.initializeForecastSection = function() {
    if (typeof window.initializeProjectionsCalculator === 'function') {
        window.initializeProjectionsCalculator();
    }
};

window.initializeProjectionsCalculator = function() {
    if (typeof window.SollerProjections === 'undefined') {
        setTimeout(initializeProjectionsCalculator, 1000);
        return;
    }
    
    projectionCalculator = new window.SollerProjections();
    window.projectionCalculator = projectionCalculator;
    
    initializeControls();
    loadScenario('realista');
    
    setTimeout(() => {
        if (window.ForecastCharts) {
            const projections = projectionCalculator.calculateProjections();
            window.ForecastCharts.init(projections);
        }
        recalculateProjections();
    }, 100);
};

window.toggleCustomPanel = function() {
    const modal = document.getElementById('customPanelModal');
    if (!modal) return;
    
    customPanelOpen = !customPanelOpen;
    
    if (customPanelOpen) {
        modal.classList.add('active');
        
        const floatingBtn = document.querySelector('.floating-settings-button');
        if (floatingBtn) {
            floatingBtn.classList.add('active');
        }
        
        // Adicionar listeners para o modal
        modal.addEventListener('click', handleModalOutsideClick);
        
        // NOVO: Adicionar listeners para manter o modal visível no hover
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            floatingBtn.addEventListener('mouseenter', function() {
                modalContent.classList.remove('transparent');
            });
            floatingBtn.addEventListener('mouseleave', function() {
                // Apenas torna transparente se o mouse não estiver sobre o modal
                if (!modalContent.matches(':hover')) {
                    modalContent.classList.add('transparent');
                }
            });

            // Adicionar listener no conteúdo do modal para garantir visibilidade
            modalContent.addEventListener('mouseenter', function() {
                modalContent.classList.remove('transparent');
            });
            modalContent.addEventListener('mouseleave', function() {
                // Apenas torna transparente se o mouse não estiver sobre o botão
                if (!floatingBtn.matches(':hover')) {
                    modalContent.classList.add('transparent');
                }
            });
        }

    } else {
        modal.classList.remove('active');
        
        const floatingBtn = document.querySelector('.floating-settings-button');
        if (floatingBtn) {
            floatingBtn.classList.remove('active');
        }
        
        // Remover listeners
        modal.removeEventListener('click', handleModalOutsideClick);
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            // Remover listeners do botão flutuante
            const floatingBtn = document.querySelector('.floating-settings-button');
            if (floatingBtn) {
                floatingBtn.removeEventListener('mouseenter', function() {});
                floatingBtn.removeEventListener('mouseleave', function() {});
            }
            // Remover listeners do conteúdo do modal
            modalContent.removeEventListener('mouseenter', function() {});
            modalContent.removeEventListener('mouseleave', function() {});
        }
    }
};

function handleModalOutsideClick(e) {
    if (e.target.id === 'customPanelModal') {
        toggleCustomPanel();
    }
}

function handleModalOutsideClick(e) {
    if (e.target.id === 'customPanelModal') {
        toggleCustomPanel();
    }
}

function handleModalMouseEnter(e) {
    e.currentTarget.classList.remove('transparent');
}

function handleModalMouseLeave(e) {
    const floatingBtn = document.querySelector('.floating-settings-button');
    if (!floatingBtn || !floatingBtn.matches(':hover')) {
        e.currentTarget.classList.add('transparent');
    }
}

window.toggleValuationModal = function() {
    const modal = document.getElementById('valuationModal');
    if (!modal) return;
    
    const isOpen = modal.classList.contains('active');
    
    if (!isOpen) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Criar gráfico de valuation no modal
        setTimeout(() => {
            if (projectionCalculator && projectionCalculator.projectionCache) {
                createValuationModalChart(projectionCalculator.projectionCache);
            }
        }, 100);
        
        // Adicionar listener para fechar ao clicar fora
        modal.addEventListener('click', handleValuationModalOutsideClick);
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Destruir gráfico se existir
        if (window.valuationModalChart && window.valuationModalChart.destroy) {
            window.valuationModalChart.destroy();
            window.valuationModalChart = null;
        }
        
        modal.removeEventListener('click', handleValuationModalOutsideClick);
    }
};

function handleValuationModalOutsideClick(e) {
    if (e.target.id === 'valuationModal') {
        toggleValuationModal();
    }
}

function updateMetricsTable(projections) {
    const metrics = projections.metrics;
    
    const updateCell = (id, value, format = 'currency') => {
        const element = document.getElementById(id);
        if (!element) return;
        
        if (format === 'currency') {
            element.textContent = formatCurrency(value || 0);
        } else if (format === 'percent') {
            element.textContent = `${(value || 0).toFixed(1)}%`;
        } else if (format === 'number') {
            element.textContent = Math.round(value || 0).toString();
        } else {
            element.textContent = value || '-';
        }
    };
    
    // GMV
    updateCell('gmvCurrent', projectionCalculator.currentState.gmvMensal);
    updateCell('gmv6m', metrics.gmv6m);
    updateCell('gmv12m', metrics.gmv12m);
    updateCell('gmv24m', metrics.gmv24m);
    
    // Margem
    updateCell('marginCurrent', projectionCalculator.currentState.margem, 'percent');
    updateCell('margin6m', projections.margin[5] || 0, 'percent');
    updateCell('margin12m', projections.margin[11] || 0, 'percent');
    updateCell('margin24m', projections.margin[23] || 0, 'percent');
    
    // ARR
    const currentARR = projectionCalculator.currentState.gmvMensal * 12;
    updateCell('arrCurrent', currentARR);
    updateCell('arr6m', (projections.gmv[5] || 0) * 12);
    updateCell('arr12m', (projections.gmv[11] || 0) * 12);
    updateCell('arr24m', (projections.gmv[23] || 0) * 12);
    
    // Contratos
    updateCell('contractsCurrent', projectionCalculator.currentState.contratosMes, 'number');
    updateCell('contracts6m', projections.contracts[5] || 0, 'number');
    updateCell('contracts12m', projections.contracts[11] || 0, 'number');
    updateCell('contracts24m', projections.contracts[23] || 0, 'number');
    
    // Churn
    updateCell('churnCurrent', projectionCalculator.currentState.churnRate, 'percent');
    updateCell('churn6m', projections.churn[5] || 0, 'percent');
    updateCell('churn12m', projections.churn[11] || 0, 'percent');
    updateCell('churn24m', projections.churn[23] || 0, 'percent');
    
    // Equipe
    updateCell('teamCurrent', projectionCalculator.currentState.equipe, 'number');
    updateCell('team6m', projections.team[5] || 0, 'number');
    updateCell('team12m', projections.team[11] || 0, 'number');
    updateCell('team24m', projections.team[23] || 0, 'number');
    
    // Capital de Giro
    updateCell('wcCurrent', 0);
    updateCell('wc6m', projections.workingCapital[5] || 0);
    updateCell('wc12m', projections.workingCapital[11] || 0);
    updateCell('wc24m', projections.workingCapital[23] || 0);
    
    // Influenciadores
    updateCell('influCurrent', projectionCalculator.currentState.influenciadores, 'number');
    updateCell('influ6m', projections.influenciadores ? projections.influenciadores[5] || 0 : 0, 'number');
    updateCell('influ12m', projections.influenciadores ? projections.influenciadores[11] || 0 : 0, 'number');
    updateCell('influ24m', projections.influenciadores ? projections.influenciadores[23] || 0 : 0, 'number');
    
    // Status Badges
    updateStatusBadges(projections);
}

function updateStatusBadges(projections) {
    const gmvGrowth = projections.metrics.gmvGrowth;
    const gmvStatus = document.getElementById('gmvStatus');
    if (gmvStatus) {
        if (gmvGrowth > 2) {
            gmvStatus.className = 'status-badge good';
            gmvStatus.textContent = 'Excelente';
        } else if (gmvGrowth > 0.8) {
            gmvStatus.className = 'status-badge warning';
            gmvStatus.textContent = 'Bom';
        } else {
            gmvStatus.className = 'status-badge critical';
            gmvStatus.textContent = 'Atenção';
        }
    }
    
    const finalChurn = projections.churn[23];
    const churnStatus = document.getElementById('churnStatus');
    if (churnStatus) {
        if (finalChurn < 30) {
            churnStatus.className = 'status-badge good';
            churnStatus.textContent = 'Ótimo';
        } else if (finalChurn < 45) {
            churnStatus.className = 'status-badge warning';
            churnStatus.textContent = 'Regular';
        } else {
            churnStatus.className = 'status-badge critical';
            churnStatus.textContent = 'Crítico';
        }
    }
    
    const finalMargin = projections.margin[23];
    const marginStatus = document.getElementById('marginStatus');
    if (marginStatus) {
        if (finalMargin > 26) {
            marginStatus.className = 'status-badge good';
            marginStatus.textContent = 'Meta';
        } else if (finalMargin > 23) {
            marginStatus.className = 'status-badge warning';
            marginStatus.textContent = 'Evolução';
        } else {
            marginStatus.className = 'status-badge critical';
            marginStatus.textContent = 'Abaixo';
        }
    }
}

function createValuationModalChart(projections) {
    const canvas = document.getElementById('valuationModalChart');
    if (!canvas) {
        console.error('Canvas do gráfico de valuation não encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    if (window.valuationModalChart && typeof window.valuationModalChart.destroy === 'function') {
        window.valuationModalChart.destroy();
    }
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado');
        return;
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.05)');
    
    window.valuationModalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: projections.months,
            datasets: [{
                label: 'Valuation',
                data: projections.valuation,
                borderColor: '#7c3aed',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return 'Valuation: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

window.loadScenario = function(scenarioType) {
    if (!projectionCalculator) {
        projectionCalculator = window.projectionCalculator || new window.SollerProjections();
    }
    
    document.querySelectorAll('.scenario-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (scenarioType !== 'custom') {
        const selectedTab = document.querySelector(`[data-scenario="${scenarioType}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }
    
    const scenarioNameElement = document.getElementById('scenarioName');
    if (scenarioNameElement) {
        const names = {
            'pessimista': 'Pessimista',
            'realista': 'Realista', 
            'otimista': 'Otimista',
            'custom': 'Personalizado'
        };
        scenarioNameElement.textContent = names[scenarioType] || 'Personalizado';
    }
    
    projectionCalculator.parameters.scenarioType = scenarioType;

    // Atualizar animação do botão
const floatingBtn = document.querySelector('.floating-settings-button');
if (floatingBtn) {
    if (scenarioType === 'custom') {
        floatingBtn.classList.add('custom-scenario');
    } else {
        floatingBtn.classList.remove('custom-scenario');
    }
}
    
    const scenarios = {
        pessimista: {
            churnRate: 55,
            ticketMedio: 16500,
            contratosMes: 175,
            margem: 16.0,
            equipeVendas: 12,
            crmImplementation: true,
            salesAutomation: true,
            customerSuccessTeam: false,
            marketplaceBeta: false,
            selfServicePlatform: false,
            mobileApp: false,
            microinfluencersProgram: false,
            marketplaceFull: false,
            saasRevenue: false,
            internationalExpansion: false,
            techInvestment: 100000,
            brandInvestment: 150000
        },
        realista: {
            churnRate: 45,
            ticketMedio: 19500,
            contratosMes: 180,
            margem: 19.5,
            equipeVendas: 25,
            crmImplementation: true,
            salesAutomation: false,
            customerSuccessTeam: true,
            marketplaceBeta: true,
            selfServicePlatform: false,
            mobileApp: false,
            microinfluencersProgram: true,
            marketplaceFull: false,
            saasRevenue: false,
            internationalExpansion: false,
            techInvestment: 500000,
            brandInvestment: 300000
        },
        conservador: {
            churnRate: 45,
            ticketMedio: 19500,
            contratosMes: 180,
            margem: 19.5,
            equipeVendas: 25,
            crmImplementation: true,
            salesAutomation: false,
            customerSuccessTeam: true,
            marketplaceBeta: true,
            selfServicePlatform: false,
            mobileApp: false,
            microinfluencersProgram: true,
            marketplaceFull: false,
            saasRevenue: false,
            internationalExpansion: false,
            techInvestment: 500000,
            brandInvestment: 300000
        },
        otimista: {
            churnRate: 35,
            ticketMedio: 19500,
            contratosMes: 185,
            margem: 20.0,
            equipeVendas: 40,
            crmImplementation: true,
            salesAutomation: true,
            customerSuccessTeam: true,
            marketplaceBeta: true,
            selfServicePlatform: true,
            mobileApp: true,
            microinfluencersProgram: true,
            marketplaceFull: true,
            saasRevenue: true,
            internationalExpansion: true,
            techInvestment: 750000,
            brandInvestment: 500000
        }
    };
    
    if (scenarios[scenarioType]) {
        Object.assign(projectionCalculator.parameters, scenarios[scenarioType]);
        updateUIFromParameters(projectionCalculator.parameters);
        recalculateProjections();
        updateRunButtonColor();
    }
};

function initializeControls() {
    const sliders = [
        { id: 'churnRateSlider', param: 'churnRate', format: 'percent' },
        { id: 'ticketMedioSlider', param: 'ticketMedio', format: 'currency' },
        { id: 'contratosMesSlider', param: 'contratosMes', format: 'number' },
        { id: 'margemSlider', param: 'margem', format: 'percent' },
        { id: 'equipeSlider', param: 'equipeVendas', format: 'number' },
        { id: 'techInvestmentSlider', param: 'techInvestment', format: 'currency' },
        { id: 'brandInvestmentSlider', param: 'brandInvestment', format: 'currency' }
    ];
    
    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        if (element) {
            element.addEventListener('input', function(e) {
                // Nova linha para mudar o tipo de cenário
                projectionCalculator.parameters.scenarioType = 'personalizado';
                updateSliderValue(slider.id, slider.param, slider.format);
                updateScenarioBar();
                debouncedRecalculate();
                updateRunButtonColor();
            });
        }
    });
    
    const toggles = [
        { id: 'crmToggle', param: 'crmImplementation' },
        { id: 'salesAutomationToggle', param: 'salesAutomation' },
        { id: 'customerSuccessToggle', param: 'customerSuccessTeam' },
        { id: 'marketplaceBetaToggle', param: 'marketplaceBeta' },
        { id: 'selfServiceToggle', param: 'selfServicePlatform' },
        { id: 'mobileAppToggle', param: 'mobileApp' },
        { id: 'microinfluencersToggle', param: 'microinfluencersProgram' },
        { id: 'marketplaceFullToggle', param: 'marketplaceFull' },
        { id: 'saasRevenueToggle', param: 'saasRevenue' },
        { id: 'internationalToggle', param: 'internationalExpansion' }
    ];
    
    toggles.forEach(toggle => {
        const element = document.getElementById(toggle.id);
        if (element) {
            element.addEventListener('change', function(e) {
                if (projectionCalculator) {
                    // Nova linha para mudar o tipo de cenário
                    projectionCalculator.parameters.scenarioType = 'personalizado';
                    projectionCalculator.parameters[toggle.param] = e.target.checked;
                    updateScenarioBar();
                    debouncedRecalculate();
                    updateRunButtonColor();
                }
            });
        }
    });
}

function updateSliderValue(sliderId, param, format) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(sliderId.replace('Slider', 'Value'));
    
    if (!slider || !projectionCalculator) return;
    
    const value = parseFloat(slider.value);
    projectionCalculator.parameters[param] = value;
    
    if (valueSpan) {
        if (format === 'percent') {
            valueSpan.textContent = value.toFixed(1) + '%';
        } else if (format === 'currency') {
            valueSpan.textContent = formatCurrency(value);
        } else {
            valueSpan.textContent = Math.round(value);
        }
    }
}

function updateUIFromParameters(params) {
    const sliders = {
        'churnRateSlider': params.churnRate,
        'ticketMedioSlider': params.ticketMedio,
        'contratosMesSlider': params.contratosMes,
        'margemSlider': params.margem,
        'equipeSlider': params.equipeVendas,
        'techInvestmentSlider': params.techInvestment || 0,
        'brandInvestmentSlider': params.brandInvestment || 0
    };
    
    Object.entries(sliders).forEach(([id, value]) => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.value = value;
            const event = new Event('input');
            slider.dispatchEvent(event);
        }
    });
    
    const toggles = {
        'crmToggle': params.crmImplementation,
        'salesAutomationToggle': params.salesAutomation,
        'customerSuccessToggle': params.customerSuccessTeam,
        'marketplaceBetaToggle': params.marketplaceBeta,
        'selfServiceToggle': params.selfServicePlatform,
        'mobileAppToggle': params.mobileApp,
        'microinfluencersToggle': params.microinfluencersProgram,
        'marketplaceFullToggle': params.marketplaceFull,
        'saasRevenueToggle': params.saasRevenue,
        'internationalToggle': params.internationalExpansion
    };
    
    Object.entries(toggles).forEach(([id, checked]) => {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.checked = checked;
        }
    });
}

function updateScenarioBar() {
    if (!projectionCalculator) return;
    
    const params = projectionCalculator.parameters;
    
    // Novas referências de cenário baseadas nos seus parâmetros
    const pessimista = {
        churnRate: 55,
        ticketMedio: 16500,
        contratosMes: 120,
        margem: 16.5,
        toggles: 2, // crmImplementation e salesAutomation
        techInvestment: 100000,
        brandInvestment: 150000
    };
    
    const otimista = {
        churnRate: 35,
        ticketMedio: 22000,
        contratosMes: 250,
        margem: 21.5,
        toggles: 10, // Todas as 10 iniciativas ativadas
        techInvestment: 1500000,
        brandInvestment: 750000
    };
    
    let optimismIndex = 0;
    let totalWeight = 0;
    
    // Parâmetros contínuos (com os novos limites)
    const churnScore = 1 - ((params.churnRate - otimista.churnRate) / (pessimista.churnRate - otimista.churnRate));
    optimismIndex += Math.max(0, Math.min(1, churnScore)) * 0.2;
    totalWeight += 0.2;
    
    const ticketScore = (params.ticketMedio - pessimista.ticketMedio) / (otimista.ticketMedio - pessimista.ticketMedio);
    optimismIndex += Math.max(0, Math.min(1, ticketScore)) * 0.15;
    totalWeight += 0.15;
    
    const contratosScore = (params.contratosMes - pessimista.contratosMes) / (otimista.contratosMes - pessimista.contratosMes);
    optimismIndex += Math.max(0, Math.min(1, contratosScore)) * 0.15;
    totalWeight += 0.15;
    
    const margemScore = (params.margem - pessimista.margem) / (otimista.margem - pessimista.margem);
    optimismIndex += Math.max(0, Math.min(1, margemScore)) * 0.1;
    totalWeight += 0.1;
    
    // Toggles
    let activeToggles = 0;
    if (params.crmImplementation) activeToggles++;
    if (params.salesAutomation) activeToggles++;
    if (params.customerSuccessTeam) activeToggles++;
    if (params.marketplaceBeta) activeToggles++;
    if (params.selfServicePlatform) activeToggles++;
    if (params.mobileApp) activeToggles++;
    if (params.microinfluencersProgram) activeToggles++;
    if (params.marketplaceFull) activeToggles++;
    if (params.saasRevenue) activeToggles++;
    if (params.internationalExpansion) activeToggles++;
    
    const toggleScore = (activeToggles - pessimista.toggles) / (otimista.toggles - pessimista.toggles);
    optimismIndex += Math.max(0, Math.min(1, toggleScore)) * 0.3;
    totalWeight += 0.3;
    
    // Investimentos
    const techInvestmentScore = (params.techInvestment - pessimista.techInvestment) / (otimista.techInvestment - pessimista.techInvestment);
    optimismIndex += Math.max(0, Math.min(1, techInvestmentScore)) * 0.05;
    totalWeight += 0.05;
    
    const brandInvestmentScore = (params.brandInvestment - pessimista.brandInvestment) / (otimista.brandInvestment - pessimista.brandInvestment);
    optimismIndex += Math.max(0, Math.min(1, brandInvestmentScore)) * 0.05;
    totalWeight += 0.05;
    
    optimismIndex = Math.max(0, Math.min(1, optimismIndex / totalWeight));
    
    // Atualizar ambas as barras
    const barFill = document.getElementById('scenarioBarFill');
    if (barFill) {
        barFill.style.clipPath = `inset(0 ${90 - (optimismIndex * 100)}% 0 0)`;
        barFill.style.width = '100%';
    }

    const modalBarFill = document.getElementById('modalScenarioBarFill');
    if (modalBarFill) {
        modalBarFill.style.clipPath = `inset(0 ${90 - (optimismIndex * 100)}% 0 0)`;
        modalBarFill.style.width = '100%';
    }
}

function recalculateProjections() {
    if (!projectionCalculator) return;
    
    const metricsSection = document.querySelector('.forecast-metrics-summary');
    if (metricsSection) {
        metricsSection.classList.add('loading');
    }
    
    try {
        const projections = projectionCalculator.calculateProjections();
        
        updateMainMetrics(projections);
        updateMetricsTable(projections);  // Adicione esta linha!
        
        if (window.ForecastCharts) {
            window.ForecastCharts.updateAll(projections);
        }
        
        updateAlerts(projections.alerts);
        updateScenarioBar();
        
    } catch (error) {
        console.error('Erro ao calcular projeções:', error);
    } finally {
        if (metricsSection) {
            metricsSection.classList.remove('loading');
        }
    }
}

function updateMainMetrics(projections) {
    const metrics = projections.metrics;
    
    const gmvElement = document.getElementById('gmvProjected');
    if (gmvElement) {
        gmvElement.textContent = formatCurrency(metrics.gmv24m || 0);
    }
    
    const gmvGrowthElement = document.getElementById('gmvGrowth');
    if (gmvGrowthElement) {
        const growth = (metrics.gmvGrowth || 0) * 100;
        gmvGrowthElement.textContent = growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
    }
    
    const valorSollerElement = document.getElementById('valorSollerProjected');
    if (valorSollerElement) {
        valorSollerElement.textContent = formatCurrency(metrics.valorSoller24m || 0);
    }
    
    const marginElement = document.getElementById('marginProjected');
    if (marginElement) {
        marginElement.textContent = `${(metrics.avgMargin || 0).toFixed(1)}% margem`;
    }
    
    const valuationElement = document.getElementById('valuationProjected');
    if (valuationElement) {
        valuationElement.textContent = formatCurrency(metrics.valuation || 0);
    }
    
    const multipleElement = document.getElementById('multipleUsed');
    if (multipleElement) {
        const multiple = metrics.valuation / metrics.valorSoller24m;
        multipleElement.textContent = `${multiple.toFixed(1)}x Valor Soller`;
    }
}

function updateAlerts(alerts) {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    if (!alerts || alerts.length === 0) {
        container.innerHTML = '<div class="alert-item success">✓ Nenhum alerta identificado</div>';
        return;
    }
    
    container.innerHTML = alerts.map(alert => {
    if (alert.type === 'subtitle') {
        return `<h5 class="alert-subtitle">${alert.message}</h5>`;
    }
    return `<div class="alert-item ${alert.type || 'warning'}">${alert.message || alert}</div>`;
}).join('');
}

window.runMonteCarloSimulation = function() {
    if (!projectionCalculator) return;
    
    const button = event.target;
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
    }
    
    // Desabilitar botão de insights durante processamento
    const insightsButton = document.querySelector('.btn-secondary');
    if (insightsButton) {
        insightsButton.disabled = true;
    }
    
    setTimeout(() => {
        try {
            const results = projectionCalculator.runMonteCarloSimulation(10000);
            
            // Salvar resultados para uso nos insights
            window.lastMonteCarloResults = results;
            
            displayMonteCarloResults(results);
            
            // AQUI: Salve os parâmetros da simulação que acabou de rodar
            lastSimulatedParams = { ...projectionCalculator.parameters };
            
            // Habilitar botão de insights após Monte Carlo
            const insightsButton = document.querySelector('.btn-secondary');
            if (insightsButton) {
                insightsButton.disabled = false;
                insightsButton.classList.add('pulse-animation');
            }
            
        } catch (error) {
            console.error('Erro no Monte Carlo:', error);
            alert('Erro ao executar simulação. Verifique o console.');
        } finally {
            if (button) {
                button.classList.remove('loading');
                button.disabled = false;
                
                // NOVO: Garantir que o botão está na cor padrão após a simulação
                updateRunButtonColor(); 
            }
        }
    }, 100);
};

// Substitua a função inteira por esta
function updateRunButtonColor() {
    const runButton = document.querySelector('.btn-primary'); 
if (!runButton || !lastSimulatedParams) {
    runButton.classList.remove('alert-state');
    return;
}

const currentParamsJSON = JSON.stringify(projectionCalculator.parameters);
const lastSimulatedParamsJSON = JSON.stringify(lastSimulatedParams);

if (currentParamsJSON !== lastSimulatedParamsJSON) {
    runButton.classList.add('alert-state');
} else {
    runButton.classList.remove('alert-state');
}
}

// Substitua a função inteira `displayMonteCarloResults` por esta
function displayMonteCarloResults(results) {
    const resultsDiv = document.getElementById('monteCarloResults');
    if (!resultsDiv) return;
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="monte-carlo-results">
            <h4>Valor Soller</h4>
            
            <h5 style="margin-top: 20px; color: #9877fdff;">Probabilidade de Cenários</h5>
            <div class="percentiles-grid">
                <div class="percentile-item">
                    <span>P10</span>
                    <span id="p10Value">R$ 0M</span>
                </div>
                <div class="percentile-item">
                    <span>P25</span>
                    <span id="p25Value">R$ 0M</span>
                </div>
                <div class="percentile-item">
                    <span>P50</span>
                    <span id="p50Value">R$ 0M</span>
                </div>
                <div class="percentile-item">
                    <span>P75</span>
                    <span id="p75Value">R$ 0M</span>
                </div>
                <div class="percentile-item">
                    <span>P90</span>
                    <span id="p90Value">R$ 0M</span>
                </div>
            </div>
            
            <h5 style="margin-top: 20px; color: #a78bfa;">Probabilidades de Sucesso</h5>
            <div class="probability-grid">
    <div class="prob-item">
        <span class="prob-label">P > R$ 20M</span>
        <span id="prob20M" class="prob-value">${(results.probSoller20M || 0).toFixed(0)}%</span>
    </div>
    <div class="prob-item">
        <span class="prob-label">P > R$ 40M</span>
        <span id="prob40M" class="prob-value">${(results.probSoller40M || 0).toFixed(0)}%</span>
    </div>
    <div class="prob-item">
        <span class="prob-label">P > R$ 50M</span>
        <span id="prob50M" class="prob-value">${(results.probSoller50M || 0).toFixed(0)}%</span>
    </div>
    <div class="prob-item">
        <span class="prob-label">P > R$ 60M</span>
        <span id="prob60M" class="prob-value">${(results.probSoller60M || 0).toFixed(0)}%</span>
    </div>
</div>
        </div>
    `;

    // Parar qualquer animação anterior antes de iniciar uma nova
    if (monteCarloInterval) {
        clearInterval(monteCarloInterval);
    }
    
    // Iniciar a animação
    monteCarloInterval = setInterval(() => {
        const val10 = getRandomValueAroundPercentile(results.valorSollerResults, 10, 2);
        const val25 = getRandomValueAroundPercentile(results.valorSollerResults, 25, 3);
        const val50 = getRandomValueAroundPercentile(results.valorSollerResults, 50, 4);
        const val75 = getRandomValueAroundPercentile(results.valorSollerResults, 75, 3);
        const val90 = getRandomValueAroundPercentile(results.valorSollerResults, 90, 2);
        
        document.getElementById('p10Value').textContent = formatCurrency(val10);
        document.getElementById('p25Value').textContent = formatCurrency(val25);
        document.getElementById('p50Value').textContent = formatCurrency(val50);
        document.getElementById('p75Value').textContent = formatCurrency(val75);
        document.getElementById('p90Value').textContent = formatCurrency(val90);

        // Animação para os valores de probabilidade
        const prob20M = (results.probSoller20M || 0) + (Math.random() * 2 - 1); // Variação de -1% a +1%
        const prob40M = (results.probSoller40M || 0) + (Math.random() * 2 - 1);
        const prob60M = (results.probSoller60M || 0) + (Math.random() * 2 - 1);

        document.getElementById('prob20M').textContent = `${Math.round(prob20M)}%`;
        document.getElementById('prob40M').textContent = `${Math.round(prob40M)}%`;
        document.getElementById('prob60M').textContent = `${Math.round(prob60M)}%`;
        
    }, 500); // Atualiza a cada 0.5 segundos
}

window.showStrategicInsights = function() {
    if (!projectionCalculator) {
        alert('Execute primeiro uma simulação Monte Carlo!');
        return;
    }
    
    // Verificar se Monte Carlo foi rodado
    const monteCarloResults = document.getElementById('monteCarloResults');
    if (!monteCarloResults || monteCarloResults.style.display === 'none') {
        alert('Rode primeiro a Simulação Monte Carlo para gerar insights contextualizados!');
        return;
    }
    
    // Pegar os resultados do último Monte Carlo
    if (!window.lastMonteCarloResults) {
        alert('Resultados da simulação não encontrados. Rode novamente o Monte Carlo.');
        return;
    }
    
    const insights = projectionCalculator.generateMonteCarloInsights(
        window.lastMonteCarloResults, 
        1000
    );
    
    const alertDiv = document.getElementById('alertsList');
    if (alertDiv && insights.length > 0) {
        alertDiv.innerHTML = insights.map(insight => {
            if (insight.type === 'subtitle') {
                return `<h4 class="alert-subtitle">${insight.message}</h4>`;
            } else if (insight.type === 'header') {
                return `<h3 class="alert-header">${insight.message}</h3>`;
            } else if (insight.type === 'critical') {
                return `<div class="alert-item critical">${insight.message}</div>`;
            } else if (insight.type === 'action') {
                return `<div class="alert-item action">${insight.message}</div>`;
            }
            return `<div class="alert-item ${insight.type || 'info'}">${insight.message}</div>`;
        }).join('');
    }
    
    return insights;
};

window.updateCompositionChart = function(monthIndex) {
    const month = parseInt(monthIndex);
    const label = document.getElementById('compositionMonth');
    if (label) {
        label.textContent = `Mês ${month + 1}`;
    }
    
    if (window.ForecastCharts && projectionCalculator && projectionCalculator.projectionCache) {
        window.ForecastCharts.updateCompositionChart(month);
    }
};

function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'R$ 0';
    }
    
    if (value >= 1000000000) {
        return `R$ ${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(0)}K`;
    } else {
        return `R$ ${value.toFixed(0)}`;
    }
}

window.recalculateProjections = recalculateProjections;