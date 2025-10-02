// Strategic Matrix Engine - Motor de cálculo 5D e sincronização
class StrategicMatrixEngine {
    constructor() {
        this.dimensions = ['tech', 'platform', 'recurring', 'b2bFocus'];
        this.sollerPosition = this.calculateInitialPosition();
        this.projectionParams = null;
        this.callbacks = {};
    }

    // Calcula posição inicial da Soller baseado nos dados do forecast
    calculateInitialPosition() {
        // Valores padrão baseados no relatorio.html
        return {
            tech: 30,      // Taxa de automação atual: 15% -> meta 70%
            platform: 25,   // Ainda é agência, pouco marketplace
            recurring: 30,  
            scale: 100,      // 134 influenciadores, mercado Brasil
            b2bFocus: 80    // Foco em empresas (B2B)
        };
    }

    // Atualiza posição baseada nos parâmetros do forecast
    updateFromProjectionParams(params) {
        if (!params) return;
        
        this.projectionParams = params;
        const newPosition = { ...this.sollerPosition };

        // Tech: baseado em CRM, automação e investimento
        let techScore = 30; // base atual
        if (params.crmImplementation) techScore += 5;
        if (params.salesAutomation) techScore += 8;
        if (params.selfServicePlatform) techScore += 10;
        if (params.mobileApp) techScore += 7;
        techScore += (params.techInvestment / 5000000) * 20; // até +20 pontos
        newPosition.tech = Math.min(100, techScore);

        // Platform: marketplace vs agência
        let platformScore = 25; // base
        if (params.marketplaceBeta) platformScore += 15;
        if (params.marketplaceFull) platformScore += 25;
        if (params.selfServicePlatform) platformScore += 8;
        newPosition.platform = Math.min(100, platformScore);

        // Recurring: modelo de receita
        let recurringScore = 10; // base
        if (params.saasRevenue) recurringScore += 30;
        if (params.customerSuccessTeam) recurringScore += 10;
        recurringScore += (100 - params.churnRate) * 0.3; // menos churn = mais recorrência
        newPosition.recurring = Math.min(100, recurringScore);

        // B2B Focus: enterprise vs consumer
        let b2bScore = 80; // base (atual é B2B)
        if (params.microinfluencersProgram) b2bScore -= 8;
        if (params.mobileApp) b2bScore -= 5;
        b2bScore += (params.ticketMedio / 50000) * 10; // ticket maior = mais enterprise
        newPosition.b2bFocus = Math.max(0, Math.min(100, b2bScore));

        this.sollerPosition = newPosition;
        this.trigger('positionUpdated', newPosition);
        this.trigger('connectionsNeedUpdate');
        return newPosition;
    }

    // Converte posição 5D em parâmetros de projeção
    positionToProjectionParams(position) {
        const params = { ...this.projectionParams };
        
        // Churn: inversamente proporcional à tech e recurring
        const churnReduction = (position.tech * 0.3 + position.recurring * 0.4) / 100;
        params.churnRate = 70.9 - (churnReduction * 35); // pode reduzir até 35 pontos

        // Margem: aumenta com tech e platform
        const marginIncrease = (position.tech * 0.2 + position.platform * 0.3) / 100;
        params.margem = 21.7 + (marginIncrease * 8); // pode aumentar até 8 pontos

        // Ticket médio: aumenta com B2B focus
        const ticketMultiplier = 1 + (position.b2bFocus / 100) * 1.5;
        params.ticketMedio = Math.round(17950 * ticketMultiplier);

        // Toggles baseados em limiares
        params.crmImplementation = position.tech > 35;
        params.salesAutomation = position.tech > 40;
        params.customerSuccessTeam = position.recurring > 20;
        params.marketplaceBeta = position.platform > 40;
        params.marketplaceFull = position.platform > 65;
        params.selfServicePlatform = position.platform > 50 && position.tech > 50;
        params.mobileApp = position.tech > 45 && position.scale > 50;
        params.microinfluencersProgram = position.scale > 50 && position.b2bFocus < 70;
        params.saasRevenue = position.recurring > 40 && position.tech > 60;
        params.internationalExpansion = position.scale > 70;

        return params;
    }

    // Calcula distância euclidiana entre duas posições
    calculateDistance(pos1, pos2) {
        let sum = 0;
        this.dimensions.forEach(dim => {
            const diff = pos1[dim] - pos2[dim];
            sum += diff * diff;
        });
        return Math.sqrt(sum);
    }

    // Calcula similaridade percentual
    calculateSimilarity(pos1, pos2) {
        const maxDistance = Math.sqrt(5 * 100 * 100); // distância máxima possível
        const distance = this.calculateDistance(pos1, pos2);
        const similarity = (1 - distance / maxDistance) * 100;
        // Sempre retornar pelo menos 0.1% de similaridade
        return Math.max(0.1, parseFloat(similarity.toFixed(1)));
    }

    // Encontra unicórnios mais próximos
    findNearestUnicorns(position = this.sollerPosition, count = 5) {
        const distances = [];
        
        Object.entries(MatrixData.unicorns).forEach(([key, unicorn]) => {
            const distance = this.calculateDistance(position, unicorn.coordinates);
            const similarity = this.calculateSimilarity(position, unicorn.coordinates);
            
            distances.push({
                key,
                ...unicorn,
                distance,
                similarity
            });
        });
        
        return distances.sort((a, b) => a.distance - b.distance).slice(0, count);
    }

    // Calcula trade-offs de uma mudança de posição
    calculateTradeOffs(fromPosition, toPosition) {
        const tradeOffs = [];
        
        this.dimensions.forEach(dim => {
            const diff = toPosition[dim] - fromPosition[dim];
            if (Math.abs(diff) > 5) {
                const dimData = MatrixData.dimensions[dim];
                
                tradeOffs.push({
                    dimension: dimData.name,
                    from: fromPosition[dim],
                    to: toPosition[dim],
                    change: diff,
                    impact: this.calculateImpact(dim, diff),
                    type: diff > 0 ? 'positive' : 'negative'
                });
            }
        });
        
        return tradeOffs.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }

    // Calcula impacto de mudança em uma dimensão
    calculateImpact(dimension, change) {
        const impacts = {
            tech: {
                cost: 50000 * Math.abs(change), // R$50k por ponto
                time: 0.5 * Math.abs(change),   // 0.5 meses por ponto
                risk: change > 0 ? 'medium' : 'low'
            },
            platform: {
                cost: 100000 * Math.abs(change),
                time: 1 * Math.abs(change),
                risk: change > 0 ? 'high' : 'medium'
            },
            recurring: {
                cost: 30000 * Math.abs(change),
                time: 2 * Math.abs(change), // demora mais para mudar modelo
                risk: change > 0 ? 'high' : 'low'
            },
            b2bFocus: {
                cost: 20000 * Math.abs(change),
                time: 0.8 * Math.abs(change),
                risk: 'low'
            }
        };
        
        return impacts[dimension] || { cost: 0, time: 0, risk: 'unknown' };
    }

    // Encontra caminho ótimo baseado em constraints
    findOptimalPath(constraints = {}) {
        const {
            maxInvestment = 5000000,
            maxTime = 24, // meses
            targetValuation = 1000000000
        } = constraints;
        
        // Estratégia: maximizar valuation respeitando constraints
        const optimalPosition = { ...this.sollerPosition };
        
        // Prioriza dimensões por ROI (baseado em análise dos unicórnios)
        const priorities = [
            { dim: 'recurring', targetValue: 80, weight: 0.3 },
            { dim: 'tech', targetValue: 85, weight: 0.25 },
            { dim: 'platform', targetValue: 85, weight: 0.2 },
            { dim: 'b2bFocus', targetValue: 40, weight: 0.1 }
        ];
        
        let totalCost = 0;
        let totalTime = 0;
        
        priorities.forEach(({ dim, targetValue, weight }) => {
            const currentValue = optimalPosition[dim];
            const gap = targetValue - currentValue;
            
            if (gap > 0) {
                const impact = this.calculateImpact(dim, gap);
                
                // Ajusta movimento baseado em constraints
                let actualMove = gap;
                if (totalCost + impact.cost > maxInvestment) {
                    actualMove = gap * ((maxInvestment - totalCost) / impact.cost);
                }
                if (totalTime + impact.time > maxTime) {
                    actualMove = Math.min(actualMove, gap * ((maxTime - totalTime) / impact.time));
                }
                
                optimalPosition[dim] = currentValue + actualMove;
                totalCost += this.calculateImpact(dim, actualMove).cost;
                totalTime += this.calculateImpact(dim, actualMove).time;
            } else if (gap < 0) {
                // Movimento para baixo é mais fácil
                optimalPosition[dim] = targetValue;
            }
        });
        
        return {
            position: optimalPosition,
            investment: totalCost,
            timeRequired: totalTime,
            estimatedValuation: this.estimateValuation(optimalPosition)
        };
    }

    // Estima valuation baseado na posição 5D
    estimateValuation(position) {
        const baseValuation = 60000000; // R$60M atual
        
        // Multiplicadores baseados nas dimensões
        const techMultiplier = 1 + (position.tech / 100) * 3;
        const platformMultiplier = 1 + (position.platform / 100) * 2.5;
        const recurringMultiplier = 1 + (position.recurring / 100) * 4;
        const scaleMultiplier = 1 + (position.scale / 100) * 2;
        const focusMultiplier = position.b2bFocus > 50 ? 1.2 : 1.5; // B2C tem múltiplos maiores
        
        let valuation = baseValuation;
        valuation *= techMultiplier;
        valuation *= platformMultiplier;
        valuation *= recurringMultiplier;
        valuation *= scaleMultiplier;
        valuation *= focusMultiplier;
        
        // Ajuste por similaridade com unicórnios
        const nearest = this.findNearestUnicorns(position, 3);
        const avgUnicornValuation = nearest.reduce((sum, u) => sum + u.valuation, 0) / 3;
        const similarityFactor = nearest[0].similarity / 100;
        
        // Blend entre cálculo próprio e benchmark
        valuation = valuation * 0.6 + (avgUnicornValuation * 1000000 * similarityFactor) * 0.4;
        
        return Math.round(valuation);
    }

    // Sistema de eventos
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }

    // Análise de cenários Monte Carlo
    runMonteCarloSimulation(iterations = 10000) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            // Varia cada dimensão com ruído gaussiano
            const simPosition = {};
            this.dimensions.forEach(dim => {
                const base = this.sollerPosition[dim];
                const variance = 10; // desvio padrão
                const noise = (Math.random() - 0.5) * 2 * variance;
                simPosition[dim] = Math.max(0, Math.min(100, base + noise));
            });
            
            const valuation = this.estimateValuation(simPosition);
            const nearest = this.findNearestUnicorns(simPosition, 1)[0];
            
            results.push({
                valuation,
                nearestUnicorn: nearest.name,
                similarity: nearest.similarity
            });
        }
        
        // Análise estatística
        results.sort((a, b) => a.valuation - b.valuation);
        const p10 = results[Math.floor(iterations * 0.1)].valuation;
        const p50 = results[Math.floor(iterations * 0.5)].valuation;
        const p90 = results[Math.floor(iterations * 0.9)].valuation;
        
        const unicornCount = results.filter(r => r.valuation >= 1000000000).length;
        const unicornProb = (unicornCount / iterations) * 100;
        
        return {
            percentiles: { p10, p50, p90 },
            unicornProbability: unicornProb,
            mostLikelyPath: this.analyzeMostLikelyPath(results),
            riskAnalysis: this.analyzeRisks(results)
        };
    }

    analyzeMostLikelyPath(results) {
        // Agrupa por unicórnio mais próximo
        const pathCounts = {};
        results.forEach(r => {
            if (!pathCounts[r.nearestUnicorn]) {
                pathCounts[r.nearestUnicorn] = 0;
            }
            pathCounts[r.nearestUnicorn]++;
        });
        
        // Encontra o caminho mais provável
        const mostLikely = Object.entries(pathCounts)
            .sort((a, b) => b[1] - a[1])[0];
        
        return {
            unicorn: mostLikely[0],
            probability: (mostLikely[1] / results.length) * 100
        };
    }

    analyzeRisks(results) {
        const valuations = results.map(r => r.valuation);
        const mean = valuations.reduce((a, b) => a + b, 0) / valuations.length;
        const variance = valuations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / valuations.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean; // coeficiente de variação
        
        return {
            volatility: cv > 0.3 ? 'high' : cv > 0.15 ? 'medium' : 'low',
            downside: results[Math.floor(results.length * 0.05)].valuation,
            upside: results[Math.floor(results.length * 0.95)].valuation
        };
    }

    // Adicione esta função dentro da classe StrategicMatrixEngine
// Onde você tiver o seu último método
getNearestUnicorns() {
    if (!this.allUnicorns || !this.sollerPosition) {
        return [];
    }

    // Normaliza a posição da Soller para um intervalo de 0-1
    const sollerPosNormalized = {
        tech: this.sollerPosition.tech / 100,
        platform: this.sollerPosition.platform / 100,
        recurring: this.sollerPosition.recurring / 100,
        scale: this.sollerPosition.scale / 100,
        b2bFocus: this.sollerPosition.b2bFocus / 100
    };

    const distances = Object.values(this.allUnicorns).map(unicorn => {
        // Normaliza a posição do unicórnio também
        const unicornPosNormalized = {
            tech: unicorn.position.tech / 100,
            platform: unicorn.position.platform / 100,
            recurring: unicorn.position.recurring / 100,
            scale: unicorn.position.scale / 100,
            b2bFocus: unicorn.position.b2bFocus / 100
        };

        // Calcula a distância euclidiana em um espaço 5D
        const distance = Math.sqrt(
            Math.pow(unicornPosNormalized.tech - sollerPosNormalized.tech, 2) +
            Math.pow(unicornPosNormalized.platform - sollerPosNormalized.platform, 2) +
            Math.pow(unicornPosNormalized.recurring - sollerPosNormalized.recurring, 2) +
            Math.pow(unicornPosNormalized.scale - sollerPosNormalized.scale, 2) +
            Math.pow(unicornPosNormalized.b2bFocus - sollerPosNormalized.b2bFocus, 2)
        );

        // O 'match' é o oposto da distância, convertida em porcentagem
        const maxDistance = Math.sqrt(5); 
        const matchPercentage = (1 - (distance / maxDistance)) * 100;

        return {
            name: unicorn.name,
            match: Math.max(0, matchPercentage).toFixed(1)
        };
    });

    distances.sort((a, b) => b.match - a.match);

    return distances.slice(0, 5);
}
}

// Instância global
window.MatrixEngine = new StrategicMatrixEngine();