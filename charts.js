// ULTIMO charts.js - Configuração e criação de todos os gráficos com verificações

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que data.js foi carregado
    setTimeout(function() {
        initializeCharts();
    }, 100);
});

function initializeCharts() {
    // Verificar se os dados existem
    if (!window.SollerData) {
        console.error('SollerData não encontrado. Verifique se data.js foi carregado antes de charts.js');
        return;
    }
    
    // Configurações globais do Chart.js
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.color = '#1f2937';
    
    // Criar todos os gráficos
    createAllCharts();
}

// Função principal para criar todos os gráficos
function createAllCharts() {
    // 1. Gráfico de Origem dos Leads
    createSourceChart();
    
    // 2. Gráfico de Contratos
    createContractsChart();
    
    // 3. Gráfico GMV
    createGMVChart();

    createNichesChart8();

    createServicesChart9();

    createServicesPieChart();

    createInflusChart();
}

// Função para criar gráfico de origem dos leads
function createSourceChart() {
    const sourceCtx = document.getElementById('sourceChart');
    if (!sourceCtx) return;

    // Verificar dados
    if (!window.SollerData.leadSource || !window.SollerData.leadSource.distribution) {
        console.warn('Dados de origem dos leads não encontrados');
        return;
    }

    // Destruir gráfico existente se houver
    if (sourceCtx.chart) {
        sourceCtx.chart.destroy();
    }

    // --- Plugin para o texto central ---
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.restore();
            const fontSize = (height / 114).toFixed(2);
            ctx.font = `bold ${fontSize}em sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#6c6c6cff';

            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const text = total.toLocaleString().replace(/\./g, '');

            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2 - 19;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    };
    // ------------------------------------

    sourceCtx.chart = new Chart(sourceCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Outbound', 'Inbound'],
            datasets: [{
                data: [
                    window.SollerData.leadSource.distribution.outbound.count,
                    window.SollerData.leadSource.distribution.inbound.count
                ],
                backgroundColor: ['#FF375F', '#00A8FF'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    reverse: true,
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        color: '#6c6c6cff'
                    },
                    onClick: (e) => e.stopPropagation()
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        },
        plugins: [centerTextPlugin] // <<< Adicione esta linha
    });
}

// Função para criar gráfico de Pareto dos Influenciadores
// Função para criar gráfico de Pareto dos Influenciadores
function createInflusChart() {
    const influsCtx = document.getElementById('influsChart');
    if (!influsCtx) {
        console.warn('Canvas influsChart não encontrado');
        return;
    }

    const existingChart = Chart.getChart(influsCtx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Dados do JSON fornecido
    const influsData = [
        {
            "Ano": 2023,
            "Quarter": "Q1",
            "Total": 294486.768,
            "Influs": "GISELA SABACK, ANDRE MARTINELLI, CAROL PEIXINHO, MARCELLA TRANCHESI, LUCIANA TRANCHESI, PAULA MANOSSO, FERNANDA KANNER, GABRIELA BRASIO, THIELI MARTINELLI, CAMILA MONTEIRO, MARINA PUMAR, KARIN ROEPKE, LAURA BRITO, ELLEN MILGRAU",
            "Valor_por_Influ": "31599.992, 17300, 16417.74, 13722.236, 13334.4, 12600, 12400, 12000, 9000, 8750, 8338, 8100, 8000, 7000",
            "Total_qdd_Influs": "56",
        },
        {
            "Ano": 2023,
            "Quarter": "Q2",
            "Total": 938591.38,
            "Influs": "CAROL PEIXINHO, MARCIA FERNANDES, ELLEN MILGRAU, GOSSIP DO DIA, SARAH MATTAR, CAROL BUFFARA, CAMILA MONTEIRO, DOMITILA BARROS, MARIA EUGENIA, NARCISA, EDSON CELULARI, ALINE MARQUEZ, SAIDE MATTAR, PETALA BARREIROS, GISELA SABACK, ISA SANTOS, LUARA COSTA, GABY SANTOS, ENZO CELULARI, STE GARCIA",
            "Valor_por_Influ": "129000, 123360, 94678.4, 53600, 32672, 31970, 28880, 26600, 25399.98, 25000, 22400, 18580, 15900, 15600, 15152, 13943, 13450, 11686, 11500, 11234",
            "Total_qdd_Influs": "101"
        },
        {
            "Ano": 2023,
            "Quarter": "Q3",
            "Total": 1069853.364,
            "Influs": "MARCIA FERNANDES, ALINE MARQUEZ, DOMITILA BARROS, EDSON CELULARI, MARINA PUMAR, CAROL PEIXINHO, ELLEN MILGRAU, GOSSIP DO DIA, GABRIELA PUGLIESI, MARCELLA ZANONI, GABRIELA BRASIO, THIELI MARTINELLI, FERNANDA DI BIASE, MATEUS VERDELHO, GISELA SABACK, CAROL BUFFARA, VALENTINA SLAVIERO, BIANCA SANTINI, ISABELLA YONEZAWA, GABY SANTOS",
            "Valor_por_Influ": "94000,85076,82900,70000,56600,40600,40000,31960,30000,24300,24000,22700,22600,22500,21520,20071,19062.5,18000,16200,15940",
            "Total_qdd_Influs": "103"
        },
        {
            "Ano": 2023,
            "Quarter": "Q4",
            "Total": 925974.234,
            "Influs": "MARCIA FERNANDES,ELLEN MILGRAU,EDSON CELULARI,ALINE MARQUEZ,CAMILA COELHO,GOSSIP DO DIA,KELLY ESQUIO,DOMITILA BARROS,GISELA SABACK,LUCIANA TRANCHESI,MARCELLA MINELLI,THIELI MARTINELLI,RAFA LAMASTRA,DUDA SANTANA,ADENIZIA",
            "Valor_por_Influ": "115437.28,109756,72000,57128,49999.98,39720,37000,26400,25820,25046.88,22550,16960,16920,15003,15000",
            "Total_qdd_Influs": "75"
        },
        {
            "Ano": 2024,
            "Quarter": "Q1",
            "Total": 717249.486,
            "Influs": "CAROL PEIXINHO,MARCIA FERNANDES,ELLEN MILGRAU,ALINE MARQUEZ,MARCELLA TRANCHESI,FERNANDA KANNER,GABRIELA MORAIS,CAROL E PIPPO,THIELI MARTINELLI,GOSSIP DO DIA,DOMITILA BARROS,DUDA SANTANA,GABY SANTOS,RAFA LAMASTRA,LAVYNE TEIXEIRA,DUPLA CARIOCA",
            "Valor_por_Influ": "98428,67899.998,48400,41856.096,27000,26666.4,18000,16800,15000,14500,14400,12500,12470,12200,12000,12000",
            "Total_qdd_Influs": "79"
        },
        {
            "Ano": 2024,
            "Quarter": "Q2",
            "Total": 1027645.566,
            "Influs": "MARCIA FERNANDES,GABRIELA MORAIS,ALINE MARQUEZ,GABI MORETTI,YASMIN CASTILHO,GOSSIP DO DIA,CAROL BUFFARA,LORRANE OLIVEIRA,SHANTAL,CAMILA MONTEIRO,ELLEN MILGRAU,DOMITILA BARROS,MARCELLA MINELLI,KIM ZUCATELLI,MICA ROCHA,LUARA COSTA,THUANY MACIEL,THIELI MARTINELLI,LU E PAULO VILHENA,BIANCA CAMARGO",
            "Valor_por_Influ": "154109.7875,60600,52350,45000,35500,31923.44,27670,27300,22000,21120,19596.6,18009,17875,16050,16000,15149.998,15040,15000,14000,13500",
            "Total_qdd_Influs": "103"
        },
        {
            "Ano": 2024,
            "Quarter": "Q3",
            "Total": 1173809.901,
            "Influs": "MARCIA FERNANDES,ELLEN MILGRAU,ALINE MARQUEZ,YASMIN CASTILHO,EDSON CELULARI,BIANCA CAMARGO,JULIA JABOUR,KIM ZUCATELLI,THUANY MACIEL,LUARA COSTA,FELIPE ANDREOLI,MARIA BRAZ,RENATA SCHWERZ,ANDRE MARTINELLI,BEATRICE,GABRIELA MORAIS,MARCELLA MINELLI,MALU RINALDI",
            "Valor_por_Influ": "137560,77950,66744,60000,49600,36600,28250,25350,20300,20200,20000,19600,17485,16600,16460,16000,15020,15000",
            "Total_qdd_Influs": "92"
        },
        {
            "Ano": 2024,
            "Quarter": "Q4",
            "Total": 1248338.507,
            "Influs": "CAMILA DIAS,MARCIA FERNANDES,ALINE MARQUEZ,NATHALIE BILLIO,ELLEN MILGRAU,THUANY MACIEL,KIM ZUCATELLI,MARCELLO NOVAES,EDSON CELULARI,PEDRO NOVAES,MALU PERINI,RENATA SCHWERZ,JULHA TEDESCO,LU E PAULO VILHENA,MARCELA MENIN,GABRIELA MORAIS,JULIA JABOUR,RENATA GIACOMETTI,LAISA CHIMELLO,FERNANDA CINTRA",
            "Valor_por_Influ": "171865.25,149145.5268,78400,66087,53700,51800,51548.03,50000,39000,35000,30900,22245,21000,21000,15650,15500,14800,14020,13360,13100",
            "Total_qdd_Influs": "98"
        },
        {
            "Ano": 2025,
            "Quarter": "Q1",
            "Total": 1510959.258,
            "Influs": "PEDRO NOVAES,SOLLER DIGITAL,CAMILA DIAS,ALINE MARQUEZ,ELLEN MILGRAU,DUDA GUERRA,BIA NAPOLITANO,KIM ZUCATELLI,SANTOS FC,JULHA TEDESCO,MARCIA FERNANDES,GABRIELA MORAIS,FERNANDA CINTRA,GABI SOBRAL,THUANY MACIEL",
            "Valor_por_Influ": "145000,139949.64,138575.534,126246,67300,52530.00198,50000,40500.004,40000,39499.998,38390.4,33000,32200,29700,29283.6",
            "Total_qdd_Influs": "71"
        },
        {
            "Ano": 2025,
            "Quarter": "Q2",
            "Total": 1848182.701,
            "Influs": "MARCIA FERNANDES,SOLLER DIGITAL,CAMILA DIAS,FERNANDA CINTRA,GABI SOBRAL,ALINE MARQUEZ,NATHALIE BILLIO,DUDA GUERRA,CAMILA MONTEIRO,EDSON CELULARI,SOPHIA CIT,PAULO VILHENA,THUANY MACIEL,CAROL LEITE,JULHA TEDESCO,SOLLER,BEATRIZ FRANÇA,FERNANDA KANNER,MARY NUERNBERG,BIA NAPOLITANO,GABRIELA MORAIS",
            "Valor_por_Influ": "258782.1215,179830.59,129430,125480,95980.01,90036,88422.418,78438.046,43850,36000,33600,32078.571,31560,26400,23166.664,21000,19200,18712.814,18000,18000",
            "Total_qdd_Influs": "107"
        }
    ];

    // Processar dados para o formato necessário
    function processInflusData() {
        return influsData.map(quarter => {
            const influs = quarter.Influs.split(',').map(name => name.trim());
            const valores = quarter.Valor_por_Influ.split(',').map(val => parseFloat(val.trim()));
            const totalQtdInflus = parseInt(quarter.Total_qdd_Influs, 10);
            
            // Criar array de influenciadores com seus valores
            const influencersData = influs.map((name, idx) => ({
                name: name,
                value: valores[idx] || 0
            }))?.sort((a, b) => b.value - a.value); // Use optional chaining for safety
            
            // Calcular valores para as categorias
            const top5 = influencersData.slice(0, 5);
            const next15 = influencersData.slice(5, 20);
            const resto = influencersData.slice(20);
            
            const top5Sum = top5.reduce((sum, inf) => sum + inf.value, 0);
            const next15Sum = next15.reduce((sum, inf) => sum + inf.value, 0);
            const restoSum = resto.reduce((sum, inf) => sum + inf.value, 0);
            const totalTop20 = top5Sum + next15Sum;
            
            // Calcular percentuais
            const total = quarter.Total;
            const top5Percent = (top5Sum / total) * 100;
            const next15Percent = (next15Sum / total) * 100;
            const restoPercent = ((total - totalTop20) / total) * 100; // Ajuste para o resto real

            return {
                quarter: `Q${quarter.Quarter.replace('Q', '')} ${quarter.Ano}`,
                ano: quarter.Ano,
                quarterNum: quarter.Quarter,
                total: total,
                totalQtdInflus: totalQtdInflus,
                // Adicionado campo com a contagem real dos influenciadores listados
                listedInflusCount: influs.length,
                top5: {
                    influs: top5,
                    sum: top5Sum,
                    percent: top5Percent,
                    count: 5
                },
                next15: {
                    influs: next15,
                    sum: next15Sum,
                    percent: next15Percent,
                    count: next15.length
                },
                resto: {
                    sum: total - totalTop20,
                    percent: restoPercent
                },
                allInflus: influencersData
            };
        });
    }

    const processedData = processInflusData();
    const labels = processedData.map(d => d.quarter);
    
    // Estado de visibilidade
    let visibilityState = {
        'Top 5': true,
        'Top 20%': true,
        'Restante': true,
        'Top 5 (Qtd)': true, // Renomeado para consistência com a legenda
        'Top 20% (Qtd)': true, // Renomeado para consistência com a legenda
        'Restante (Qtd)': true // Renomeado para consistência com a legenda
    };

    // NOVO: Adiciona o estado do toggle
    let isCombinedView = false;

    // Modal HTML
    if (!document.getElementById('influsModal')) {
        const modalHTML = `
            <div id="influsModal" style="display: none; position: fixed; z-index: 999999999999999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8);">
                <div style="background: linear-gradient(135deg, #2a2a3e 0%, #3d3d54 100%); margin: 5% auto; padding: 30px; border-radius: 20px; width: 90%; max-width: 1060px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
                        <h2 id="modalTitle" style="font-size: 1.5rem; color: #fff; font-weight: 600;">Detalhes dos Influenciadores</h2>
                        <span onclick="closeInflusModal()" style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                    </div>
                    <div id="quarterSelector" style="display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap;"></div>
                    <div id="modalContent"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Funções do modal
    window.openInflusModal = function(quarterIndex) {
        const modal = document.getElementById('influsModal');
        if (!modal) {
            console.error('Erro: Modal não encontrado.');
            return;
        }

        const quarterSelector = document.getElementById('quarterSelector');
        
        // Criar botões de quarter
        quarterSelector.innerHTML = '';
        processedData.forEach((data, idx) => {
            const btn = document.createElement('button');
            btn.innerText = data.quarter;
            btn.className = idx === quarterIndex ? 'active' : '';
            btn.style.cssText = `padding: 8px 16px; background: ${idx === quarterIndex ? '#7c3aed' : 'rgba(255, 255, 255, 0.1)'}; border: 1px solid ${idx === quarterIndex ? '#7c3aed' : 'rgba(255, 255, 255, 0.2)'}; border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.3s; font-size: 0.9rem;`;
            btn.onclick = () => updateModalContent(idx);
            quarterSelector.appendChild(btn);
        });
        
        updateModalContent(quarterIndex);
        modal.style.display = 'block';
        
        // Corrigir bug de rolagem
        modal.querySelector('div').scrollTop = 0;
    };

    window.updateModalContent = function(quarterIndex) {
        const data = processedData[quarterIndex];
        const modalContent = document.getElementById('modalContent');
        const modalTitle = document.getElementById('modalTitle');
        const quarterSelector = document.getElementById('quarterSelector');
        
        modalTitle.innerText = `Influenciadores - ${data.quarter}`;
        
        // Atualizar botões ativos
        Array.from(quarterSelector.children).forEach((btn, idx) => {
            if (idx === quarterIndex) {
                btn.style.background = '#7c3aed';
                btn.style.borderColor = '#7c3aed';
            } else {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
        
        // Criar conteúdo
        let html = '';
        
        // Estatísticas resumidas (movido para o topo)
        html += `
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #fff; margin-bottom: 15px;">Resumo do Quarter</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div>
                        <div style="color: #a0a0a0; font-size: 0.9rem;">Valor Total</div>
                        <div style="color: #fff; font-size: 1.2rem; font-weight: 600;">R$ ${data.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div>
                        <div style="color: #a0a0a0; font-size: 0.9rem;">Pareto</div>
                        <div style="color: #fbbf24; font-size: 1.2rem; font-weight: 600;">${(data.top5.percent + data.next15.percent).toFixed(1)}%</div>
                    </div>
                    <div>
                        <div style="color: #a0a0a0; font-size: 0.9rem;">Total de Influenciadores</div>
                        <div style="color: #60a5fa; font-size: 1.2rem; font-weight: 600;">${data.totalQtdInflus}</div>
                    </div>
                </div>
            </div>
        `;

        // Top 5
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 1.2rem; color: #fbbf24; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    Top 5
                    <span style="background: #f59e0b; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">
                        ${data.top5.percent.toFixed(1)}% do total
                    </span>
                </h3>
                <div style="display: grid; gap: 12px;">
        `;
        
        data.top5.influs.forEach((inf, idx) => {
            const percent = (inf.value / data.total * 100).toFixed(2);
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 35px; height: 35px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff;">
                            ${idx + 1}
                        </div>
                        <div style="color: #fff; font-size: 1rem;">${inf.name}</div>
                    </div>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <span style="color: #60a5fa; font-weight: 600;">R$ ${inf.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                        <span style="color: #10b981; font-weight: 500;">${percent}%</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
        
        // + Top 20%
        if (data.next15.influs.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 1.2rem; color: #a78bfa; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        Top 20%
                        <span style="background: #7c3aed; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">
                            ${data.next15.percent.toFixed(1)}% do total
                        </span>
                    </h3>
                    <div style="display: grid; gap: 12px;">
            `;
            
            data.next15.influs.forEach((inf, idx) => {
                const percent = (inf.value / data.total * 100).toFixed(2);
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 35px; height: 35px; background: linear-gradient(135deg, #7c3aed, #a78bfa); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff;">
                                ${idx + 6}
                            </div>
                            <div style="color: #fff; font-size: 1rem;">${inf.name}</div>
                        </div>
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <span style="color: #60a5fa; font-weight: 600;">R$ ${inf.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                            <span style="color: #10b981; font-weight: 500;">${percent}%</span>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        modalContent.innerHTML = html;
    };

    // Apenas oculta o modal em vez de removê-lo do DOM
    window.closeInflusModal = function() {
        const modal = document.getElementById('influsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Fechar modal ao clicar fora ou pressionar ESC
    window.onclick = function(event) {
        const modal = document.getElementById('influsModal');
        if (event.target == modal) {
            closeInflusModal();
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            closeInflusModal();
        }
    });

    function updateChart() {
        const datasets = [];
        
        // Preparar dados das barras (percentuais)
        const top5Data = processedData.map(d => visibilityState['Top 5'] ? d.top5.percent : 0);
        const next15Data = processedData.map(d => visibilityState['Top 20%'] ? d.next15.percent : 0);
        const restoData = processedData.map(d => visibilityState['Restante'] ? d.resto.percent : 0);
        
        // Preparar dados das linhas
        const lineTop5 = processedData.map(d => 5);
        const lineTop20 = processedData.map(d => d.listedInflusCount - 5);
        const lineResto = processedData.map(d => d.totalQtdInflus - d.listedInflusCount);

        // Lógica de visualização combinada
        if (isCombinedView) {
            const combinedData = processedData.map(d => d.top5.percent + d.next15.percent);
            const combinedCountData = processedData.map(d => d.listedInflusCount);

            datasets.push({
                label: 'Top 20%',
                data: combinedData,
                backgroundColor: '#7c3aed',
                borderColor: 'transparent',
                borderWidth: 0,
                yAxisID: 'y',
                stack: 'stack1',
                order: 2,
                datalabels: {
                    color: 'whitesmoke',
                    formatter: (value) => value > 0.05 ? value.toFixed(1) + '%' : '',
                    align: 'center',
                    font: { size: 15, weight: 'bold' }
                }
            });

            datasets.push({
                label: 'Restante',
                data: restoData,
                backgroundColor: '#6b7280',
                borderColor: 'transparent',
                borderWidth: 0,
                yAxisID: 'y',
                stack: 'stack1',
                order: 2,
                datalabels: {
                    color: 'whitesmoke',
                    formatter: (value) => value > 0.05 ? value.toFixed(1) + '%' : '',
                    align: 'center',
                    font: { size: 15, weight: 'bold' }
                }
            });

            // Linha da quantidade total do Top 20%
            datasets.push({
                label: 'Top 20% (Qtd)',
                data: combinedCountData,
                type: 'line',
                borderColor: '#7c3aed',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y2',
                order: 1,
                datalabels: { display: false }
            });

            // Linha da quantidade restante
            datasets.push({
                label: 'Restante (Qtd)',
                data: lineResto,
                type: 'line',
                borderColor: '#6b7280',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y2',
                order: 1,
                datalabels: { display: false }
            });

        } else {
            // Lógica de visualização padrão (separada)
            if (visibilityState['Top 5']) {
                datasets.push({
                    label: 'Top 5',
                    data: top5Data,
                    backgroundColor: '#fbbf24',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    yAxisID: 'y',
                    stack: 'stack1',
                    order: 2,
                    datalabels: {
                        color: 'whitesmoke',
                        formatter: (value) => value > 0.05 ? value.toFixed(1) + '%' : '',
                        align: 'center',
                        font: { size: 15, weight: 'bold' }
                    }
                });
            }
            
            if (visibilityState['Top 20%']) {
                datasets.push({
                    label: 'Top 20%',
                    data: next15Data,
                    backgroundColor: '#7c3aed',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    yAxisID: 'y',
                    stack: 'stack1',
                    order: 2,
                    datalabels: {
                        color: 'whitesmoke',
                        formatter: (value) => value > 0.05 ? value.toFixed(1) + '%' : '',
                        align: 'center',
                        font: { size: 15, weight: 'bold' }
                    }
                });
            }
            
            if (visibilityState['Restante']) {
                datasets.push({
                    label: 'Restante',
                    data: restoData,
                    backgroundColor: '#6b7280',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    yAxisID: 'y',
                    stack: 'stack1',
                    order: 2,
                    datalabels: {
                        color: 'whitesmoke',
                        formatter: (value) => value > 0.05 ? value.toFixed(1) + '%' : '',
                        align: 'center',
                        font: { size: 15, weight: 'bold' }
                    }
                });
            }

            if (visibilityState['Top 5 (Qtd)']) {
                datasets.push({
                    label: 'Top 5 (Qtd)',
                    data: lineTop5,
                    type: 'line',
                    borderColor: '#fbbf24',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 1,
                    datalabels: { display: false }
                });
            }
            
            if (visibilityState['Top 20% (Qtd)']) {
                datasets.push({
                    label: 'Top 20% (Qtd)',
                    data: lineTop20,
                    type: 'line',
                    borderColor: '#7c3aed',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 1,
                    datalabels: { display: false }
                });
            }

            if (visibilityState['Restante (Qtd)']) {
                 datasets.push({
                    label: 'Restante (Qtd)',
                    data: lineResto,
                    type: 'line',
                    borderColor: '#6b7280',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 1,
                    datalabels: { display: false }
                });
            }
        }

        if (influsCtx.chart) {
            influsCtx.chart.destroy();
        }
        
        influsCtx.chart = new Chart(influsCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        openInflusModal(index);
                    }
                },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                },
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect',
                            padding: 10,
                            font: { size: 11 },
                            color: '#7a7a7aff',
                            generateLabels: function(chart) {
                                const customLabels = [];
                                
                                if (isCombinedView) {
                                    customLabels.push({
                                        text: 'Top 20%',
                                        fillStyle: '#7c3aed',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        category: 'Top 20%', // Usar o mesmo label do dataset para alternar visibilidade
                                        fontColor: '#7a7a7aff',
                                        pointStyle: 'rect' // Garantir estilo de ponto para barras
                                    });
                                    customLabels.push({
                                        text: 'Restante',
                                        fillStyle: '#6b7280',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        category: 'Restante',
                                        fontColor: '#7a7a7aff',
                                        pointStyle: 'rect' // Garantir estilo de ponto para barras
                                    });
                                    // Espaçador para separar barras de linhas
                                    customLabels.push({ 
                                        text: '   ', 
                                        category: 'spacer', 
                                        hidden: true,
                                        pointStyle: 'none', // IMPORTANTE: Remover a bolinha preta
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent'
                                    });
                                    customLabels.push({
                                        text: 'Top 20% (Qtd)',
                                        fillStyle: 'transparent',
                                        strokeStyle: '#7c3aed',
                                        lineWidth: 2,
                                        hidden: false,
                                        category: 'Top 20% (Qtd)', // Usar o mesmo label do dataset
                                        fontColor: '#7a7a7aff',
                                        pointStyle: 'line' // Estilo de linha para linhas
                                    });
                                    customLabels.push({
                                        text: 'Restante (Qtd)',
                                        fillStyle: 'transparent',
                                        strokeStyle: '#6b7280',
                                        lineWidth: 2,
                                        hidden: false,
                                        category: 'Restante (Qtd)', // Usar o mesmo label do dataset
                                        fontColor: '#7a7a7aff',
                                        pointStyle: 'line' // Estilo de linha para linhas
                                    });

                                } else {
                                    // Legendas para visão padrão (separada)
                                    // Barras
                                    customLabels.push({
                                        text: 'Top 5',
                                        fillStyle: visibilityState['Top 5'] ? '#fbbf24' : '#666',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        category: 'Top 5',
                                        fontColor: visibilityState['Top 5'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'circle' // Garantir estilo de ponto para barras
                                    });
                                    
                                    customLabels.push({
                                        text: 'Top 20%',
                                        fillStyle: visibilityState['Top 20%'] ? '#7c3aed' : '#666',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        category: 'Top 20%',
                                        fontColor: visibilityState['Top 20%'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'circle' // Garantir estilo de ponto para barras
                                    });
                                    
                                    customLabels.push({
                                        text: 'Restante',
                                        fillStyle: visibilityState['Restante'] ? '#6b7280' : '#666',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        category: 'Restante',
                                        fontColor: visibilityState['Restante'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'circle' // Garantir estilo de ponto para barras
                                    });
                                    
                                    // Espaçador para separar barras de linhas
                                    customLabels.push({
                                        text: '   ',
                                        category: 'spacer',
                                        hidden: true,
                                        pointStyle: 'none', // IMPORTANTE: Remover a bolinha preta
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent'
                                    });
                                    
                                    // Linhas
                                    customLabels.push({
                                        text: 'Top 5',
                                        fillStyle: 'transparent',
                                        strokeStyle: visibilityState['Top 5 (Qtd)'] ? '#fbbf24' : '#666',
                                        lineWidth: 2,
                                        hidden: false,
                                        category: 'Top 5 (Qtd)',
                                        fontColor: visibilityState['Top 5 (Qtd)'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'line' // Estilo de linha para linhas
                                    });
                                    
                                    customLabels.push({
                                        text: 'Top 20%',
                                        fillStyle: 'transparent',
                                        strokeStyle: visibilityState['Top 20% (Qtd)'] ? '#7c3aed' : '#666',
                                        lineWidth: 2,
                                        hidden: false,
                                        category: 'Top 20% (Qtd)',
                                        fontColor: visibilityState['Top 20% (Qtd)'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'line' // Estilo de linha para linhas
                                    });
                                    
                                    customLabels.push({
                                        text: 'Restante',
                                        fillStyle: 'transparent',
                                        strokeStyle: visibilityState['Restante (Qtd)'] ? '#6b7280' : '#666',
                                        lineWidth: 2,
                                        hidden: false,
                                        category: 'Restante (Qtd)',
                                        fontColor: visibilityState['Restante (Qtd)'] ? '#7a7a7aff' : '#9e9e9eff',
                                        pointStyle: 'line' // Estilo de linha para linhas
                                    });
                                }

                                return customLabels;
                            }
                        },
                        onClick: (e, legendItem, legend) => {
                            if (legendItem.category === 'spacer') {
                                return;
                            }
                            
                            // Encontrar o índice do dataset usando o texto da legenda
                            // Esta lógica precisa ser robusta para encontrar o dataset correto
                            const index = chart.data.datasets.findIndex(dataset => {
                                // Para o modo combinado, o label será 'Top 20%' ou 'Restante'
                                // Para o modo separado, os labels incluem '(Qtd)' para as linhas
                                return dataset.label === legendItem.text;
                            });

                            if (index !== -1) {
                                chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
                                // Atualizar o estado de visibilidade para refletir na cor da legenda
                                if (visibilityState.hasOwnProperty(legendItem.text)) {
                                    visibilityState[legendItem.text] = !visibilityState[legendItem.text];
                                }
                                chart.update(); // Atualizar o gráfico
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 14,
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label;
                            },
                            label: function() {
                                return null;
                            },
                            afterTitle: function(tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                const data = processedData[index];
                                const lines = [];

                                lines.push('');

                                lines.push(`Valor Soller: R$ ${data.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                
                                if (isCombinedView) {
                                    const combinedSum = data.top5.sum + data.next15.sum;
                                    const combinedPercent = data.top5.percent + data.next15.percent;
                                    const combinedCount = data.listedInflusCount;
                                    
                                    lines.push(`🟣 Top 20%: R$ ${combinedSum.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                    lines.push(`⚪ Restante: R$ ${data.resto.sum.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                    lines.push('');
                                    lines.push('Quantidade:');
                                    lines.push(`🟣 Top 20%: ${combinedCount}`);
                                    lines.push(`⚪ Restante: ${data.totalQtdInflus - combinedCount}`);

                                } else {
                                    if (visibilityState['Top 5']) {
                                        lines.push(`🟡 Top 5: R$ ${data.top5.sum.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                    }
                                    
                                    if (visibilityState['Top 20%']) {
                                        lines.push(`🟣 Top 20%: R$ ${data.next15.sum.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                    }
                                    
                                    if (visibilityState['Restante']) {
                                        lines.push(`⚪ Restante: R$ ${data.resto.sum.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`);
                                    }

                                    lines.push('');
                                    lines.push(`Quantidade: ${data.totalQtdInflus}`);
                                    
                                    lines.push(`🟡 Top 5: ${((5 / data.totalQtdInflus) * 100).toFixed(1)}%`);
                                    lines.push(`🟣 Top 20%: ${data.listedInflusCount - 5}`);
                                    
                                    const restanteCount = data.totalQtdInflus - data.listedInflusCount;
                                    lines.push(`⚪ Restante: ${restanteCount > 0 ? restanteCount : 0}`);
                                }

                                return lines;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: '#7a7a7aff',
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(80, 77, 77, 0.4)',
                            display: true
                        },
                        title: {
                            display: true,
                            text: 'Distribuição do Valor (%)',
                            color: '#7a7a7aff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        max: 90, // Ajuste para acomodar a linha de Total de Influenciadores
                        ticks: {
                            color: '#7a7a7aff',
                            callback: function(value) {
                                return value.toFixed(0);
                            }
                        },
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Qtd. de Influenciadores',
                            color: '#7a7a7aff',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: '#7a7a7aff',
                            maxRotation: 45,
                            minRotation: 0
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            },
            // Adiciona o plugin datalabels localmente
            plugins: [ChartDataLabels]
        });
    }

    const toggleButton = document.getElementById('influsViewToggle');
    if (toggleButton) {
        toggleButton.addEventListener('change', () => {
            isCombinedView = toggleButton.checked;
            updateChart();
        });
    }

    updateChart();
}
// Função para criar gráfico de contratos
function createContractsChart() {
    const contractsCtx = document.getElementById('contractsChart');
    if (!contractsCtx) {
        console.warn('Canvas contractsChart não encontrado');
        return;
    }

    const existingChart = Chart.getChart(contractsCtx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Dados para o gráfico
    const contractsData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        casting: {
            '2023': [0, 5, 23, 75, 114, 97, 69, 101, 62, 78, 79, 60],
            '2024': [45, 46, 54, 69, 61, 65, 80, 77, 92, 102, 73, 103],
            '2025': [68, 74, 82, 110, 122, 107, 94, 77, 100, null, null, null]
        },
        mailing: {
            '2023': [2, 4, 10, 26, 25, 21, 21, 13, 20, 8, 13, 11],
            '2024': [10, 15, 15, 20, 24, 24, 14, 22, 15, 27, 30, 21],
            '2025': [23, 21, 13, 22, 19, 30, 19, 22, 22, null, null, null]
        },
        produtos: {
            '2023': [1, 0, 3, 3, 10, 2, 6, 3, 2, 2, 0, 0],
            '2024': [4, 5, 7, 1, 8, 9, 4, 2, 4, 4, 3, 2],
            '2025': [2, 6, 12, 13, 13, 5, 6, 11, 9, null, null, null]
        },
        total_geral: {
            '2023': [3, 9, 36, 104, 149, 120, 96, 117, 84, 88, 92, 71],
            '2024': [59, 66, 76, 90, 93, 98, 98, 101, 111, 133, 106, 126],
            '2025': [93, 101, 107, 145, 154, 142, 119, 110, 131, null, null, null]
        }
    };
    
    // Cores fixas para cada produto e para as linhas
    const productColors = {
        'Casting': '#7c3aed',
        'Mailing': '#3b82f6',
        'Produto': '#16a34a'
    };
    
    const totalLineColors = {
        '2023': '#bbbbbbff',
        '2024': '#626161ff',
        '2025': '#000000ff'
    };
    
    // Objeto para controlar a visibilidade
    let visibilityState = {
        'Casting': true,
        'Mailing': true,
        'Produto': true,
        'Total Geral': true,
        // Estados individuais por ano
        'Casting_2023': true,
        'Casting_2024': true,
        'Casting_2025': true,
        'Mailing_2023': true,
        'Mailing_2024': true,
        'Mailing_2025': true,
        'Produtos_2023': true,
        'Produtos_2024': true,
        'Produtos_2025': true,
        'Total_2023': true,
        'Total_2024': true,
        'Total_2025': true
    };
    
    // Função para recalcular percentagens dinamicamente baseado na visibilidade
    function calculateDynamicPercentages() {
        const dynamicPercentages = {
            casting: { '2023': [], '2024': [], '2025': [] },
            mailing: { '2023': [], '2024': [], '2025': [] },
            produtos: { '2023': [], '2024': [], '2025': [] }
        };
        
        ['2023', '2024', '2025'].forEach(year => {
            for (let i = 0; i < 12; i++) {
                let visibleTotal = 0;
                
                // Calcular total apenas dos produtos visíveis
                if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
                    visibleTotal += contractsData.casting[year][i] || 0;
                }
                if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
                    visibleTotal += contractsData.mailing[year][i] || 0;
                }
                if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
                    visibleTotal += contractsData.produtos[year][i] || 0;
                }
                
                if (visibleTotal > 0) {
                    // Calcular percentagens baseadas apenas nos produtos visíveis
                    if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
                        dynamicPercentages.casting[year][i] = ((contractsData.casting[year][i] || 0) / visibleTotal) * 100;
                    } else {
                        dynamicPercentages.casting[year][i] = 0;
                    }
                    
                    if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
                        dynamicPercentages.mailing[year][i] = ((contractsData.mailing[year][i] || 0) / visibleTotal) * 100;
                    } else {
                        dynamicPercentages.mailing[year][i] = 0;
                    }
                    
                    if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
                        dynamicPercentages.produtos[year][i] = ((contractsData.produtos[year][i] || 0) / visibleTotal) * 100;
                    } else {
                        dynamicPercentages.produtos[year][i] = 0;
                    }
                } else {
                    dynamicPercentages.casting[year][i] = null;
                    dynamicPercentages.mailing[year][i] = null;
                    dynamicPercentages.produtos[year][i] = null;
                }
            }
        });
        
        return dynamicPercentages;
    }
    
    // Função para calcular totais dinâmicos (refatorada)
    function calculateDynamicTotals() {
        const dynamicTotals = {
            '2023': [],
            '2024': [],
            '2025': []
        };
        
        ['2023', '2024', '2025'].forEach(year => {
            for (let i = 0; i < 12; i++) {
                let total = 0;
                let anyBarDatasetIsVisible = false;

                if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
                    total += contractsData.casting[year][i] || 0;
                    anyBarDatasetIsVisible = true;
                }
                if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
                    total += contractsData.mailing[year][i] || 0;
                    anyBarDatasetIsVisible = true;
                }
                if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
                    total += contractsData.produtos[year][i] || 0;
                    anyBarDatasetIsVisible = true;
                }
                
                // Se nenhum dataset de barra está visível, use o total_geral original se a linha do total estiver visível
                if (!anyBarDatasetIsVisible && visibilityState['Total Geral'] && visibilityState[`Total_${year}`]) {
                    dynamicTotals[year][i] = contractsData.total_geral[year][i] || null;
                } else {
                    dynamicTotals[year][i] = total > 0 ? total : null;
                }
            }
        });
        
        return dynamicTotals;
    }


function updateContractMetrics() {
    const years = ['2023', '2024', '2025'];
    
    years.forEach(year => {
        let totalContracts = 0;
        let monthsWithData = 0;
        let hasVisibleProductData = false; // Flag para verificar se algum produto está visível
        
        // Lógica para somar dados dos produtos visíveis
        if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
            const data = contractsData.casting[year].filter(value => value !== null);
            totalContracts += data.reduce((sum, value) => sum + value, 0);
            monthsWithData = Math.max(monthsWithData, data.length);
            hasVisibleProductData = true;
        }
        if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
            const data = contractsData.mailing[year].filter(value => value !== null);
            totalContracts += data.reduce((sum, value) => sum + value, 0);
            monthsWithData = Math.max(monthsWithData, data.length);
            hasVisibleProductData = true;
        }
        if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
            const data = contractsData.produtos[year].filter(value => value !== null);
            totalContracts += data.reduce((sum, value) => sum + value, 0);
            monthsWithData = Math.max(monthsWithData, data.length);
            hasVisibleProductData = true;
        }

        if (!hasVisibleProductData && visibilityState['Total Geral'] && visibilityState[`Total_${year}`]) {
            const data = contractsData.total_geral[year].filter(value => value !== null);
            totalContracts = data.reduce((sum, value) => sum + value, 0);
            monthsWithData = data.length;
        }

        let average = 0;
        if (monthsWithData > 0) {
            average = Math.round(totalContracts / monthsWithData);
        }

        const metricElement = document.getElementById(`avg-${year}`);
        if (metricElement) {
            let labelText = '/mês';
            const data2025 = contractsData.total_geral[year].filter(value => value !== null);
            labelText = `/mês`;
            
            metricElement.textContent = `${average} ${labelText}`;
        }
    });
}

    
    function updateChart() {
        const percentageData = calculateDynamicPercentages();
        const dynamicTotals = calculateDynamicTotals();
        const datasets = [];

        // Adiciona datasets de barras (100% stacked) para cada ano
        ['2023', '2024', '2025'].forEach(year => {
            if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
                datasets.push({
                    label: `Casting ${year}`,
                    data: percentageData.casting[year],
                    backgroundColor: productColors.Casting,
                    yAxisID: 'y',
                    stack: `contracts-${year}`,
                    order: 2
                });
            }
            if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
                datasets.push({
                    label: `Mailing ${year}`,
                    data: percentageData.mailing[year],
                    backgroundColor: productColors.Mailing,
                    yAxisID: 'y',
                    stack: `contracts-${year}`,
                    order: 2
                });
            }
            if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
                datasets.push({
                    label: `Produto ${year}`,
                    data: percentageData.produtos[year],
                    backgroundColor: productColors.Produto,
                    yAxisID: 'y',
                    stack: `contracts-${year}`,
                    order: 2
                });
            }
        });

        // Adiciona datasets de linha (Total Geral dinâmico)
        if (visibilityState['Total Geral']) {
            ['2023', '2024', '2025'].forEach(year => {
                if (visibilityState[`Total_${year}`]) {
                    datasets.push({
                        label: `Total Geral ${year}`,
                        data: dynamicTotals[year],
                        type: 'line',
                        borderColor: totalLineColors[year],
                        backgroundColor: 'transparent',
                        borderWidth: 4,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 1,
                        yAxisID: 'y2',
                        order: -1
                    });
                }
            });
        }

        if (contractsCtx.chart) {
            contractsCtx.chart.destroy();
        }
        
        contractsCtx.chart = new Chart(contractsCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: contractsData.labels,
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
                        display: false
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect',
                            // O padding aqui define a distância entre os itens
                            padding: 2,
                            font: { size: 11 },
                            color: '#7a7a7aff',
                            // Atualize a função generateLabels dentro das opções da legenda:

                            generateLabels: function(chart) {
                                const customLabels = [];
                                
                                // Casting
                                customLabels.push({
                                    text: 'Casting',
                                    fillStyle: visibilityState.Casting ? productColors.Casting : '#666',
                                    strokeStyle: 'transparent',
                                    hidden: false,
                                    category: 'Casting',
                                    fontColor: visibilityState.Casting ? '#6c6c6cff' : '#9e9e9eff',
                                    itemPadding: 0
                                });
                                ['2023', '2024', '2025'].forEach(year => {
                                    customLabels.push({
                                        text: year,
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        pointStyle: false,
                                        datasetIndex: `Casting_${year}`,
                                        // A cor do texto muda dinamicamente
                                        fontColor: visibilityState[`Casting_${year}`] ? '#6c6c6cff' : '#9e9e9eff',
                                        // A decoração do texto (riscado) é aplicada somente quando o estado é `false`
                                        textDecoration: visibilityState[`Casting_${year}`] ? '' : 'line-through',
                                        itemPadding: 0
                                    });
                                });
                                
                                // Adiciona espaço extra entre os grupos
                                customLabels.push({
                                    text: '    ',
                                    category: 'spacer',
                                    itemPadding: 20,
                                    hidden: true,
                                    pointStyle: false,
                                    fillStyle: 'transparent',
                                    strokeStyle: 'transparent'
                                });
                                
                                // Mailing
                                customLabels.push({
                                    text: 'Mailing',
                                    fillStyle: visibilityState.Mailing ? productColors.Mailing : '#666',
                                    strokeStyle: 'transparent',
                                    hidden: false,
                                    category: 'Mailing',
                                    fontColor: visibilityState.Mailing ? '#6c6c6cff' : '#9e9e9eff',
                                    itemPadding: 0
                                });
                                ['2023', '2024', '2025'].forEach(year => {
                                    customLabels.push({
                                        text: year,
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        pointStyle: false,
                                        datasetIndex: `Mailing_${year}`,
                                        fontColor: visibilityState[`Mailing_${year}`] ? '#6c6c6cff' : '#9e9e9eff',
                                        textDecoration: visibilityState[`Mailing_${year}`] ? '' : 'line-through',
                                        itemPadding: 0
                                    });
                                });
                                
                                // Adiciona espaço extra entre os grupos
                                customLabels.push({
                                    text: '    ',
                                    category: 'spacer',
                                    itemPadding: 20,
                                    hidden: true,
                                    pointStyle: false,
                                    fillStyle: 'transparent',
                                    strokeStyle: 'transparent'
                                });

                                // Produto
                                customLabels.push({
                                    text: 'Produto',
                                    fillStyle: visibilityState.Produto ? productColors.Produto : '#666',
                                    strokeStyle: 'transparent',
                                    hidden: false,
                                    category: 'Produto',
                                    fontColor: visibilityState.Produto ? '#6c6c6cff' : '#9e9e9eff',
                                    itemPadding: 0
                                });
                                ['2023', '2024', '2025'].forEach(year => {
                                    customLabels.push({
                                        text: year,
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        pointStyle: false,
                                        datasetIndex: `Produtos_${year}`,
                                        fontColor: visibilityState[`Produtos_${year}`] ? '#6c6c6cff' : '#9e9e9eff',
                                        textDecoration: visibilityState[`Produtos_${year}`] ? '' : 'line-through',
                                        itemPadding: 0
                                    });
                                });

                                // Adiciona espaço extra entre os grupos
                                customLabels.push({
                                    text: '    ',
                                    category: 'spacer',
                                    itemPadding: 20,
                                    hidden: true,
                                    pointStyle: false,
                                    fillStyle: 'transparent',
                                    strokeStyle: 'transparent'
                                });

                                // Total Geral - configuração especial para a linha
                                customLabels.push({
                                    text: 'Total', // Use 'Total Geral' como texto principal
                                    fillStyle: 'transparent',
                                    strokeStyle: visibilityState['Total Geral'] ? '#6c6c6cff' : '#9e9e9eff',
                                    lineWidth: 2,
                                    hidden: false,
                                    category: 'Total Geral',
                                    fontColor: visibilityState['Total Geral'] ? '#6c6c6cff' : '#9e9e9eff',
                                    // Remova a propriedade pointStyle aqui para usar a do pai 'legend'
                                    pointStyle: 'line', // volta para o padrão para garantir que a bolinha apareça
                                    itemPadding: 0
                                });
                                ['2023', '2024', '2025'].forEach(year => {
                                    customLabels.push({
                                        text: year,
                                        fillStyle: 'transparent',
                                        strokeStyle: 'transparent',
                                        hidden: false,
                                        pointStyle: false,
                                        datasetIndex: `Total_${year}`,
                                        fontColor: visibilityState[`Total_${year}`] ? '#6c6c6cff' : '#9e9e9eff', // Muda a cor do texto do ano
                                        textDecoration: visibilityState[`Total_${year}`] ? '' : 'line-through',
                                        itemPadding: 0
                                    });
                                });
                                
                                return customLabels;
                            }
                        },
                        onClick: (e, legendItem, legend) => {
                            if (legendItem.category === 'spacer') {
                                return; // Ignora o clique no espaçador
                            }
                            
                            if (legendItem.category) {
                                // Clicou no nome do produto/categoria
                                const category = legendItem.category;
                                
                                if (category === 'Total Geral') {
                                    visibilityState['Total Geral'] = !visibilityState['Total Geral'];
                                    visibilityState['Total_2023'] = visibilityState['Total Geral'];
                                    visibilityState['Total_2024'] = visibilityState['Total Geral'];
                                    visibilityState['Total_2025'] = visibilityState['Total Geral'];
                                } else {
                                    visibilityState[category] = !visibilityState[category];
                                    // Se ativando a categoria, ativa todos os anos
                                    if (visibilityState[category]) {
                                        visibilityState[`${category}_2023`] = true;
                                        visibilityState[`${category}_2024`] = true;
                                        visibilityState[`${category}_2025`] = true;
                                    } else {
                                        // Se desativando a categoria, desativa todos os anos
                                        visibilityState[`${category}_2023`] = false;
                                        visibilityState[`${category}_2024`] = false;
                                        visibilityState[`${category}_2025`] = false;
                                    }
                                }
                            } else if (legendItem.datasetIndex) {
                                // Clicou em um ano específico
                                visibilityState[legendItem.datasetIndex] = !visibilityState[legendItem.datasetIndex];
                                
                                // Verificar se todos os anos estão desativados para desativar a categoria
                                const category = legendItem.datasetIndex.split('_')[0];
                                if (category !== 'Total') {
                                    const anyYearActive = visibilityState[`${category}_2023`] || 
                                                        visibilityState[`${category}_2024`] || 
                                                        visibilityState[`${category}_2025`];
                                    // Categoria fica ativa se pelo menos um ano estiver ativo
                                    visibilityState[category] = anyYearActive;
                                } else {
                                    const anyYearActive = visibilityState['Total_2023'] || 
                                                        visibilityState['Total_2024'] || 
                                                        visibilityState['Total_2025'];
                                    visibilityState['Total Geral'] = anyYearActive;
                                }
                            }
                            
                            updateChart();
                            updateContractMetrics();
                            
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 14,
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label;
                            },
                            label: function() {
                                return null;
                            },
                            afterTitle: function(tooltipItems) {
                                const monthIndex = tooltipItems[0].dataIndex;
                                const chart = tooltipItems[0].chart;
                                const lines = [];
                                
                                const yearColors = {
                                    '2025': '🟢',
                                    '2024': '🔴',
                                    '2023': '🔵'
                                };
                                
                                // Agrupa os dados por ano e exibe o total e a composição
                                ['2025', '2024', '2023'].forEach(year => {
                                    let totalVisivel = 0;
                                    const castingData = contractsData.casting[year][monthIndex] || 0;
                                    const mailingData = contractsData.mailing[year][monthIndex] || 0;
                                    const produtosData = contractsData.produtos[year][monthIndex] || 0;
                                    const totalGeralData = contractsData.total_geral[year][monthIndex] || 0;

                                    let hasVisibleData = false;
                                    
                                    if (visibilityState.Casting && visibilityState[`Casting_${year}`]) {
                                        totalVisivel += castingData;
                                        hasVisibleData = true;
                                    }
                                    if (visibilityState.Mailing && visibilityState[`Mailing_${year}`]) {
                                        totalVisivel += mailingData;
                                        hasVisibleData = true;
                                    }
                                    if (visibilityState.Produto && visibilityState[`Produtos_${year}`]) {
                                        totalVisivel += produtosData;
                                        hasVisibleData = true;
                                    }

                                    // Adiciona as informações do ano somente se houver dados visíveis
                                    if (hasVisibleData) {
                                        lines.push(`${yearColors[year]} ${year}: ${totalVisivel}`);
                                        
                                        if (visibilityState.Casting && visibilityState[`Casting_${year}`] && castingData > 0) {
                                            const percentage = Math.round((castingData / totalVisivel) * 100);
                                            lines.push(`  Casting: ${castingData} (${percentage}%)`);
                                        }
                                        
                                        if (visibilityState.Mailing && visibilityState[`Mailing_${year}`] && mailingData > 0) {
                                            const percentage = Math.round((mailingData / totalVisivel) * 100);
                                            lines.push(`  Mailing: ${mailingData} (${percentage}%)`);
                                        }
                                        
                                        if (visibilityState.Produto && visibilityState[`Produtos_${year}`] && produtosData > 0) {
                                            const percentage = Math.round((produtosData / totalVisivel) * 100);
                                            lines.push(`  Produto: ${produtosData} (${percentage}%)`);
                                        }
                                    } else if (visibilityState['Total Geral'] && visibilityState[`Total_${year}`] && totalGeralData > 0) {
                                        // Caso apenas o Total Geral esteja visível
                                        lines.push(`${yearColors[year]} ${year}: ${totalGeralData}`);
                                    }

                                    // Adiciona uma linha vazia para separar os anos, exceto para o último
                                    if (lines.length > 0 && year !== '2023') {
                                        lines.push('');
                                    }
                                });

                                return lines;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: '#7a7a7aff',
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        ticks: {
                            color: '#7a7a7aff',
                            callback: function(value) {
                                return value;
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#7a7a7aff'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateChart();
}

function createGMVChart() {
    const gmvCtx = document.getElementById('gmvChart');
    if (!gmvCtx) return;

    // Destruir gráfico existente de forma segura
    const existingChart = Chart.getChart(gmvCtx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Verificar dados
    if (!window.SollerData.gmv || !window.SollerData.gmv.values || !window.SollerData.gmv.values2) {
        console.warn('Dados de GMV ou de Valor Soller não encontrados');
        return;
    }

    // Preparar dados agrupados por mês
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Separar dados por ano
    const data2023_gmv = window.SollerData.gmv.values.slice(0, 12);
    const data2024_gmv = window.SollerData.gmv.values.slice(12, 24);
    const data2025_gmv = window.SollerData.gmv.values.slice(24, 36);

    const data2023_soller = window.SollerData.gmv.values2.slice(0, 12);
    const data2024_soller = window.SollerData.gmv.values2.slice(12, 24);
    const data2025_soller = window.SollerData.gmv.values2.slice(24, 36);

    // Dados de margem (se existirem)
    const data2023_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(0, 12) : null;
    const data2024_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(12, 24) : null;
    const data2025_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(24, 36) : null;

    const chartConfig = {
        type: 'bar', // Tipo principal do gráfico
        data: {
            labels: months,
            datasets: [
                // Datasets de GMV como barras
                {
                    label: 'GMV 2023',
                    data: data2023_gmv,
                    type: 'bar',
                    backgroundColor: '#00A8FF',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: 'GMV 2024',
                    data: data2024_gmv,
                    type: 'bar',
                    backgroundColor: '#FF375F',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: 'GMV 2025',
                    data: data2025_gmv.map((val, idx) => idx < 9 ? val : null),
                    type: 'bar',
                    backgroundColor: '#00e979ff',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                // Datasets de Soller como linhas
                {
                    label: 'Soller 2023',
                    data: data2023_soller,
                    type: 'line',
                    borderColor: '#00A8FF',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Soller 2024',
                    data: data2024_soller,
                    type: 'line',
                    borderColor: '#FF375F',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Soller 2025',
                    data: data2025_soller.map((val, idx) => idx < 9 ? val : null),
                    type: 'line',
                    borderColor: '#00e979ff',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
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
            layout: {
                padding: {
                    right: 10
                }
            },
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'middle',
                    labels: {
                        usePointStyle: false,
                        padding: 10,
                        font: {
                            size: 12
                        },
                        color: '#f4f4f4',
                        // Lógica para gerar as legendas agrupadas na ordem GMV, Soller
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const customLabels = [];

                            // Adicionar o cabeçalho 'GMV'
                            customLabels.push({ text: 'GMV', category: 'GMV', fontColor: '#666666', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false });

                            // Adicionar os anos de GMV (ordem decrescente)
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('GMV')) {
                                    customLabels.push({
                                        text: dataset.label.split(' ')[1],
                                        fillStyle: dataset.backgroundColor,
                                        strokeStyle: 'transparent',
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#666666'
                                    });
                                }
                            });

                            // Adicionar espaço extra entre os grupos
                            customLabels.push({ text: ' ', fontColor: '#f4f4f4', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false, extraPadding: true });
                            customLabels.push({ text: ' ', fontColor: '#f4f4f4', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false, extraPadding: true });

                            // Adicionar o cabeçalho 'Soller'
                            customLabels.push({ text: 'Soller', category: 'Soller', fontColor: '#666666', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false });

                            // Adicionar os anos de Soller (ordem decrescente)
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('Soller')) {
                                    customLabels.push({
                                        text: dataset.label.split(' ')[1],
                                        fillStyle: 'transparent',
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: 3,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#666666'
                                    });
                                }
                            });
                            return customLabels;
                        },
                        filter: function(item) {
                            return item.text !== '';
                        }
                    },
                    // Lógica aprimorada para o clique nas legendas
                    onClick: (e, legendItem, legend) => {
                        const ci = legend.chart;

                        // Ignora cliques em itens de espaço ou cabeçalhos que não são categorias
                        if (legendItem.text === ' ') return;

                        if (legendItem.category) {
    // Clicou no cabeçalho (GMV ou Soller)
    const category = legendItem.category;

    // Encontrar todos os datasets da categoria
    const datasetsToToggle = ci.data.datasets
        .map((ds, index) => ({ ds, index }))
        .filter(item => item.ds.label.includes(category));

    // Verificar se todos os datasets dessa categoria estão visíveis
    const allVisible = datasetsToToggle.every(item => ci.isDatasetVisible(item.index));

    // Alternar visibilidade de todos de uma vez
    datasetsToToggle.forEach(item => {
        ci.setDatasetVisibility(item.index, !allVisible);
    });
}
 else {
                            // Clicou em um ano individual
                            ci.setDatasetVisibility(legendItem.datasetIndex, !ci.isDatasetVisible(legendItem.datasetIndex));
                        }

                        ci.update();
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 14,
                    displayColors: false, // Desabilitar as cores padrão
                    callbacks: {
                        // Callback para o título do tooltip
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        // Remover labels padrão
                        label: function() {
                            return null;
                        },
                        // Adicionar conteúdo customizado após o título
                        afterTitle: function(tooltipItems) {
                            const monthIndex = tooltipItems[0].dataIndex;
                            const chart = tooltipItems[0].chart;
                            const lines = [];
                            
                            // Definir cores dos anos
                            const yearColors = {
                                '2025': '🟢',
                                '2024': '🔴',
                                '2023': '🔵'
                            };
                            
                            // GMV - sempre mostrar se houver dados
                            lines.push('GMV');
                            
                            // Verificar e adicionar GMV 2025
                            if (monthIndex < 9 && data2025_gmv[monthIndex] && chart.isDatasetVisible(2)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2025_gmv[monthIndex]);
                                lines.push(`${yearColors['2025']} 2025: ${value}`);
                            }
                            
                            // Verificar e adicionar GMV 2024
                            if (data2024_gmv[monthIndex] && chart.isDatasetVisible(1)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2024_gmv[monthIndex]);
                                lines.push(`${yearColors['2024']} 2024: ${value}`);
                            }
                            
                            // Verificar e adicionar GMV 2023
                            if (data2023_gmv[monthIndex] && chart.isDatasetVisible(0)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2023_gmv[monthIndex]);
                                lines.push(`${yearColors['2023']} 2023: ${value}`);
                            }
                            
                            // Adicionar espaçamento entre GMV e Soller
                            lines.push('');
                            
                            // Soller - sempre mostrar se houver dados
                            lines.push('Soller');
                            
                            // Armazenar quais anos de Soller estão visíveis
                            const sollerVisibility = {
                                '2025': false,
                                '2024': false,
                                '2023': false
                            };
                            
                            // Verificar e adicionar Soller 2025
                            if (monthIndex < 9 && data2025_soller[monthIndex] && chart.isDatasetVisible(5)) {
                                sollerVisibility['2025'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2025_soller[monthIndex]);
                                lines.push(`${yearColors['2025']} 2025: ${value}`);
                            }
                            
                            // Verificar e adicionar Soller 2024
                            if (data2024_soller[monthIndex] && chart.isDatasetVisible(4)) {
                                sollerVisibility['2024'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2024_soller[monthIndex]);
                                lines.push(`${yearColors['2024']} 2024: ${value}`);
                            }
                            
                            // Verificar e adicionar Soller 2023
                            if (data2023_soller[monthIndex] && chart.isDatasetVisible(3)) {
                                sollerVisibility['2023'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2023_soller[monthIndex]);
                                lines.push(`${yearColors['2023']} 2023: ${value}`);
                            }
                            
                            // Margem - só mostrar se houver dados E se o respectivo Soller estiver visível
                            if (window.SollerData.gmv.values3) {
                                let hasMargin = false;
                                const marginLines = [];
                                
                                // Verificar Margem 2025
                                if (monthIndex < 9 && data2025_margin && data2025_margin[monthIndex] > 0 && sollerVisibility['2025']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2025']} 2025: ${data2025_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Verificar Margem 2024
                                if (data2024_margin && data2024_margin[monthIndex] > 0 && sollerVisibility['2024']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2024']} 2024: ${data2024_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Verificar Margem 2023
                                if (data2023_margin && data2023_margin[monthIndex] > 0 && sollerVisibility['2023']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2023']} 2023: ${data2023_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Só adicionar seção de Margem se houver dados para mostrar
                                if (hasMargin) {
                                    // Adicionar espaçamento antes de Margem
                                    lines.push('');
                                    lines.push('Margem');
                                    lines.push(...marginLines);
                                }
                            }
                            
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Valor Total (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y2: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Valor Soller (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    gmvCtx.chart = new Chart(gmvCtx.getContext('2d'), chartConfig);
}

function createNichesChart8() {
    const nichesCtx = document.getElementById('nichesChart8');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart8 não encontrado');
        return;
    }
    
    // Destruir gráfico existente de forma segura
    const existingChart = Chart.getChart(nichesCtx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Dados organizados em continuidade temporal (10 trimestres)
    // Q1 2023, Q2 2023, Q3 2023, Q4 2023, Q1 2024, Q2 2024, Q3 2024, Q4 2024, Q1 2025, Q2 2025
    const data = {
        casting_total: [
            41582.07259, 16895.58409, 18560.46276, 16899.37076, // 2023
            18159.39077, 15875.14062, 15463.76302, 17052.76723, // 2024
            19103.06877, 19065.77715 // 2025 (T1 e T2)
        ],
        casting_soller: [
            9354.819704, 2997.33828, 4080.026267, 3695.309858, // 2023
            3847.538634, 2881.680196, 2856.545455, 3167.921796, // 2024
            3873.998273, 3789.990026 // 2025 (T1 e T2)
        ],
        mailing_total: [
            31894.7675, 6615.942029, 11501.6466, 25258.33969, // 2023
            18350.125, 26845.07576, 27515.00043, 22868.38961, // 2024
            47731.24982, 21849.04671 // 2025 (T1 e T2)
        ],
        mailing_soller: [
            4041.03975, 1010.42029, 1891.744415, 3705.120438, // 2023
            2754.975, 5470.069697, 5551.991331, 4375.054545, // 2024
            7884.642821, 3378.951014 // 2025 (T1 e T2)
        ],
        mentoria_total: [
            5812.5, 2784.583333, 4438.5, 22100, // 2023
            3018.75, 5971.666667, 19934.23, 1732.5, // 2024
            15291.30933, 10511.8425 // 2025 (T1 e T2)
        ],
        mentoria_soller: [
            5812.5, 2717.916667, 4438.5, 22100, // 2023
            3018.75, 5791.666667, 19934.23, 1732.5, // 2024
            15291.30933, 9522.556786 // 2025 (T1 e T2)
        ]
    };
    
    // Calcular margens percentuais
    const casting_margin = data.casting_total.map((total, idx) => 
        ((data.casting_soller[idx] / total) * 100)
    );
    const mailing_margin = data.mailing_total.map((total, idx) => 
        ((data.mailing_soller[idx] / total) * 100)
    );
    const mentoria_margin = data.mentoria_total.map((total, idx) => 
        ((data.mentoria_soller[idx] / total) * 100)
    );

    // Labels dos trimestres em continuidade temporal
    const labels = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 
                   'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024',
                   'Q1 2025', 'Q2 2025'];

    // Estado do modo de visualização (false = Soller, true = Margem)
    let isMarginMode = false;
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                // Datasets de Valor Total (Barras Empilhadas) - Eixo Principal Y
                {
                    label: 'Casting Total',
                    data: data.casting_total,
                    type: 'bar',
                    backgroundColor: '#7c3aed',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                },
                {
                    label: 'Mailing Total',
                    data: data.mailing_total,
                    type: 'bar',
                    backgroundColor: '#3b82f6',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                },
                {
                    label: 'Produto Total',
                    data: data.mentoria_total,
                    type: 'bar',
                    backgroundColor: '#16a34a',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                },
                // Datasets de Valor Soller (Linhas) - Eixo Secundário Y2
                {
                    label: 'Casting Soller',
                    originalLabel: 'Casting Soller',
                    marginLabel: 'Casting Margem',
                    data: data.casting_soller,
                    originalData: data.casting_soller,
                    marginData: casting_margin,
                    type: 'line',
                    borderColor: '#7c3aed',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#7c3aed',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Mailing Soller',
                    originalLabel: 'Mailing Soller',
                    marginLabel: 'Mailing Margem',
                    data: data.mailing_soller,
                    originalData: data.mailing_soller,
                    marginData: mailing_margin,
                    type: 'line',
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Produto Soller',
                    originalLabel: 'Produto Soller',
                    marginLabel: 'Produto Margem',
                    data: data.mentoria_soller,
                    originalData: data.mentoria_soller,
                    marginData: mentoria_margin,
                    type: 'line',
                    borderColor: '#16a34a',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#16a34a',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
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
            layout: {
                padding: {
                    right: 10
                }
            },
            plugins: {
                title: {
                    display: false,
                    text: 'Casting • Mailing • Produto',
                    font: { 
                        size: 16, 
                        weight: 'bold' 
                    },
                    color: '#7a7a7aff',
                    padding: {
                        top: 8,
                        bottom: 6
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: '#7a7a7aff',
                        usePointStyle: true,
                        padding: 12,
                        font: {
                            size: 12
                        },
                        // Organizar legendas em grupos como no createServicesChart9
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const customLabels = [];
                            
                            // Adicionar cabeçalho 'Total'
                            customLabels.push({ 
                                text: 'Total', 
                                fontColor: '#7a7a7aff', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false,
                                fontStyle: 'bold',
                                category: 'Total'
                            });
                            
                            // Adicionar datasets de Total
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('Total')) {
                                    customLabels.push({
                                        text: dataset.label.replace(' Total', ''),
                                        fillStyle: dataset.backgroundColor,
                                        strokeStyle: dataset.borderColor,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#7a7a7aff'
                                    });
                                }
                            });
                            
                            // Adicionar espaçamento
                            customLabels.push({ 
                                text: '    ', 
                                fontColor: '#666666', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false 
                            });
                            
                            // Adicionar cabeçalho 'Soller' ou 'Margem'
                            const sollerTitle = isMarginMode ? 'Margem' : 'Soller';
                            customLabels.push({ 
                                text: sollerTitle, 
                                fontColor: '#7a7a7aff', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false,
                                fontStyle: 'bold',
                                category: 'Soller'
                            });
                            
                            // Adicionar datasets de Soller/Margem
                            datasets.forEach((dataset, index) => {
                                if (dataset.originalLabel && dataset.originalLabel.includes('Soller')) {
                                    const labelText = isMarginMode ? 
                                        dataset.marginLabel.replace(' Margem', '') : 
                                        dataset.originalLabel.replace(' Soller', '');
                                    customLabels.push({
                                        text: labelText,
                                        fillStyle: 'transparent',
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: 3,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#7a7a7aff'
                                    });
                                }
                            });
                            
                            return customLabels;
                        }
                    },
                    // ... dentro de plugins: { legend: { onClick: ... }
onClick: (e, legendItem, legend) => {
    const ci = legend.chart;
    
    if (legendItem.category) {
        // Lógica para cabeçalho (Total ou Soller/Margem)
        const category = legendItem.category;
        
        let datasetsToToggle = [];
        if (category === 'Total') {
            datasetsToToggle = ci.data.datasets
                .map((ds, index) => ({ ds, index }))
                .filter(item => item.ds.label.includes('Total'));
        } else {
            // Este `else` agora pega o 'Soller' ou 'Margem'
            datasetsToToggle = ci.data.datasets
                .map((ds, index) => ({ ds, index }))
                .filter(item => item.ds.originalLabel && item.ds.originalLabel.includes('Soller'));
        }
        
        const allVisible = datasetsToToggle.every(item => ci.isDatasetVisible(item.index));
        
        datasetsToToggle.forEach(item => {
            ci.setDatasetVisibility(item.index, !allVisible);
        });
        
    } else if (legendItem.datasetIndex !== undefined) {
        // Lógica original para item individual
        ci.setDatasetVisibility(
            legendItem.datasetIndex, 
            !ci.isDatasetVisible(legendItem.datasetIndex)
        );
    }
    
    ci.update();
}
// ...
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 14,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function() {
                            return null;
                        },
                        afterTitle: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const chart = tooltipItems[0].chart;
                            const lines = [];
                            
                            // Ícones coloridos para cada serviço (mesmas cores dos datasets)
                            const serviceIcons = {
                                'Casting': '🟣',
                                'Mailing': '🔵',
                                'Produto': '🟢'
                            };
                            
                            const services = ['Casting', 'Mailing', 'Produto'];
                            
                            // ----- Grupo TOTAL -----
                            lines.push('Total');
                            services.forEach((srv, i) => {
                                const totalDatasetIndex = i; // Casting=0, Mailing=1, Produto=2
                                if (chart.isDatasetVisible(totalDatasetIndex)) {
                                    const value = new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(chart.data.datasets[totalDatasetIndex].data[dataIndex]);
                                    
                                    lines.push(`${serviceIcons[srv]} ${srv}: ${value}`);
                                }
                            });
                            lines.push('');
                            
                            // ----- Grupo SOLLER/MARGEM -----
                            const sollerTitle = isMarginMode ? 'Margem' : 'Soller';
                            lines.push(sollerTitle);
                            services.forEach((srv, i) => {
                                const sollerDatasetIndex = i + 3; // Casting=3, Mailing=4, Produto=5
                                if (chart.isDatasetVisible(sollerDatasetIndex)) {
                                    if (isMarginMode) {
                                        // Mostrar margem percentual
                                        const dataset = chart.data.datasets[sollerDatasetIndex];
                                        const marginValue = dataset.marginData[dataIndex];
                                        lines.push(`${serviceIcons[srv]} ${srv}: ${marginValue.toFixed(1)}%`);
                                    } else {
                                        // Mostrar valor Soller
                                        const value = new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(chart.data.datasets[sollerDatasetIndex].data[dataIndex]);
                                        
                                        lines.push(`${serviceIcons[srv]} ${srv}: ${value}`);
                                    }
                                }
                            });
                            
                            // Só adicionar seção de Margem se não estivermos no modo margem
                            if (!isMarginMode) {
                                lines.push('');
                                
                                // ----- Grupo MARGEM -----
                                lines.push('Margem');
                                services.forEach((srv, i) => {
                                    const sollerDatasetIndex = i + 3;
                                    const totalDatasetIndex = i;
                                    
                                    if (chart.isDatasetVisible(sollerDatasetIndex) && chart.isDatasetVisible(totalDatasetIndex)) {
                                        const total = chart.data.datasets[totalDatasetIndex].data[dataIndex];
                                        const soller = chart.data.datasets[sollerDatasetIndex].originalData[dataIndex];
                                        const margem = ((soller / total) * 100).toFixed(1) + '%';
                                        
                                        lines.push(`${serviceIcons[srv]} ${srv}: ${margem}`);
                                    }
                                });
                            }
                            
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Valor Total (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            return (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                y2: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Valor Soller (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (isMarginMode) {
                                return value.toFixed(0) + '%';
                            }
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            return (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                x: {
                    stacked: false,
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    };
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), chartConfig);
    
    // Função para alternar entre modo Soller e modo Margem
    function toggleMarginMode() {
        isMarginMode = !isMarginMode;
        
        const chart = nichesCtx.chart;
        const datasets = chart.data.datasets;
        
        // Atualizar datasets das linhas
        datasets.forEach((dataset, index) => {
            if (dataset.originalLabel && dataset.originalLabel.includes('Soller')) {
                if (isMarginMode) {
                    // Mudar para dados de margem
                    dataset.data = [...dataset.marginData]; // Clonar array
                    dataset.label = dataset.marginLabel;
                } else {
                    // Voltar para dados Soller
                    dataset.data = [...dataset.originalData]; // Clonar array
                    dataset.label = dataset.originalLabel;
                }
            }
        });
        
        // Atualizar título do eixo Y2
        chart.options.scales.y2.title.text = isMarginMode ? 
            'Margem Soller (%)' : 
            'Valor Soller (R$)';
        
        // Forçar regeneração das legendas
        chart.options.plugins.legend.labels.generateLabels = chartConfig.options.plugins.legend.labels.generateLabels;
        
        // Atualizar o gráfico
        chart.update();
    }
    
    // Adicionar evento de clique no título do eixo Y2
    nichesCtx.addEventListener('click', function(event) {
        const chart = nichesCtx.chart;
        const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
        const scaleRef = chart.scales.y2;
        
        // Verificar se o clique foi na área do título do eixo Y2
        const titleArea = {
            left: scaleRef.right - 80,
            right: scaleRef.right + 30,
            top: scaleRef.top - 40,
            bottom: scaleRef.bottom + 40
        };
        
        if (canvasPosition.x >= titleArea.left && 
            canvasPosition.x <= titleArea.right &&
            canvasPosition.y >= titleArea.top && 
            canvasPosition.y <= titleArea.bottom) {
            toggleMarginMode();
        }
    });
    
    // Adicionar cursor pointer quando hover sobre o título do eixo Y2
    nichesCtx.addEventListener('mousemove', function(event) {
        const chart = nichesCtx.chart;
        const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
        const scaleRef = chart.scales.y2;
        
        const titleArea = {
            left: scaleRef.right - 80,
            right: scaleRef.right + 30,
            top: scaleRef.top - 40,
            bottom: scaleRef.bottom + 40
        };
        
        if (canvasPosition.x >= titleArea.left && 
            canvasPosition.x <= titleArea.right &&
            canvasPosition.y >= titleArea.top && 
            canvasPosition.y <= titleArea.bottom) {
            nichesCtx.style.cursor = 'pointer';
        } else {
            nichesCtx.style.cursor = 'default';
        }
    });
}

function createServicesChart9() {
    const servicesCtx = document.getElementById('servicesChart9');
    if (!servicesCtx) {
        console.warn('Canvas servicesChart9 não encontrado');
        return;
    }
    
    // Destruir gráfico existente de forma segura
    const existingChart = Chart.getChart(servicesCtx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // === NOVO: Conectando à fonte de verdade centralizada ===
    const serviceData = window.SollerData?.niches?.quarterly?.services;
    
    if (!serviceData || !serviceData.quarters || !serviceData.casting_total) {
        console.warn('Dados de serviços não encontrados em SollerData.niches.quarterly.services');
        return;
    }
    
    // As labels agora vêm diretamente dos dados
    const labels = serviceData.quarters;
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                // Datasets de Valor Total (Barras) - Eixo Principal Y
                {
                    label: 'Casting Total',
                    data: serviceData.casting_total, // Usa dado dinâmico
                    type: 'bar',
                    backgroundColor: '#7c3aed',
                    borderColor: 'transparent',
                    borderWidth: 0, 
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                    stack: 'stack1'
                },
                {
                    label: 'Mailing Total',
                    data: serviceData.mailing_total, // Usa dado dinâmico
                    type: 'bar',
                    backgroundColor: '#3b82f6',
                    borderColor: 'transparent',
                    borderWidth: 0, 
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                    stack: 'stack1'
                },
                {
                    label: 'Produto Total',
                    data: serviceData.produto_total, // Usa dado dinâmico
                    type: 'bar',
                    backgroundColor: '#16a34a',
                    borderColor: 'transparent',
                    borderWidth: 0, 
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1,
                    stack: 'stack1'
                },
                // Datasets de Valor Soller (Linhas) - Eixo Secundário Y2
                {
                    label: 'Casting Soller',
                    data: serviceData.casting_soller, // Usa dado dinâmico
                    type: 'line',
                    borderColor: '#7c3aed',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#7c3aed',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Mailing Soller',
                    data: serviceData.mailing_soller, // Usa dado dinâmico
                    type: 'line',
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Produto Soller',
                    data: serviceData.produto_soller, // Usa dado dinâmico
                    type: 'line',
                    borderColor: '#16a34a',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointBackgroundColor: '#16a34a',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderDash: [],
                    yAxisID: 'y2',
                    order: 0
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
            layout: {
                padding: {
                    right: 10
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Casting (+ Members & Pro) • Mailing • Produto (+ Mentoria)',
                    font: { 
                        size: 16, 
                        weight: 'bold' 
                    },
                    color: '#7a7a7aff',
                    padding: {
                        top: 8,
                        bottom: 6
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: '#7a7a7aff',
                        usePointStyle: true,
                        padding: 12,
                        font: {
                            size: 12
                        },
                        // Organizar legendas em grupos
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const customLabels = [];
                            
                            // Adicionar cabeçalho 'Valor Total'
                            customLabels.push({ 
                                text: 'Total', 
                                fontColor: '#7a7a7aff', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false,
                                fontStyle: 'bold',
                                category: 'Total'
                            });
                            
                            // Adicionar datasets de Total
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('Total')) {
                                    customLabels.push({
                                        text: dataset.label.replace(' Total', ''),
                                        fillStyle: dataset.backgroundColor,
                                        strokeStyle: dataset.borderColor,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#7a7a7aff'
                                    });
                                }
                            });
                            
                            // Adicionar espaçamento
                            customLabels.push({ 
                                text: '    ', 
                                fontColor: '#666666', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false 
                            });
                            
                            // Adicionar cabeçalho 'Valor Soller'
                            customLabels.push({ 
                                text: 'Soller', 
                                fontColor: '#7a7a7aff', 
                                fillStyle: 'transparent', 
                                strokeStyle: 'transparent', 
                                hidden: false,
                                fontStyle: 'bold',
                                category: 'Soller'
                            });
                            
                            // Adicionar datasets de Soller
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('Soller')) {
                                    customLabels.push({
                                        text: dataset.label.replace(' Soller', ''),
                                        fillStyle: 'transparent',
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: 3,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#7a7a7aff'
                                    });
                                }
                            });
                            
                            return customLabels;
                        }
                    },
                    onClick: (e, legendItem, legend) => {
                        const ci = legend.chart;

                        if (legendItem.category) {
                            // Cabeçalho (Total ou Soller)
                            const category = legendItem.category;

                            const datasetsToToggle = ci.data.datasets
                                .map((ds, index) => ({ ds, index }))
                                .filter(item => item.ds.label.includes(category));

                            const allVisible = datasetsToToggle.every(item => ci.isDatasetVisible(item.index));

                            datasetsToToggle.forEach(item => {
                                ci.setDatasetVisibility(item.index, !allVisible);
                            });

                            ci.update();
                        } else if (legendItem.datasetIndex !== undefined) {
                            // Item individual
                            ci.setDatasetVisibility(
                                legendItem.datasetIndex, 
                                !ci.isDatasetVisible(legendItem.datasetIndex)
                            );
                            ci.update();
                        }
                    }

                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 14,
                    displayColors: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function() {
                            return null;
                        },
                        afterTitle: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const chart = tooltipItems[0].chart;
                            const lines = [];

                            // Ícones coloridos para cada serviço
                            const serviceIcons = {
                                'Casting': '🟣',
                                'Mailing': '🔵',
                                'Produto': '🟢'
                            };

                            const services = ['Casting', 'Mailing', 'Produto'];

                            // ----- Grupo TOTAL (GMV) -----
                            lines.push('Total (GMV)');
                            services.forEach((srv, i) => {
                                const totalDatasetIndex = i; // Casting=0, Mailing=1, Produto=2
                                if (chart.isDatasetVisible(totalDatasetIndex)) {
                                    const value = new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(chart.data.datasets[totalDatasetIndex].data[dataIndex]);

                                    lines.push(`${serviceIcons[srv]} ${srv}: ${value}`);
                                }
                            });
                            lines.push('');

                            // ----- Grupo SOLLER -----
                            lines.push('Soller');
                            services.forEach((srv, i) => {
                                const sollerDatasetIndex = i + 3; // Casting=3, Mailing=4, Produto=5
                                if (chart.isDatasetVisible(sollerDatasetIndex)) {
                                    const value = new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(chart.data.datasets[sollerDatasetIndex].data[dataIndex]);

                                    lines.push(`${serviceIcons[srv]} ${srv}: ${value}`);
                                }
                            });

                            return lines;
                        }

                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Valor Total (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            return (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                y2: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Valor Soller (R$)',
                        color: '#666',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            return (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                x: {
                    stacked: true,
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    };
    
    servicesCtx.chart = new Chart(servicesCtx.getContext('2d'), chartConfig);
}

function createServicesPieChart() {
    const pieCtx = document.getElementById('servicesPieChart');
    if (!pieCtx) {
        console.warn('Canvas servicesPieChart não encontrado');
        return;
    }
    
    // CORREÇÃO: Destruir qualquer gráfico Chart.js existente no canvas
    const existingChart = Chart.getChart(pieCtx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // === CORREÇÃO CRÍTICA: BUSCA O DADO NO CAMINHO ANINHADO CORRETO ===
    const serviceData = window.SollerData?.niches?.quarterly?.services;
    // =================================================================

    if (!serviceData || !serviceData.quarters) {
        console.error('Dados de serviços não encontrados em SollerData.niches.quarterly.services');
        return;
    }

    const totalQuarters = serviceData.quarters.length;
    let pieChartInstance = null;
    let currentChartData = null;
    let hiddenIndices = window.pizzaHiddenIndices || [];
    window.pizzaHiddenIndices = hiddenIndices;
    
    // Função para calcular valores baseado nos filtros
    function calculatePieValues() {
        const tipoValorElement = document.querySelector('input[name="pizzaTipoValor"]:checked');
        const periodoElement = document.getElementById('pizzaPeriodoSelect');
        
        const tipoValor = tipoValorElement ? tipoValorElement.value : 'total';
        const periodo = periodoElement ? periodoElement.value : 'all';
        
        let indices = [];
        let periodLabel = 'todos os períodos';

        // Determinar índices baseado no período (Corrigido para totalQuarters)
        if (periodo === 'all') {
            indices = Array.from({ length: totalQuarters }, (_, i) => i);
            periodLabel = 'todos os períodos';
        } else if (periodo === '2023') {
            indices = [0, 1, 2, 3];
            periodLabel = '2023';
        } else if (periodo === '2024') {
            indices = [4, 5, 6, 7];
            periodLabel = '2024';
        } else if (periodo === '2025') {
            indices = [8, 9, 10]; // Inclui Q3 2025 (índice 10)
            periodLabel = '2025 (Jan-Set)'; 
        } else if (!isNaN(parseInt(periodo))) {
            const index = parseInt(periodo);
            if (index >= 0 && index < totalQuarters) {
                 indices = [index];
                 periodLabel = serviceData.quarters[index];
            } else {
                 indices = Array.from({ length: totalQuarters }, (_, i) => i);
            }
        } else {
            indices = Array.from({ length: totalQuarters }, (_, i) => i);
        }

        // Mapeamento simplificado das chaves de dados
        const totalKeys = ['casting_total', 'mailing_total', 'produto_total'];
        const sollerKeys = ['casting_soller', 'mailing_soller', 'produto_soller'];
        const labels = ['Casting', 'Mailing', 'Produto'];
        
        // Somar valores de Total e Soller para o período
        let sumsTotal = totalKeys.map(key => indices.reduce((sum, i) => sum + (serviceData[key][i] || 0), 0));
        let sumsSoller = sollerKeys.map(key => indices.reduce((sum, i) => sum + (serviceData[key][i] || 0), 0));
        
        // Lógica de valores a serem usados no gráfico (total ou soller)
        const values = tipoValor === 'total' ? sumsTotal : sumsSoller;
        
        const totalGeralGMV = sumsTotal.reduce((a, b) => a + b, 0);

        return {
            labels,
            values,
            sumsTotal,
            sumsSoller,
            colors: ['#7c3aed', '#3b82f6', '#16a34a'],
            periodLabel,
            tipoValor,
            total: values.reduce((a, b) => a + b, 0),
            totalGeralGMV 
        };
    }
    
    // Função para recalcular valores visíveis
    function getVisibleData() {
        if (!currentChartData) return { visibleValues: [], visibleTotal: 0, visibleTotalGeralGMV: 0, visibleTotalSoller: 0 };
        
        const visibleValues = currentChartData.values.filter((_, idx) => !hiddenIndices.includes(idx));
        const visibleTotal = visibleValues.reduce((a, b) => a + b, 0);
        
        // GMV Total APENAS dos serviços visíveis
        const visibleSumsTotal = currentChartData.sumsTotal.filter((_, idx) => !hiddenIndices.includes(idx));
        const visibleTotalGeralGMV = visibleSumsTotal.reduce((a, b) => a + b, 0);
        
        // Valor Soller Total APENAS dos serviços visíveis
        const visibleSumsSoller = currentChartData.sumsSoller.filter((_, idx) => !hiddenIndices.includes(idx));
        const visibleTotalSoller = visibleSumsSoller.reduce((a, b) => a + b, 0);
        
        return { visibleValues, visibleTotal, visibleTotalGeralGMV, visibleTotalSoller };
    }
    
    // Função para atualizar o gráfico
    function updatePieChart() {
        currentChartData = calculatePieValues();
        hiddenIndices = window.pizzaHiddenIndices || [];
        
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }
        
        const { visibleLabels, visibleValues, visibleColors } = currentChartData.labels.reduce((acc, label, idx) => {
            if (!hiddenIndices.includes(idx)) {
                acc.visibleLabels.push(label);
                acc.visibleValues.push(currentChartData.values[idx]);
                acc.visibleColors.push(currentChartData.colors[idx]);
            }
            return acc;
        }, { visibleLabels: [], visibleValues: [], visibleColors: [] });

        const { visibleTotal } = getVisibleData();

        pieChartInstance = new Chart(pieCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: visibleLabels,
                datasets: [{
                    data: visibleValues,
                    backgroundColor: visibleColors,
                    borderWidth: 1,
                    borderColor: '#fff',
                    hoverOffset: 1,
                    hoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${currentChartData.tipoValor === 'total' ? 'Valor total (GMV)' : 'Valor Soller'} em ${currentChartData.periodLabel}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20,
                        color: 'whitesmoke'
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13,
                                family: "'Inter', sans-serif"
                            },
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            generateLabels: function(chart) {
                                const data = currentChartData;
                                
                                return data.labels.map((label, i) => {
                                    const hidden = hiddenIndices.includes(i);
                                    const value = data.values[i];
                                    const percentage = visibleTotal > 0 && !hidden ? 
                                        ((value / visibleTotal) * 100).toFixed(1) : 
                                        '0.0';
                                    
                                    return {
                                        text: `${label}: ${hidden ? '---' : percentage + '%'}`,
                                        fillStyle: hidden ? '#cccccc' : data.colors[i],
                                        strokeStyle: hidden ? '#cccccc' : data.colors[i],
                                        hidden: false,
                                        index: i,
                                        textDecoration: hidden ? 'line-through' : '',
                                        fontColor: 'whitesmoke'
                                    };
                                });
                            }
                        },
                        onClick: function(e, legendItem, legend) {
                            const index = legendItem.index;
                            
                            if (hiddenIndices.includes(index)) {
                                hiddenIndices = hiddenIndices.filter(i => i !== index);
                            } else {
                                hiddenIndices.push(index);
                            }
                            
                            window.pizzaHiddenIndices = hiddenIndices;
                            updatePieChart();
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 12,
                        filter: function(tooltipItem) {
                            const itemIndex = currentChartData.labels.indexOf(tooltipItem.label);
                            return !hiddenIndices.includes(itemIndex);
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = visibleTotal > 0 ? ((value / visibleTotal) * 100).toFixed(1) : '0.0';
                                const formatted = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value);
                                return `${label}: ${formatted} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        updatePizzaStats(currentChartData);
    }
    
    // Função para atualizar estatísticas
    function updatePizzaStats(chartData) {
        const statsContainer = document.getElementById('pizzaStatsContainer');
        if (!statsContainer) return;
        
        const { visibleValues, visibleTotal, visibleTotalGeralGMV, visibleTotalSoller } = getVisibleData();
        
        statsContainer.innerHTML = '';
        
        // Card de Total Geral (apenas valores visíveis)
        const totalCard = document.createElement('div');
        totalCard.className = 'pizza-stat-card total';
        totalCard.innerHTML = `
            <div class="stat-label">Total ${chartData.tipoValor === 'total' ? 'GMV' : 'Soller'}</div>
            <div class="stat-value">${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(visibleTotal)}</div>
            <div class="stat-detail">${chartData.periodLabel}</div>
        `;
        statsContainer.appendChild(totalCard);
        
        // Cards individuais para cada serviço (apenas visíveis)
        chartData.labels.forEach((label, index) => {
            if (!hiddenIndices.includes(index)) {
                const value = chartData.values[index];
                const percentage = visibleTotal > 0 ? ((value / visibleTotal) * 100).toFixed(1) : '0.0';
                
                const card = document.createElement('div');
                card.className = `pizza-stat-card ${label.toLowerCase()}`;
                card.innerHTML = `
                    <div class="stat-label">${label}</div>
                    <div class="stat-value">${new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(value)}</div>
                    <div class="stat-detail">${percentage}% do total</div>
                `;
                statsContainer.appendChild(card);
            }
        });

        // Card de Margem Média
        if (chartData.tipoValor === 'soller' && visibleTotalGeralGMV > 0) {
            const margem = ((visibleTotalSoller / visibleTotalGeralGMV) * 100).toFixed(1);
            const margemCard = document.createElement('div');
            margemCard.className = 'pizza-stat-card margem';
            margemCard.innerHTML = `
                <div class="stat-label">Margem Média</div>
                <div class="stat-value">${margem}%</div>
                <div class="stat-detail">Soller / Total (GMV)</div>
            `;
            statsContainer.appendChild(margemCard);
        }
    }
    
    // Event listeners com verificação de existência
    const tipoValorRadios = document.querySelectorAll('input[name="pizzaTipoValor"]');
    if (tipoValorRadios.length > 0) {
        tipoValorRadios.forEach(radio => {
            radio.addEventListener('change', updatePieChart);
        });
    }
    
    const periodoSelect = document.getElementById('pizzaPeriodoSelect');
    if (periodoSelect) {
        periodoSelect.addEventListener('change', updatePieChart);
    }

    // Chamar a função de atualização para a renderização inicial
    updatePieChart();
}

// Função createCharts global para compatibilidade
window.createCharts = function() {
    createAllCharts();
};