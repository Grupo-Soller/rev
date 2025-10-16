// ULTIMO Adicione estas correções no início do main.js, após a importação dos dados

// Garantir que SollerData esteja disponível globalmente
window.SollerData = window.SollerData || {};

// Função para renderizar análise de agências com verificação de dados
function renderAgencyAnalysis() {
    const agencyContainer = document.getElementById('agencyAnalysis');
    if (!agencyContainer) {
        console.warn('Elemento agencyAnalysis não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.agencies) {
        console.warn('Dados de agências não encontrados');
        agencyContainer.innerHTML = '<p>Dados de agências não disponíveis</p>';
        return;
    }
    
    // Estado da ordenação
    let sortColumn = 'contracts';
    let sortDirection = 'desc';
    
    function renderTable() {
    // Ordenar dados
    const sortedAgencies = [...window.SollerData.agencies].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    agencyContainer.innerHTML = `
        <div class="agency-table-container">
            <table class="agency-table">
                <thead>
                    <tr>
                        <th>Agência</th>
                        <th class="sortable" onclick="window.sortAgencyTable('contracts')">
                            Contratos que fechamos com a agência
                            ${sortColumn === 'contracts' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('avgMargin')">
                            Média de % Terceiro
                            ${sortColumn === 'avgMargin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('avgMarginSoller')">
                            Média de % Soller
                            ${sortColumn === 'avgMarginSoller' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('totalValue')">
                            Valor Total dos Contratos
                            ${sortColumn === 'totalValue' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedAgencies.map(agency => `
                        <tr class="${agency.avgMargin >= 101 ? 'high-margin' : ''}">
                            <td>${agency.name}</td>
                            <td class="text-center">${agency.contracts}</td>
                            <td class="text-center">${agency.avgMargin.toFixed(2)}%</td>
                            <td class="text-center">${agency.avgMarginSoller.toFixed(2)}%</td>
                            <td class="text-center">${agency.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>                          
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
    
    // Função global para ordenação
    window.sortAgencyTable = function(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }
        renderTable();
    };
    
    renderTable();
}

// FinOps Dashboard Functions
function initializeFinOps() {
    // Animar progresso das barras quando a seção for visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateFinOpsMetrics();
            }
        });
    });

    const finopsSection = document.getElementById('finops');
    if (finopsSection) {
        observer.observe(finopsSection);
    }
    
    // Atualizar métricas dinâmicas
    updateFinOpsMetrics();
    
    // Criar gráfico de evolução de custos
    createCostEvolutionChart();
}

function animateFinOpsMetrics() {
    // Animar barras de progresso
    document.querySelectorAll('.ratio-fill, .nf-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
    
    // Animar números
    document.querySelectorAll('.ue-value').forEach(value => {
        animateValue(value);
    });
}

function animateValue(element) {
    const finalValue = element.textContent;
    const isCurrenty = finalValue.includes('R$');
    const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
    let current = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            clearInterval(timer);
            element.textContent = finalValue;
        } else {
            if (isCurrenty) {
                element.textContent = `R$ ${current.toFixed(0)}K`;
            } else {
                element.textContent = current.toFixed(1) + finalValue.replace(/[0-9.]/g, '');
            }
        }
    }, 20);
}

function updateFinOpsMetrics() {
    // Calcular métricas baseadas nos dados existentes
    const gmvTotal = 59387930;
    const valorSoller = 12350415;
    const contracts = 3244;
    
    // CAC calculation
    const marketingCost = valorSoller * 0.15; // 15% do valor Soller
    const cac = marketingCost / contracts;
    
    // Update DOM if elements exist
    const cacElement = document.querySelector('.ue-card:nth-child(1) .ue-value');
    if (cacElement) {
        cacElement.textContent = `R$ ${(cac/1000).toFixed(1)}K`;
    }
}

function createCostEvolutionChart() {
    const ctx = document.getElementById('costEvolutionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Despesas',
                    data: [210, 220, 230, 225, 235, 240, 230],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)'
                },
                {
                    label: 'Receitas',
                    data: [250, 260, 270, 280, 285, 290, 290],
                    borderColor: '#0ea846',
                    backgroundColor: 'rgba(14, 168, 70, 0.1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Função para criar o gráfico de nichos com verificação
function createNichesChart() {
    const nichesCtx = document.getElementById('nichesChart');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Configuração dos períodos e dados, agora como um array para garantir a ordem
const periodConfigs = [
    {
        key: 'total',
        title: 'Desde 2023 (31.9%)',
        data: {
            'Márcia 11.5%': window.SollerData.niches.quarterly.data.moda,
            'Aline Marquez 6.3%': window.SollerData.niches.quarterly.data.saude,
            'Ellen Milgrau 5%': window.SollerData.niches.quarterly.data.beleza,
            'Camila Dias 4.9%': window.SollerData.niches.quarterly.data.acessorios,
            'Edson Celulari 4%': window.SollerData.niches.quarterly.data.alimentacao
        }
    },
    {
        key: '2025',
        title: 'Em 2025 (39,4%)',
        data: {
            'Márcia 10.9%': window.SollerData.niches.quarterly.data1.moda,
            'Camila Dias 10.6%': window.SollerData.niches.quarterly.data1.saude,
            'Aline Marquez 7.7%': window.SollerData.niches.quarterly.data1.beleza,
            'Fernanda Cintra 5.6%': window.SollerData.niches.quarterly.data1.acessorios,
            'Gabi Sobral 4.5%': window.SollerData.niches.quarterly.data1.alimentacao
        }
    },
    {
        key: '2024',
        title: 'Em 2024 (31,5%)',
        data: {
            'Márcia 13.1%': window.SollerData.niches.quarterly.data2.moda,
            'Aline Marquez 6.3%': window.SollerData.niches.quarterly.data2.saude,
            'Ellen Milgrau 5%': window.SollerData.niches.quarterly.data2.beleza,
            'Camila Dias 3.9%': window.SollerData.niches.quarterly.data2.acessorios,
            'Carol Peixinho 3.1%': window.SollerData.niches.quarterly.data2.alimentacao
        }
    },
    {
        key: '2023',
        title: 'Em 2023 (35,7%)',
        data: {
            'Márcia 10.4%': window.SollerData.niches.quarterly.data3.moda,
            'Ellen Milgrau 7.8%': window.SollerData.niches.quarterly.data3.saude,
            'Edson Celulari 6.5%': window.SollerData.niches.quarterly.data3.beleza,
            'Carol Peixinho 5.9%': window.SollerData.niches.quarterly.data3.acessorios,
            'Aline Marquez 5.1%': window.SollerData.niches.quarterly.data3.alimentacao
        }
    }
];
    
    // Cores para os datasets
    const colors = [
        { border: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
        { border: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
        { border: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
        { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
    ];
    
    // Criar container para o toggle se não existir
    let toggleContainer = document.getElementById('niches-toggle-container');
    if (!toggleContainer) {
        toggleContainer = document.createElement('div');
        toggleContainer.id = 'niches-toggle-container';
        toggleContainer.className = 'niches-toggle-container';
        nichesCtx.parentElement.insertBefore(toggleContainer, nichesCtx.parentElement.firstChild);
        
        // Criar botões de toggle
        // Criar botões de toggle
periodConfigs.forEach((config, index) => {
    const button = document.createElement('button');
    button.className = 'niches-toggle-btn';
    button.textContent = config.key === 'total' ? 'Total' : config.key;
    button.dataset.period = config.key;
    if (index === 0) button.classList.add('active');
    
    button.addEventListener('click', function() {
        document.querySelectorAll('.niches-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        updateChart(config.key);
    });
    
    toggleContainer.appendChild(button);
});
    }
    
    // Função para atualizar o gráfico
    function updateChart(periodKey) {
    const config = periodConfigs.find(p => p.key === periodKey);
        const datasets = [];
        let colorIndex = 0;
        
        // Criar datasets para o período selecionado
        for (const [label, data] of Object.entries(config.data)) {
            datasets.push({
                label: label,
                data: data,
                borderColor: colors[colorIndex].border,
                backgroundColor: colors[colorIndex].bg,
                tension: 0.4
            });
            colorIndex = (colorIndex + 1) % colors.length;
        }
        
        // Destruir gráfico existente se houver
        if (nichesCtx.chart) {
            nichesCtx.chart.destroy();
        }
        
        // Criar novo gráfico
        nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: window.SollerData.niches.quarterly.quarters,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: config.title,
                        font: { size: 16, weight: 'bold' },
                        color: '#666666'
                    },
                    legend: {
                        labels: {
                            color: '#666666'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                    new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000) + 'K';
                            },
                            color: '#666666'
                        },
                        title: {
                            display: true,
                            text: 'Valor (R$)',
                            color: '#666666'
                        },
                        grid: {
                            color: 'rgba(102, 102, 102, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666666'
                        },
                        grid: {
                            color: 'rgba(102, 102, 102, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Inicializar com o período 'total'
    updateChart('total');
}

function createComparisonChart() {
    const chartCtx = document.getElementById('comparisonChart');
    if (!chartCtx) {
        console.warn('Canvas comparisonChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Configuração dos dados
    const dataConfigs = {
        absoluto: {
            evolucoes: {
                title: 'Valor absoluto (2025 menos 2024) - Evoluções',
                data: {
                    'Camila Dias': window.SollerData.niches.quarterly.data4.moda,
                    'Fernanda Cintra': window.SollerData.niches.quarterly.data4.saude,
                    'Gabi Sobral': window.SollerData.niches.quarterly.data4.beleza,
                    'Duda Guerra': window.SollerData.niches.quarterly.data4.acessorios,
                    'Aline Marquez': window.SollerData.niches.quarterly.data4.alimentacao
                }
            },
            regressoes: {
                title: 'Valor absoluto (2025 menos 2024) - Regressões',
                data: {
                    'Carol Peixinho': window.SollerData.niches.quarterly.data6.moda,
                    'Ellen Milgrau': window.SollerData.niches.quarterly.data6.beleza,
                    'Gossip do Dia': window.SollerData.niches.quarterly.data6.alimentacao,
                    'Thieli Martinelli': window.SollerData.niches.quarterly.data6.acessorios,
                    'Gaby Santos': window.SollerData.niches.quarterly.data6.saude

                }
            }
        },
        relativo: {
            evolucoes: {
                title: 'Multiplicador (2025 sobre 2024) - Evoluções',
                data: {
                    'Duda Guerra': window.SollerData.niches.quarterly.data5.moda,
                    'Sophia Cit': window.SollerData.niches.quarterly.data5.saude,
                    'Fernanda Cintra': window.SollerData.niches.quarterly.data5.acessorios,
                    'Gabi Sobral': window.SollerData.niches.quarterly.data5.alimentacao,
                    'Camila Nereu': window.SollerData.niches.quarterly.data5.beleza,
                }
            },
            regressoes: {
                title: 'Multiplicador (2025 [1,9x] sobre 2024) - Regressões',
                data: {
                    'Maria Eugenia': window.SollerData.niches.quarterly.data7.moda,
                    'Carol Peixinho': window.SollerData.niches.quarterly.data7.saude,
                    'Carol e Pippo': window.SollerData.niches.quarterly.data7.acessorios,
                    'Fernanda Kanner': window.SollerData.niches.quarterly.data7.alimentacao,
                    'Carol Buffara': window.SollerData.niches.quarterly.data7.beleza
                }
            }
        }
    };
    
    // Cores para os datasets
    const colors = [
        { border: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
        { border: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
        { border: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
        { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
    ];
    
    // Estado atual dos toggles
    let currentType = 'absoluto'; // absoluto ou relativo
    let currentTrend = 'evolucoes'; // evolucoes ou regressoes
    
    // Criar container principal para os toggles se não existir
    let toggleMainContainer = document.getElementById('comparison-toggle-main');
    if (!toggleMainContainer) {
    toggleMainContainer = document.createElement('div');
    toggleMainContainer.id = 'comparison-toggle-main';
    toggleMainContainer.className = 'comparison-toggle-main';
    chartCtx.parentElement.insertBefore(toggleMainContainer, chartCtx.parentElement.firstChild);
    
    // CRIAR CONTAINER PARA TOGGLE DE TENDÊNCIA (EVOLUÇÕES/REGRESSÕES) - Este é o primeiro agora
    const trendContainer = document.createElement('div');
    trendContainer.className = 'comparison-toggle-group';
    
    const trendButtonContainer = document.createElement('div');
    trendButtonContainer.className = 'toggle-button-container';
    
    // Botão Evoluções
    const evolutionBtn = document.createElement('button');
    evolutionBtn.className = 'comparison-toggle-btn active';
    evolutionBtn.textContent = 'Evolução';
    evolutionBtn.dataset.trend = 'evolucoes';
    evolutionBtn.addEventListener('click', function() {
        if (currentTrend !== 'evolucoes') {
            currentTrend = 'evolucoes';
            updateToggleButtons();
            updateChart();
        }
    });
    trendButtonContainer.appendChild(evolutionBtn);
    
    // Botão Regressões
    const regressionBtn = document.createElement('button');
    regressionBtn.className = 'comparison-toggle-btn';
    regressionBtn.textContent = 'Regressão';
    regressionBtn.dataset.trend = 'regressoes';
    regressionBtn.addEventListener('click', function() {
        if (currentTrend !== 'regressoes') {
            currentTrend = 'regressoes';
            updateToggleButtons();
            updateChart();
        }
    });
    trendButtonContainer.appendChild(regressionBtn);
    
    trendContainer.appendChild(trendButtonContainer);
    toggleMainContainer.appendChild(trendContainer);
    
    // CRIAR CONTAINER PARA TOGGLE DE TIPO (ABSOLUTO/RELATIVO) - Este é o segundo agora
    const typeContainer = document.createElement('div');
    typeContainer.className = 'comparison-toggle-group';
    
    const typeButtonContainer = document.createElement('div');
    typeButtonContainer.className = 'toggle-button-container';
    
    // Botão Valor Absoluto
    const absoluteBtn = document.createElement('button');
    absoluteBtn.className = 'comparison-toggle-btn active';
    absoluteBtn.textContent = 'Absoluta';
    absoluteBtn.dataset.type = 'absoluto';
    absoluteBtn.addEventListener('click', function() {
        if (currentType !== 'absoluto') {
            currentType = 'absoluto';
            updateToggleButtons();
            updateChart();
        }
    });
    typeButtonContainer.appendChild(absoluteBtn);
    
    // Botão Valor Relativo
    const relativeBtn = document.createElement('button');
    relativeBtn.className = 'comparison-toggle-btn';
    relativeBtn.textContent = 'Relativa';
    relativeBtn.dataset.type = 'relativo';
    relativeBtn.addEventListener('click', function() {
        if (currentType !== 'relativo') {
            currentType = 'relativo';
            updateToggleButtons();
            updateChart();
        }
    });
    typeButtonContainer.appendChild(relativeBtn);
    
    typeContainer.appendChild(typeButtonContainer);
    toggleMainContainer.appendChild(typeContainer);
}
    
    // Função para atualizar estado visual dos botões
    function updateToggleButtons() {
        // Atualizar botões de tipo
        document.querySelectorAll('[data-type]').forEach(btn => {
            if (btn.dataset.type === currentType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Atualizar botões de tendência
        document.querySelectorAll('[data-trend]').forEach(btn => {
            if (btn.dataset.trend === currentTrend) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Função para atualizar o gráfico
    function updateChart() {
        const config = dataConfigs[currentType][currentTrend];
        const datasets = [];
        let colorIndex = 0;
        
        // Criar datasets para a configuração selecionada
        for (const [label, data] of Object.entries(config.data)) {
            datasets.push({
                label: label,
                data: data,
                borderColor: colors[colorIndex].border,
                backgroundColor: colors[colorIndex].bg,
                tension: 0.4
            });
            colorIndex = (colorIndex + 1) % colors.length;
        }
        
        // Destruir gráfico existente se houver
        if (chartCtx.chart) {
            chartCtx.chart.destroy();
        }
        
        // Criar novo gráfico
        chartCtx.chart = new Chart(chartCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: window.SollerData.niches.quarterly.quarters,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: false,
                        text: config.title,
                        font: { size: 16, weight: 'bold' },
                        color: '#666666'
                    },
                    legend: {
                        labels: {
                            color: '#666666'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // Para valor relativo, mostrar como multiplicador
                                if (currentType === 'relativo') {
                                    const value = context.parsed.y;
                                    // Se o valor for menor que 100, assumir que já é um multiplicador
                                    if (value < 100) {
                                        return context.dataset.label + ': ' + value.toFixed(2) + 'x';
                                    }
                                    // Caso contrário, tratar como valor monetário
                                    return context.dataset.label + ': ' + 
                                        new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(value);
                                } else {
                                    // Para valor absoluto, mostrar como moeda
                                    return context.dataset.label + ': ' + 
                                        new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(context.parsed.y);
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                // Para valor relativo, mostrar como multiplicador se for pequeno
                                if (currentType === 'relativo' && value < 100) {
                                    return value.toFixed(1) + 'x';
                                }
                                // Caso contrário, mostrar como valor monetário
                                return 'R$ ' + (value / 1000) + 'K';
                            },
                            color: '#666666'
                        },
                        title: {
                            display: true,
                            text: currentType === 'relativo' ? 'Multiplicador / Valor (R$)' : 'Valor (R$)',
                            color: '#666666'
                        },
                        grid: {
                            color: 'rgba(102, 102, 102, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666666'
                        },
                        grid: {
                            color: 'rgba(102, 102, 102, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Inicializar com os valores padrão
    updateChart();
}

// Função para renderizar o Q2 2025 no Tech Stack Roadmap
function renderTechRoadmap() {
    const techStackContainer = document.querySelector('.roadmap-timeline');
    if (!techStackContainer) {
        console.warn('Elemento .roadmap-timeline não encontrado para renderizar Tech Roadmap.');
        return;
    }

    // Remover qualquer Q2 2025 estático ou anterior para evitar duplicação
    const existingQ2 = techStackContainer.querySelector('.roadmap-phase.current');
    if (existingQ2) {
        existingQ2.remove();
    }

    // Verificar se os dados de tech stack existem no SollerData
    if (!window.SollerData || !window.SollerData.techStack || !window.SollerData.techStack.current) {
        console.warn('Dados de tech stack (current) não encontrados em SollerData. Pulando renderização do Q2 2025.');
        return;
    }

    // Criar o quadro do Q2 2025 (Atual) a partir dos dados dinâmicos
    const currentQuarterHTML = `
        <div class="roadmap-phase current">
            <h4>Q2 2025</h4>
            <ul>
                ${window.SollerData.techStack.current.map(tech => `
                    <li class="${tech.status}">
                        ${tech.name} ${tech.adoption < 100 ? `(${tech.adoption}%)` : ''}
                        ${tech.risk ? `<span class="risk-badge">${tech.risk}</span>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Inserir como primeiro elemento na timeline
    techStackContainer.insertAdjacentHTML('afterbegin', currentQuarterHTML);

    console.log('Q2 2025 Tech Stack renderizado com sucesso!');
}

// Função initializeDashboard atualizada com verificações
function initializeDashboard() {
    console.log('Inicializando dashboard...');
    
    // Verificar se SollerData existe
    if (!window.SollerData) {
        console.error('SollerData não encontrado! Verifique se o data.js foi carregado corretamente.');
        return;
    }
    
    // Criar gráficos
    if (typeof createCharts === 'function') {
        createCharts();
    } else {
        console.warn('Função createCharts não encontrada');
    }
    
    // Renderizar componentes com verificações
    try {
        if (typeof renderWarRoomInitiatives === 'function') renderWarRoomInitiatives();
    } catch (e) {
        console.warn('Erro ao renderizar War Room:', e);
    }
    
    try {
        if (typeof updateDynamicMetrics === 'function') updateDynamicMetrics();
    } catch (e) {
        console.warn('Erro ao atualizar métricas:', e);
    }
    
    try {
        if (typeof renderLeadSourceAnalysis === 'function') renderLeadSourceAnalysis();
    } catch (e) {
        console.warn('Erro ao renderizar análise de leads:', e);
    }
    
    try {
        if (typeof renderMarginAnalysis === 'function') renderMarginAnalysis();
    } catch (e) {
        console.warn('Erro ao renderizar análise de margens:', e);
    }
    
    try {
        if (typeof renderTechRoadmap === 'function') renderTechRoadmap();
    } catch (e) {
        console.warn('Erro ao renderizar roadmap:', e);
    }
    
    // Renderizar novos componentes
    try {
        renderAgencyAnalysis();
    } catch (e) {
        console.error('Erro ao renderizar análise de agências:', e);
    }
    
    // Criar gráfico de nichos
    try {
        createNichesChart();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createComparisonChart();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }
    
    // Inicializar navegação
    if (typeof initializeTabNavigation === 'function') {
        initializeTabNavigation();
    }
    
    // Adicionar animações de entrada
    if (typeof animateOnScroll === 'function') {
        animateOnScroll();
    }
    
    console.log('Dashboard inicializado');
}

// Garantir que o dashboard seja inicializado quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    // DOM já está carregado
    setTimeout(initializeDashboard, 100); // Pequeno delay para garantir que todos os scripts foram carregados
}

document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    initializeFinOps();
});
