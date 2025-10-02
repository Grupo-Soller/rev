class SollerDashboard {
    constructor() {
        this.data = window.mockData;
        this.currentView = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadView('dashboard');
        this.updateNotifications();
        this.setupFabActions();
    }

    setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('href').substring(1);
            this.loadView(view);

            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

    setupFabActions() {
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', () => this.openQuickActions());
        }
    }

    loadView(view) {
        this.currentView = view;
        const mainContent = document.querySelector('.main-content');
        
        // Remove a classe 'active' de todos os links do menu lateral
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Adiciona a classe 'active' ao link correspondente à view atual
        const activeLink = document.querySelector(`.nav-link[href="#${view}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Agora, o restante do switch case...
        switch(view) {
            case 'dashboard':
                this.renderDashboard(mainContent);
                break;
            case 'proposals':
                this.renderProposals(mainContent);
                break;
            case 'campaigns':
                this.renderCampaigns(mainContent);
                break;
            case 'influencers':
                this.renderInfluencers(mainContent);
                break;
            case 'analytics':
                this.renderAnalytics(mainContent);
                break;
            case 'settings':
                this.renderSettings(mainContent);
                break;
            default:
                this.renderDashboard(mainContent);
        }
    }

    renderDashboard(container) {
        if (!this.data) return;
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-subtitle">Visão geral das suas campanhas de influência</p>
                </div>
                <button class="btn-primary" onclick="dashboard.openNewProposal()">
                    <i class="fas fa-plus"></i> Nova Proposta
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <span class="stat-badge positive">+${this.data.stats.proposals.growth}%</span>
                    </div>
                    <div class="stat-value">${this.data.stats.proposals.sent}</div>
                    <div class="stat-label">Propostas Enviadas</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-rocket"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.data.stats.campaigns.active}</div>
                    <div class="stat-label">Campanhas Ativas</div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="width: 65%"></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="stat-value">${this.data.stats.influencers.active}</div>
                    <div class="stat-label">Influenciadores Ativos</div>
                    <div class="stat-metric">${this.data.stats.influencers.avgEngagement || 0}% eng.</div>
                </div>
                
                 <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                    <div class="stat-value">R$ ${this.formatNumber(this.data.stats.investment.estimatedReturn, 'k')}</div>
                    <div class="stat-label">Retorno Estimado</div>
                </div>

                <div class="stat-card highlight">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <span class="stat-badge premium">ROI</span>
                    </div>
                    <div class="stat-value">${this.data.stats.campaigns.totalROI}x</div>
                    <div class="stat-label">Retorno Médio</div>
                    <div class="stat-trend">
                        <i class="fas fa-arrow-up"></i> 15% vs mês anterior
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2 class="section-title">Propostas Recentes</h2>
                        <a href="#proposals" class="section-link">Ver todas <i class="fas fa-arrow-right"></i></a>
                    </div>
                    ${this.renderProposalsList(this.data.proposals.slice(0, 3))}
                </div>

                <div class="dashboard-section">
                    <div class="section-header">
                        <h2 class="section-title">Performance em Tempo Real</h2>
                        <div class="live-indicator">
                            <span class="pulse"></span> Ao vivo
                        </div>
                    </div>
                    <div class="performance-metrics">
                        ${this.renderPerformanceMetrics()}
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2 class="section-title">Campanhas em Destaque</h2>
                    </div>
                    ${this.renderCampaignCards()}
                </div>

                <div class="dashboard-section">
                    <div class="section-header">
                        <h2 class="section-title">Atividades Recentes</h2>
                    </div>
                    ${this.renderActivityFeed()}
                </div>
            </div>
        `;
    }

    renderProposals(container) {
        if (!this.data || !this.data.proposals) return;
        const statusFilters = ['all', 'pending', 'in_review', 'approved', 'rejected'];
        const activeFilter = 'all';
        
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Propostas</h1>
                    <p class="page-subtitle">Gerencie todas as suas propostas de influenciadores</p>
                </div>
                <div class="page-actions">
                    <button class="btn-secondary" onclick="dashboard.exportProposals()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                    <button class="btn-primary" onclick="dashboard.openNewProposal()">
                        <i class="fas fa-plus"></i> Nova Proposta
                    </button>
                </div>
            </div>

            <div class="filters-bar">
                <div class="filter-tabs">
                    ${statusFilters.map(filter => `
                        <button class="filter-tab ${filter === activeFilter ? 'active' : ''}" 
                                onclick="dashboard.filterProposals('${filter}')">
                            ${this.getFilterLabel(filter)}
                            <span class="filter-count">${this.getProposalCount(filter)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="filter-actions">
                    
                    <select class="filter-select" onchange="dashboard.sortProposals(this.value)">
                        <option value="recent">Mais recentes</option>
                        <option value="value">Maior valor</option>
                        <option value="engagement">Maior engajamento</option>
                    </select>
                </div>
            </div>

            <div class="proposals-pipeline">
                ${this.renderProposalsPipeline()}
            </div>

            <div class="proposals-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Influenciador</th>
                            <th>Campanha</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Alcance</th>
                            <th>Engajamento</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.proposals.map(prop => this.renderProposalRow(prop)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderCampaigns(container) {
        if (!this.data) return;
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Campanhas</h1>
                    <p class="page-subtitle">Acompanhe o progresso de todas as suas campanhas</p>
                </div>
                <button class="btn-primary" onclick="dashboard.openNewCampaign()">
                    <i class="fas fa-plus"></i> Nova Campanha
                </button>
            </div>

            <div class="campaigns-overview">
                <div class="overview-card">
                    <div class="overview-icon active">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="overview-content">
                        <span class="overview-value">${this.data.stats.campaigns.active}</span>
                        <span class="overview-label">Ativas</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon scheduled">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="overview-content">
                        <span class="overview-value">${this.data.stats.campaigns.scheduled}</span>
                        <span class="overview-label">Agendadas</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon completed">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="overview-content">
                        <span class="overview-value">${this.data.stats.campaigns.completed}</span>
                        <span class="overview-label">Concluídas</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon roi">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="overview-content">
                        <span class="overview-value">${this.data.stats.campaigns.totalROI}x</span>
                        <span class="overview-label">ROI Médio</span>
                    </div>
                </div>
            </div>

            <div class="campaigns-grid">
                ${this.data.campaigns.map(campaign => this.renderCampaignDetailCard(campaign)).join('')}
            </div>
        `;
    }

    renderInfluencers(container) {
        if (!this.data) return;
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Influenciadores</h1>
                    <p class="page-subtitle">Sua rede de criadores de conteúdo parceiros</p>
                </div>
                <div class="page-actions">
                    <button class="btn-secondary" onclick="dashboard.openInfluencerSearch()">
                        <i class="fas fa-search"></i> Descobrir Novos
                    </button>
                    <button class="btn-primary" onclick="dashboard.inviteInfluencer()">
                        <i class="fas fa-user-plus"></i> Convidar
                    </button>
                </div>
            </div>

            <div class="influencer-tiers">
                <div class="tier-card platinum">
                    <div class="tier-header">
                        <i class="fas fa-crown"></i>
                        <span>Platinum</span>
                    </div>
                    <div class="tier-count">${this.data.influencers.filter(inf => inf.tier === 'platinum').length}</div>
                    <div class="tier-label">Embaixadores</div>
                </div>
                <div class="tier-card gold">
                    <div class="tier-header">
                        <i class="fas fa-star"></i>
                        <span>Gold</span>
                    </div>
                    <div class="tier-count">${this.data.influencers.filter(inf => inf.tier === 'gold').length}</div>
                    <div class="tier-label">Frequentes</div>
                </div>
                <div class="tier-card silver">
                    <div class="tier-header">
                        <i class="fas fa-medal"></i>
                        <span>Silver</span>
                    </div>
                    <div class="tier-count">${this.data.influencers.filter(inf => inf.tier === 'silver').length}</div>
                    <div class="tier-label">Regulares</div>
                </div>
                <div class="tier-card bronze">
                    <div class="tier-header">
                        <i class="fas fa-certificate"></i>
                        <span>Bronze</span>
                    </div>
                    <div class="tier-count">${this.data.influencers.filter(inf => inf.tier === 'bronze').length}</div>
                    <div class="tier-label">Iniciantes</div>
                </div>
            </div>

            <div class="influencers-management">
                <div class="management-filters">
                    <input type="text" placeholder="Buscar influenciador..." class="search-input">
                    <select class="filter-select">
                        <option>Todas as categorias</option>
                        <option>Fashion</option>
                        <option>Beauty</option>
                        <option>Tech</option>
                        <option>Lifestyle</option>
                    </select>
                    <select class="filter-select">
                        <option>Todos os status</option>
                        <option>Ativos</option>
                        <option>Inativos</option>
                        <option>Convidados</option>
                    </select>
                </div>

                <div class="influencers-grid">
                    ${this.data.influencers.map(inf => this.renderInfluencerCard(inf)).join('')}
                </div>
            </div>
        `;
    }

    renderAnalytics(container) {
        if (!this.data) return;
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Analytics</h1>
                    <p class="page-subtitle">Insights detalhados sobre suas campanhas</p>
                </div>
                <div class="page-actions">
                    <select class="period-select">
                        <option>Últimos 30 dias</option>
                        <option>Últimos 90 dias</option>
                        <option>Este ano</option>
                    </select>
                    <button class="btn-secondary" onclick="dashboard.exportReport()">
                        <i class="fas fa-file-pdf"></i> Gerar Relatório
                    </button>
                </div>
            </div>

            <div class="analytics-summary">
                <div class="summary-card primary">
                    <div class="summary-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="summary-content">
                        <span class="summary-label">Alcance Total</span>
                        <span class="summary-value">${this.formatNumber(this.data.analytics.overview.totalReach, 'M')}</span>
                        <span class="summary-trend positive">+23% vs período anterior</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="summary-content">
                        <span class="summary-label">Engajamento Médio</span>
                        <span class="summary-value">${this.data.analytics.overview.avgEngagement || 0}%</span>
                        <span class="summary-trend positive">+0.5pp</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="summary-content">
                        <span class="summary-label">Conversões</span>
                        <span class="summary-value">${this.formatNumber(this.data.analytics.overview.totalConversions, 'K')}</span>
                        <span class="summary-trend positive">+18%</span>
                    </div>
                </div>
                <div class="summary-card accent">
                    <div class="summary-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="summary-content">
                        <span class="summary-label">ROI</span>
                        <span class="summary-value">${this.data.analytics.overview.avgROI}x</span>
                        <span class="summary-trend positive">+0.8x</span>
                    </div>
                </div>
            </div>

            <div class="analytics-charts">
                <div class="chart-container large">
                    <div class="chart-header">
                        <h3>Evolução de Performance</h3>
                        <div class="chart-controls">
                            <button class="chart-btn active">Alcance</button>
                            <button class="chart-btn">Engajamento</button>
                            <button class="chart-btn">ROI</button>
                        </div>
                    </div>
                    <canvas id="performance-chart" height="350"></canvas>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3>Performance por Categoria</h3>
                    </div>
                    <canvas id="category-chart"></canvas>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3>Distribuição de Conteúdo</h3>
                    </div>
                    <canvas id="content-chart"></canvas>
                </div>
            </div>

            <div class="analytics-tables">
                <div class="table-section">
                    <h3>Top Influenciadores</h3>
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Influenciador</th>
                                <th>Campanhas</th>
                                <th>Alcance Total</th>
                                <th>ROI Médio</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.analytics.topPerformers.map(perf => `
                                <tr>
                                    <td>${perf.influencer}</td>
                                    <td>${perf.campaigns}</td>
                                    <td>${this.formatNumber(perf.totalReach)}</td>
                                    <td>${perf.avgROI}x</td>
                                    <td><span class="trend-indicator up">↑</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.initAnalyticsCharts();
    }

    renderSettings(container) {
        if (!this.data) return;
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Configurações</h1>
                    <p class="page-subtitle">Gerencie sua conta e preferências</p>
                </div>
            </div>

            <div class="settings-container">
                <div class="settings-nav">
                    <a href="#" class="settings-nav-item active">
                        <i class="fas fa-building"></i> Empresa
                    </a>
                    <a href="#" class="settings-nav-item">
                        <i class="fas fa-users"></i> Equipe
                    </a>
                    <a href="#" class="settings-nav-item">
                        <i class="fas fa-credit-card"></i> Faturamento
                    </a>
                    <a href="#" class="settings-nav-item">
                        <i class="fas fa-bell"></i> Notificações
                    </a>
                    <a href="#" class="settings-nav-item">
                        <i class="fas fa-key"></i> API
                    </a>
                    <a href="#" class="settings-nav-item">
                        <i class="fas fa-shield-alt"></i> Segurança
                    </a>
                </div>

                <div class="settings-content">
                    <div class="settings-section">
                        <h3>Informações da Empresa</h3>
                        <form class="settings-form">
                            <div class="form-group">
                                <label>Nome da Empresa</label>
                                <input type="text" value="${this.data.company.name}" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>CNPJ</label>
                                <input type="text" value="${this.data.company.cnpj}" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Website</label>
                                <input type="text" value="${this.data.company.website}" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Indústria</label>
                                <select class="form-input">
                                    <option>Tecnologia</option>
                                    <option>E-commerce</option>
                                    <option>Serviços</option>
                                    <option>Varejo</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-primary">Salvar Alterações</button>
                        </form>
                    </div>

                    <div class="settings-section">
                        <h3>Plano Atual</h3>
                        <div class="plan-info">
                            <div class="plan-header">
                                <span class="plan-name">Premium</span>
                                <span class="plan-price">R$ 997/mês</span>
                            </div>
                            <div class="plan-features">
                                <div class="feature-item">
                                    <i class="fas fa-check"></i> Campanhas ilimitadas
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check"></i> Até 50 influenciadores ativos
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check"></i> Analytics avançado
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-check"></i> Suporte prioritário
                                </div>
                            </div>
                            <button class="btn-secondary">Fazer Upgrade</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProposalsList(proposals) {
        if (!proposals || proposals.length === 0) return `<p style="text-align:center; color:var(--gray-500); padding: 2rem;">Nenhuma proposta recente.</p>`;
        return `
            <div class="proposals-list">
                ${proposals.map(prop => `
                    <div class="proposal-item" onclick="dashboard.viewProposal('${prop.id}')">
                        <div class="proposal-avatar">
                            <img src="${prop.influencer.avatar}" alt="${prop.influencer.name}">
                        </div>
                        <div class="proposal-info">
                            <div class="proposal-header">
                                <strong>${prop.influencer.name}</strong>
                                <span class="status-badge status-${prop.status}">${this.getStatusLabel(prop.status)}</span>
                            </div>
                            <div class="proposal-details">
                                <span>${prop.campaign}</span>
                                <span class="separator">•</span>
                                <span>R$ ${this.formatNumber(prop.value, 'k')}</span>
                            </div>
                        </div>
                        <div class="proposal-action">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderProposalRow(proposal) {
        return `
            <tr>
                <td>
                    <div class="influencer-cell">
                        <img src="${proposal.influencer.avatar}" alt="${proposal.influencer.name}">
                        <div>
                            <strong>${proposal.influencer.name}</strong>
                            <span>${proposal.influencer.handle}</span>
                        </div>
                    </div>
                </td>
                <td>${proposal.campaign}</td>
                <td>R$ ${this.formatNumber(proposal.value)}</td>
                <td><span class="status-badge status-${proposal.status}">${this.getStatusLabel(proposal.status)}</span></td>
                <td>${this.formatNumber(proposal.estimatedReach || 0)}</td>
                <td>${proposal.influencer.engagement || 0}%</td>
                <td>${this.formatDate(proposal.createdAt)}</td>
                <td>
                    <div class="action-buttons">

                        <button class="action-btn" onclick="dashboard.editProposal('${proposal.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="dashboard.messageInfluencer('${proposal.influencer.id}')">
                            <i class="fas fa-comment"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderProposalsPipeline() {
        const pipeline = {
            pending: this.data.proposals.filter(p => p.status === 'pending'),
            in_review: this.data.proposals.filter(p => p.status === 'in_review'),
            approved: this.data.proposals.filter(p => p.status === 'approved'),
            rejected: this.data.proposals.filter(p => p.status === 'rejected')
        };

        return `
            <div class="pipeline-stages">
                <div class="pipeline-stage">
                    <div class="stage-header">
                        <span>Pendentes</span>
                        <span class="stage-count">${pipeline.pending.length}</span>
                    </div>
                    <div class="stage-value">R$ ${this.calculateTotal(pipeline.pending)}</div>
                </div>
                <div class="pipeline-arrow">→</div>
                <div class="pipeline-stage">
                    <div class="stage-header">
                        <span>Em Análise</span>
                        <span class="stage-count">${pipeline.in_review.length}</span>
                    </div>
                    <div class="stage-value">R$ ${this.calculateTotal(pipeline.in_review)}</div>
                </div>
                <div class="pipeline-arrow">→</div>
                <div class="pipeline-stage success">
                    <div class="stage-header">
                        <span>Aprovadas</span>
                        <span class="stage-count">${pipeline.approved.length}</span>
                    </div>
                    <div class="stage-value">R$ ${this.calculateTotal(pipeline.approved)}</div>
                </div>
            </div>
        `;
    }

    renderCampaignDetailCard(campaign) {
        if (!campaign) return '';
        
        const deliverables = campaign.deliverables || { completed: 0, total: 0 };
        const progress = deliverables.total > 0 ? (deliverables.completed / deliverables.total) * 100 : 0;
        const budget = campaign.budget || 0;
        const spent = campaign.spent || 0;
        const budgetUsed = budget > 0 ? (spent / budget) * 100 : 0;
        const influencers = campaign.influencers || [];

        return `
            <div class="campaign-card ${campaign.status}">
                <div class="campaign-status-indicator ${campaign.status}"></div>
                <div class="campaign-header">
                    <h3>${campaign.name}</h3>
                    <div class="campaign-menu">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
                
                <div class="campaign-dates">
                    <i class="fas fa-calendar"></i>
                    ${this.formatDate(campaign.startDate)} - ${this.formatDate(campaign.endDate)}
                </div>

                <div class="campaign-metrics">
                    <div class="metric">
                        <span class="metric-label">Progresso</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <span class="metric-value">${deliverables.completed}/${deliverables.total}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Orçamento</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar ${budgetUsed > 80 ? 'warning' : ''}" style="width: ${budgetUsed}%"></div>
                        </div>
                        <span class="metric-value">R$ ${this.formatNumber(spent)}</span>
                    </div>
                </div>

                <div class="campaign-influencers">
                    <div class="influencer-avatars">
                        ${influencers.slice(0, 3).map(inf => `
                            <img src="https://randomuser.me/api/portraits/women/${inf.id}.jpg" alt="${inf.name}">
                        `).join('')}
                        ${influencers.length > 3 ? `<span class="more">+${influencers.length - 3}</span>` : ''}
                    </div>
                </div>

                ${campaign.performance ? `
                    <div class="campaign-performance">
                        <div class="perf-item">
                            <i class="fas fa-eye"></i>
                            <span>${this.formatNumber(campaign.performance.reach)}</span>
                        </div>
                        <div class="perf-item">
                            <i class="fas fa-heart"></i>
                            <span>${campaign.performance.engagement || 0}%</span>
                        </div>
                        <div class="perf-item">
                            <i class="fas fa-chart-line"></i>
                            <span>${campaign.performance.roi || 0}x</span>
                        </div>
                    </div>
                ` : ''}

                <div class="campaign-actions">
                    <button class="btn-secondary" onclick="dashboard.viewCampaign('${campaign.id}')">
                        Ver Detalhes
                    </button>
                    ${campaign.status === 'active' ? `
                        <button class="btn-primary" onclick="dashboard.manageCampaign('${campaign.id}')">
                            Gerenciar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderInfluencerCard(influencer) {
        if (!influencer) return '';
        return `
            <div class="influencer-card">
                <div class="influencer-tier ${influencer.tier}">
                    ${influencer.tier}
                </div>
                <div class="influencer-header">
                    <img src="${influencer.avatar}" alt="${influencer.name}">
                    <div class="influencer-status ${influencer.status}"></div>
                </div>
                <div class="influencer-info">
                    <h4>${influencer.name}</h4>
                    <span class="handle">${influencer.handle}</span>
                    <div class="influencer-categories">
                        ${influencer.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                    </div>
                </div>
                <div class="influencer-stats">
                    <div class="stat">
                        <span class="stat-value">${this.formatNumber(influencer.followers || 0)}</span>
                        <span class="stat-label">Seguidores</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${influencer.engagement || 0}%</span>
                        <span class="stat-label">Engajamento</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${influencer.avgROI || 0}x</span>
                        <span class="stat-label">ROI Médio</span>
                    </div>
                </div>
                <div class="influencer-performance">
                    <div class="perf-metric">
                        <span>Match Score</span>
                        <span class="match-score">${influencer.matchScore || 0}%</span>
                    </div>
                    <div class="perf-metric">
                        <span>Investido</span>
                        <span>R$ ${this.formatNumber(influencer.totalInvested || 0)}</span>
                    </div>
                </div>
                <div class="influencer-actions">
                    <button class="btn-secondary" onclick="dashboard.viewInfluencerProfile('${influencer.id}')">
                        Ver Perfil
                    </button>
                    <button class="btn-primary" onclick="dashboard.createProposalFor('${influencer.id}')">
                        Enviar Proposta
                    </button>
                </div>
            </div>
        `;
    }

    renderPerformanceMetrics() {
        return `
            <div class="real-time-metrics">
                <div class="metric-card">
                    
                        <i class="fas fa-eye"></i>
                    
                    <div class="metric-info">
                    <span class="metric-label">Views</span>
                        <span class="metric-value">12.5K</span>
                        
                        <span class="metric-trend positive">↑ 23%</span>
                    </div>
                </div>
                <div class="metric-card">
                    
                        <i class="fas fa-heart"></i>
                    
                    <div class="metric-info">
                    <span class="metric-label">Engajamentos/h</span>
                        <span class="metric-value">856</span>
                        
                        <span class="metric-trend positive">↑ 15%</span>
                    </div>
                </div>
                
                <div class="metric-card">
                    
                        <i class="fas fa-comment"></i>
                    
                    <div class="metric-info">
                    <span class="metric-label">Comentários</span>
                        <span class="metric-value">89</span>
                        
                        <span class="metric-trend negative">↓ 5%</span>
                    </div>
                </div>
                <div class="metric-card">
                    
                        <i class="fas fa-share"></i>
                    
                    <div class="metric-info">
                    <span class="metric-label">Envios</span>
                        <span class="metric-value">234</span>
                        
                        <span class="metric-trend neutral">→ 0%</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCampaignCards() {
        if (!this.data) return '';
        return `
            <div class="featured-campaigns">
                ${this.data.campaigns.filter(c => c.status === 'active').slice(0, 2).map(campaign => `
                    <div class="featured-campaign-card">
                        <div class="campaign-badge ${campaign.status}">${campaign.status}</div>
                        <h4>${campaign.name}</h4>
                        <div class="campaign-quick-stats">
                            <div class="quick-stat">
                                <i class="fas fa-users"></i>
                                <span>${campaign.influencers.length} influenciadores</span>
                            </div>
                            <div class="quick-stat">
                                <i class="fas fa-tasks"></i>
                                <span>${campaign.deliverables.completed}/${campaign.deliverables.total} entregas</span>
                            </div>
                            ${campaign.performance ? `
                                <div class="quick-stat">
                                    <i class="fas fa-chart-line"></i>
                                    <span>${campaign.performance.roi || 0}x ROI</span>
                                </div>
                            ` : ''}
                        </div>
                        <button class="btn-link" onclick="dashboard.viewCampaign('${campaign.id}')">
                            Ver detalhes →
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderActivityFeed() {
        if (!this.data) return '';
        return `
            <div class="activity-feed">
                ${this.data.activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon ${activity.type}">
                            ${this.getActivityIcon(activity.type)}
                        </div>
                        <div class="activity-content">
                            <strong>${activity.title}</strong>
                            <p>${activity.description}</p>
                            <span class="activity-time">${activity.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateNotifications() {
        if (!this.data) return;
        const unreadCount = this.data.notifications.filter(n => n.unread).length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    openQuickActions() {
        if (window.modals) {
        window.modals.openQuickActions();
    } else {
        const modalContent = `
            <div class="fab-modal-content">
                <button class="fab-item" onclick="dashboard.openNewProposal()">
                    <i class="fas fa-file-alt"></i>
                    <span>Nova Proposta</span>
                </button>
                <button class="fab-item" onclick="dashboard.openNewCampaign()">
                    <i class="fas fa-bullhorn"></i>
                    <span>Nova Campanha</span>
                </button>
                <button class="fab-item" onclick="dashboard.inviteInfluencer()">
                    <i class="fas fa-user-plus"></i>
                    <span>Convidar Influenciador</span>
                </button>
            </div>
        `;
        this.openModal('Ações Rápidas', modalContent);}
    }

    createProposalFor(influencerId) {
    if (window.modals) {
        window.modals.createProposalFor(influencerId);
    } else {
        this.openNewProposal();
    }
}
    
openNotifications() {
    if (!this.data || !this.data.notifications) {
        if (window.modals) {
            window.modals.showToast('Nenhuma notificação encontrada', 'info');
        }
        return;
    }

    if (window.modals) {
        window.modals.openNotifications(this.data.notifications);
    } else {
        // Código de fallback original
        const modalContent = `
            <div class="notifications-list">
                ${this.data.notifications.map(notif => `
                    <div class="notification-item ${notif.unread ? 'unread' : 'read'}">
                        <div class="notification-content">
                            <strong>${notif.message}</strong>
                            <span class="notification-time">${notif.time} atrás</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.openModal('Notificações', modalContent);
    }
}

    openNewProposal() {
    if (window.modals) {
        window.modals.openNewProposal();
    } else {
        // Fallback para o código anterior
        this.openModal('Nova Proposta', this.getProposalForm());
    }
}

    openNewCampaign() {
    if (window.modals) {
        window.modals.openNewCampaign();
    } else {
        // Fallback
        this.openModal('Nova Campanha', this.getCampaignForm());
    }
}
    
    viewProposal(id) {
    const proposal = this.data.proposals.find(p => p.id === id);
    if (!proposal) {
        if (window.modals) {
            window.modals.showToast('Proposta não encontrada', 'error');
        }
        return;
    }

    if (window.modals) {
        window.modals.viewProposal(proposal);
    } else {
        const modalContent = `
            <div class="modal-view-content">
                <h3>Detalhes da Proposta</h3>
                <p><strong>Influenciador:</strong> ${proposal.influencer.name}</p>
                <p><strong>Campanha:</strong> ${proposal.campaign}</p>
                <p><strong>Valor:</strong> R$ ${this.formatNumber(proposal.value)}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${proposal.status}">${this.getStatusLabel(proposal.status)}</span></p>
                <p><strong>Alcance Estimado:</strong> ${this.formatNumber(proposal.estimatedReach || 0)}</p>
                <p><strong>Engajamento:</strong> ${proposal.influencer.engagement || 0}%</p>
                
                <h4>Negociação</h4>
                ${proposal.negotiation ? `
                    <p><strong>Valor Original:</strong> R$ ${this.formatNumber(proposal.negotiation.originalValue)}</p>
                    <p><strong>Desconto:</strong> ${proposal.negotiation.discount}%</p>
                    <p><strong>Mensagens trocadas:</strong> ${proposal.negotiation.messages}</p>
                ` : `<p>Nenhuma negociação registrada.</p>`}
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="dashboard.closeModal()">Fechar</button>
                <button class="btn-primary" onclick="dashboard.approveProposal('${proposal.id}')">Aprovar</button>
                <button class="btn-secondary" onclick="dashboard.rejectProposal('${proposal.id}')">Rejeitar</button>
            </div>
        `;
        this.openModal('Visualizar Proposta', modalContent);
    }
}
    
    approveProposal(id) {
        const proposal = this.data.proposals.find(p => p.id === id);
        if (proposal) {
            proposal.status = 'approved';
            showToast('Proposta aprovada com sucesso!', 'success');
            this.closeModal();
            this.loadView(this.currentView);
        }
    }
    
    rejectProposal(id) {
        const proposal = this.data.proposals.find(p => p.id === id);
        if (proposal) {
            proposal.status = 'rejected';
            showToast('Proposta rejeitada.', 'warning');
            this.closeModal();
            this.loadView(this.currentView);
        }
    }
    
    editProposal(id) {
        this.openModal('Editar Proposta', 'Conteúdo completo para edição da proposta ' + id);
    }
    
    messageInfluencer(id) {
    if (window.modals) {
        window.modals.messageInfluencer(id);
    } else {
        this.openModal('Mensagem', 'Chat com o influenciador ' + id);
    }
}


    inviteInfluencer() {
    if (window.modals) {
        window.modals.inviteInfluencer();
    } else {
        this.openModal('Convidar Influenciador', 'Formulário completo para convite de influenciador');
    }
}
    
    viewCampaign(id) {
        this.openModal('Detalhes da Campanha', 'Conteúdo completo para a campanha ' + id);
    }
    
    manageCampaign(id) {
    if (window.modals) {
        window.modals.manageCampaign(id);
    } else {
        this.openModal('Gerenciar Campanha', 'Ferramentas de gerenciamento para a campanha ' + id);
    }
}

    viewInfluencerProfile(id) {
    if (window.modals) {
        window.modals.viewInfluencerProfile(id);
    } else {
        this.openModal('Perfil do Influenciador', 'Conteúdo completo para o perfil do influenciador ' + id);
    }
}
    
    exportProposals() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data.proposals));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "propostas.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showToast('Propostas exportadas em JSON.', 'success');
    }

    exportReport() {
        showToast('Gerando relatório PDF...', 'info');
    }

    openInfluencerSearch() {
        window.location.href = 'index.html';
    }

    // Adicione este método dentro da classe SollerDashboard
initAnalyticsCharts() {
    // Verificar se a classe SollerAnalytics está disponível (carregada)
    if (typeof SollerAnalytics !== 'undefined') {
        const analytics = new SollerAnalytics();
        analytics.init();
    } else {
        console.error('Erro: analytics-charts.js não foi carregado corretamente.');
    }
}

    getProposalForm() {
        return `
            <form id="proposal-form">
                <div class="form-group">
                    <label>Nome da Campanha</label>
                    <input type="text" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Objetivo</label>
                    <select class="form-select" required>
                        <option value="">Selecione</option>
                        <option value="awareness">Awareness</option>
                        <option value="engagement">Engajamento</option>
                        <option value="conversion">Conversão</option>
                        <option value="branding">Branding</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Orçamento</label>
                    <input type="number" class="form-input" placeholder="R$" required>
                </div>
                <div class="form-group">
                    <label>Detalhes da Proposta</label>
                    <textarea class="form-textarea" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block">
                    Enviar Proposta
                </button>
            </form>
        `;
    }
    
    getCampaignForm() {
        return `<p>Formulário de criação de nova campanha.</p>`;
    }

    openModal(title, content) {
        let modal = document.getElementById('main-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'main-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="dashboard.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('main-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    filterProposals(status) {
        showToast(`Filtrando por: ${status}`, 'info');
        // Lógica de filtro aqui
    }

    searchProposals(query) {
        console.log('Buscando:', query);
        // Lógica de busca aqui
    }

    sortProposals(criteria) {
        console.log('Ordenando por:', criteria);
        // Lógica de ordenação aqui
    }

    formatNumber(num, suffix = '') {
        if (num === null || num === undefined || isNaN(num)) {
            return 'N/A';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('pt-BR') + suffix;
    }
    
    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Data inválida';

        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return minutes === 0 ? 'Agora' : `${minutes} min atrás`;
            }
            return `${hours}h atrás`;
        }
        if (days === 1) return 'Ontem';
        if (days < 7) return `${days} dias atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }

    getStatusLabel(status) {
        const labels = {
            pending: 'Pendente',
            in_review: 'Em Análise',
            approved: 'Aprovada',
            rejected: 'Rejeitada',
            active: 'Ativa',
            scheduled: 'Agendada',
            completed: 'Concluída'
        };
        return labels[status] || status;
    }

    getFilterLabel(filter) {
        const labels = {
            all: 'Todas',
            pending: 'Pendentes',
            in_review: 'Em Análise',
            approved: 'Aprovadas',
            rejected: 'Rejeitadas'
        };
        return labels[filter] || filter;
    }

    getProposalCount(filter) {
        if (!this.data || !this.data.proposals) return 0;
        if (filter === 'all') return this.data.proposals.length;
        return this.data.proposals.filter(p => p.status === filter).length;
    }

    calculateTotal(proposals) {
        if (!proposals || proposals.length === 0) return '0';
        const total = proposals.reduce((sum, p) => sum + (p.value || 0), 0);
        return total.toLocaleString('pt-BR');
    }

    getActivityIcon(type) {
        const icons = {
            proposal_sent: '<i class="fas fa-paper-plane"></i>',
            content_approved: '<i class="fas fa-check-circle"></i>',
            campaign_started: '<i class="fas fa-play-circle"></i>',
            milestone: '<i class="fas fa-trophy"></i>'
        };
        return icons[type] || '<i class="fas fa-bell"></i>';
    }
}

// Inicializar a classe e exportar para o escopo global
document.addEventListener('DOMContentLoaded', () => {
            window.dashboard = new SollerDashboard();
            window.modals = new SollerModals(window.dashboard);
            console.log('✅ Dashboard e Modais inicializados com sucesso!');
        });

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}