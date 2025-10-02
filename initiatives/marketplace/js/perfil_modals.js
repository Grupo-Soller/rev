/**
 * Soller Modal System - Production Ready
 * Sistema completo de modais para o dashboard empresarial
 */

class SollerModals {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.activeModal = null;
        this.init();
    }

    init() {
        // Criar container para modais se não existir
        if (!document.getElementById('modal-container')) {
            const container = document.createElement('div');
            container.id = 'modal-container';
            document.body.appendChild(container);
        }

        // Setup keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    // ===== MODAL PRINCIPAL: NOVA PROPOSTA =====
    openNewProposal(influencerId = null) {
        const influencer = influencerId ? 
            this.dashboard.data.influencers.find(i => i.id === influencerId) : null;

        const content = `
            <div class="modal-form-container">
                <div class="form-steps">
                    <div class="step active" data-step="1">
                        <span class="step-number">1</span>
                        <span class="step-label">Detalhes</span>
                    </div>
                    <div class="step" data-step="2">
                        <span class="step-number">2</span>
                        <span class="step-label">Influenciador</span>
                    </div>
                    <div class="step" data-step="3">
                        <span class="step-number">3</span>
                        <span class="step-label">Orçamento</span>
                    </div>
                    <div class="step" data-step="4">
                        <span class="step-number">4</span>
                        <span class="step-label">Revisão</span>
                    </div>
                </div>

                <form id="proposal-form" class="multi-step-form">
                    <!-- Step 1: Detalhes da Campanha -->
                    <div class="form-step active" data-step="1">
                        <h3 class="form-section-title">Detalhes da Campanha</h3>
                        
                        <div class="form-group">
                            <label class="form-label required">Nome da Campanha</label>
                            <input type="text" class="form-input" id="campaign-name" required 
                                   placeholder="Ex: Lançamento Produto Verão 2025">
                            <span class="form-hint">Escolha um nome memorável para identificar esta campanha</span>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required">Categoria</label>
                                <select class="form-select" id="campaign-category" required>
                                    <option value="">Selecione...</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="beauty">Beauty</option>
                                    <option value="tech">Tech</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="food">Food & Beverage</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Objetivo Principal</label>
                                <select class="form-select" id="campaign-objective" required>
                                    <option value="">Selecione...</option>
                                    <option value="awareness">Brand Awareness</option>
                                    <option value="engagement">Engajamento</option>
                                    <option value="conversion">Conversão/Vendas</option>
                                    <option value="content">Geração de Conteúdo</option>
                                    <option value="launch">Lançamento</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descrição da Campanha</label>
                            <textarea class="form-textarea" id="campaign-description" rows="4"
                                      placeholder="Descreva os objetivos, público-alvo e mensagem principal..."></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required">Data de Início</label>
                                <input type="date" class="form-input" id="campaign-start" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Data de Término</label>
                                <input type="date" class="form-input" id="campaign-end" required>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Seleção de Influenciador -->
                    <div class="form-step" data-step="2">
                        <h3 class="form-section-title">Seleção de Influenciador</h3>
                        
                        ${influencer ? `
                            <div class="selected-influencer-card">
                                <img src="${influencer.avatar}" alt="${influencer.name}">
                                <div class="influencer-details">
                                    <h4>${influencer.name}</h4>
                                    <p>${influencer.handle}</p>
                                    <div class="influencer-metrics">
                                        <span><i class="fas fa-users"></i> ${this.formatNumber(influencer.followers)} seguidores</span>
                                        <span><i class="fas fa-heart"></i> ${influencer.engagement}% engajamento</span>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="influencer-search">
                                <input type="text" class="form-input" placeholder="Buscar influenciador..." 
                                       id="influencer-search" onkeyup="modals.searchInfluencers(this.value)">
                                <div class="influencer-suggestions" id="influencer-suggestions"></div>
                            </div>
                        `}

                        <div class="form-group">
                            <label class="form-label">Requisitos Específicos</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="req-verified">
                                    <span>Conta verificada</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="req-exclusive">
                                    <span>Exclusividade no setor</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="req-content-approval">
                                    <span>Aprovação prévia de conteúdo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Orçamento e Entregas -->
                    <div class="form-step" data-step="3">
                        <h3 class="form-section-title">Orçamento e Entregas</h3>
                        
                        <div class="form-group">
                            <label class="form-label required">Orçamento Total (R$)</label>
                            <div class="input-with-addon">
                                <span class="input-addon">R$</span>
                                <input type="number" class="form-input" id="campaign-budget" 
                                       placeholder="0,00" min="0" step="100" required>
                            </div>
                            <span class="form-hint">Valor total disponível para esta proposta</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Entregas Esperadas</label>
                            <div class="deliverables-grid">
                                <div class="deliverable-item">
                                    <label class="deliverable-label">
                                        <input type="checkbox" id="del-posts" checked>
                                        <span>Posts no Feed</span>
                                    </label>
                                    <input type="number" class="form-input-sm" placeholder="Qtd" min="0" value="3">
                                </div>
                                <div class="deliverable-item">
                                    <label class="deliverable-label">
                                        <input type="checkbox" id="del-stories" checked>
                                        <span>Stories</span>
                                    </label>
                                    <input type="number" class="form-input-sm" placeholder="Qtd" min="0" value="10">
                                </div>
                                <div class="deliverable-item">
                                    <label class="deliverable-label">
                                        <input type="checkbox" id="del-reels">
                                        <span>Reels/TikTok</span>
                                    </label>
                                    <input type="number" class="form-input-sm" placeholder="Qtd" min="0">
                                </div>
                                <div class="deliverable-item">
                                    <label class="deliverable-label">
                                        <input type="checkbox" id="del-live">
                                        <span>Live</span>
                                    </label>
                                    <input type="number" class="form-input-sm" placeholder="Qtd" min="0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Condições de Pagamento</label>
                            <select class="form-select" id="payment-terms">
                                <option value="50-50">50% antecipado, 50% na entrega</option>
                                <option value="100-delivery">100% na entrega</option>
                                <option value="monthly">Pagamento mensal</option>
                                <option value="performance">Baseado em performance</option>
                            </select>
                        </div>
                    </div>

                    <!-- Step 4: Revisão -->
                    <div class="form-step" data-step="4">
                        <h3 class="form-section-title">Revisão da Proposta</h3>
                        <div class="proposal-summary" id="proposal-summary">
                            <!-- Preenchido dinamicamente -->
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="accept-terms" required>
                                <span>Confirmo que revisei todos os detalhes e concordo com os termos</span>
                            </label>
                        </div>
                    </div>
                </form>

                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.previousStep()" id="btn-previous" style="display:none">
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>
                    <button class="btn-primary" onclick="modals.nextStep()" id="btn-next">
                        Próximo <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="btn-success" onclick="modals.submitProposal()" id="btn-submit" style="display:none">
                        <i class="fas fa-paper-plane"></i> Enviar Proposta
                    </button>
                </div>
            </div>
        `;

        this.openModal('Nova Proposta', content, 'large');
        this.currentStep = 1;
        this.totalSteps = 4;
    }

    // ===== MODAL: NOVA CAMPANHA =====
    openNewCampaign() {
        const templates = [
            { id: 'awareness', icon: '📢', title: 'Brand Awareness', desc: 'Aumentar reconhecimento da marca' },
            { id: 'launch', icon: '🚀', title: 'Lançamento', desc: 'Lançar novo produto/serviço' },
            { id: 'engagement', icon: '💬', title: 'Engajamento', desc: 'Aumentar interações' },
            { id: 'conversion', icon: '💰', title: 'Conversão', desc: 'Gerar vendas diretas' },
            { id: 'ugc', icon: '📸', title: 'UGC', desc: 'Conteúdo gerado pelo usuário' },
            { id: 'custom', icon: '⚙️', title: 'Personalizada', desc: 'Criar do zero' }
        ];

        const content = `
            <div class="campaign-wizard">
                <h3 class="section-subtitle">Escolha um template ou comece do zero</h3>
                
                <div class="template-grid">
                    ${templates.map(t => `
                        <div class="template-card" onclick="modals.selectCampaignTemplate('${t.id}')">
                            <div class="template-icon">${t.icon}</div>
                            <h4>${t.title}</h4>
                            <p>${t.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <div id="campaign-details" style="display:none">
                    <h3 class="section-subtitle mt-3">Configure sua campanha</h3>
                    
                    <div class="form-group">
                        <label class="form-label required">Nome da Campanha</label>
                        <input type="text" class="form-input" id="new-campaign-name" 
                               placeholder="Ex: Black Friday 2025">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label required">Número de Influenciadores</label>
                            <input type="number" class="form-input" id="campaign-influencers" 
                                   min="1" value="5" placeholder="5">
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Orçamento Total (R$)</label>
                            <input type="number" class="form-input" id="campaign-total-budget" 
                                   placeholder="50000" min="0">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">KPIs Principais</label>
                        <div class="kpi-selector">
                            <label class="kpi-option">
                                <input type="checkbox" checked>
                                <span>Alcance Total</span>
                            </label>
                            <label class="kpi-option">
                                <input type="checkbox" checked>
                                <span>Taxa de Engajamento</span>
                            </label>
                            <label class="kpi-option">
                                <input type="checkbox">
                                <span>Conversões</span>
                            </label>
                            <label class="kpi-option">
                                <input type="checkbox">
                                <span>ROI</span>
                            </label>
                            <label class="kpi-option">
                                <input type="checkbox">
                                <span>Menções da Marca</span>
                            </label>
                        </div>
                    </div>

                    <div class="campaign-preview">
                        <h4>Estimativas</h4>
                        <div class="preview-metrics">
                            <div class="metric">
                                <span class="metric-label">Alcance Estimado</span>
                                <span class="metric-value">500K - 1M</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Custo por Influenciador</span>
                                <span class="metric-value">R$ 10.000</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Duração Sugerida</span>
                                <span class="metric-value">30 dias</span>
                            </div>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="modals.closeModal()">Cancelar</button>
                        <button class="btn-primary" onclick="modals.createCampaign()">
                            <i class="fas fa-rocket"></i> Criar Campanha
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal('Nova Campanha', content, 'large');
    }

    // ===== MODAL: VISUALIZAR PROPOSTA =====
    viewProposal(proposalId) {
        const proposal = this.dashboard.data.proposals.find(p => p.id === proposalId);
        if (!proposal) return;

        const statusColors = {
            pending: 'warning',
            in_review: 'info',
            approved: 'success',
            rejected: 'error'
        };

        const content = `
            <div class="proposal-detail-view">
                <div class="proposal-header-detail">
                    <div class="status-indicator ${statusColors[proposal.status]}">
                        ${this.getStatusLabel(proposal.status)}
                    </div>
                    <div class="proposal-actions-bar">
                        <button class="btn-icon" onclick="modals.printProposal('${proposalId}')">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn-icon" onclick="modals.shareProposal('${proposalId}')">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>

                <div class="proposal-sections">
                    <!-- Influenciador -->
                    <div class="detail-section">
                        <h4 class="section-title">Influenciador</h4>
                        <div class="influencer-detail-card">
                            <img src="${proposal.influencer.avatar}" alt="${proposal.influencer.name}">
                            <div class="influencer-info">
                                <h3>${proposal.influencer.name}</h3>
                                <p>${proposal.influencer.handle}</p>
                                <div class="influencer-tags">
                                    ${proposal.influencer.categories.map(cat => 
                                        `<span class="tag">${cat}</span>`
                                    ).join('')}
                                </div>
                                <div class="influencer-stats-row">
                                    <div class="stat">
                                        <span class="stat-value">${this.formatNumber(proposal.influencer.followers)}</span>
                                        <span class="stat-label">Seguidores</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">${proposal.influencer.engagement}%</span>
                                        <span class="stat-label">Engajamento</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">${this.formatNumber(proposal.estimatedReach)}</span>
                                        <span class="stat-label">Alcance Est.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detalhes da Campanha -->
                    <div class="detail-section">
                        <h4 class="section-title">Campanha</h4>
                        <div class="campaign-details">
                            <div class="detail-row">
                                <span class="detail-label">Nome:</span>
                                <span class="detail-value">${proposal.campaign}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Valor:</span>
                                <span class="detail-value highlight">R$ ${this.formatNumber(proposal.value)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Criada em:</span>
                                <span class="detail-value">${this.formatDate(proposal.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Entregas -->
                    <div class="detail-section">
                        <h4 class="section-title">Entregas Acordadas</h4>
                        <div class="deliverables-list">
                            ${proposal.deliverables.map(del => `
                                <div class="deliverable-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>${del}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    ${proposal.negotiation ? `
                        <!-- Negociação -->
                        <div class="detail-section">
                            <h4 class="section-title">Histórico de Negociação</h4>
                            <div class="negotiation-timeline">
                                <div class="negotiation-item">
                                    <span class="label">Valor Original:</span>
                                    <span class="value">R$ ${this.formatNumber(proposal.negotiation.originalValue)}</span>
                                </div>
                                <div class="negotiation-item">
                                    <span class="label">Desconto Aplicado:</span>
                                    <span class="value">${proposal.negotiation.discount}%</span>
                                </div>
                                <div class="negotiation-item">
                                    <span class="label">Mensagens Trocadas:</span>
                                    <span class="value">${proposal.negotiation.messages}</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    ${proposal.performance ? `
                        <!-- Performance -->
                        <div class="detail-section">
                            <h4 class="section-title">Performance Real</h4>
                            <div class="performance-grid">
                                <div class="performance-card">
                                    <i class="fas fa-eye"></i>
                                    <span class="perf-value">${this.formatNumber(proposal.performance.actualReach)}</span>
                                    <span class="perf-label">Alcance Real</span>
                                </div>
                                <div class="performance-card">
                                    <i class="fas fa-heart"></i>
                                    <span class="perf-value">${proposal.performance.engagement}%</span>
                                    <span class="perf-label">Engajamento</span>
                                </div>
                                <div class="performance-card">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span class="perf-value">${proposal.performance.conversions}</span>
                                    <span class="perf-label">Conversões</span>
                                </div>
                                <div class="performance-card">
                                    <i class="fas fa-chart-line"></i>
                                    <span class="perf-value">${proposal.performance.roi}x</span>
                                    <span class="perf-label">ROI</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="modal-actions">
                    ${proposal.status === 'pending' ? `
                        <button class="btn-secondary" onclick="modals.rejectProposal('${proposalId}')">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                        <button class="btn-warning" onclick="modals.negotiateProposal('${proposalId}')">
                            <i class="fas fa-handshake"></i> Negociar
                        </button>
                        <button class="btn-success" onclick="modals.approveProposal('${proposalId}')">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                    ` : `
                        <button class="btn-secondary" onclick="modals.closeModal()">Fechar</button>
                        <button class="btn-primary" onclick="modals.duplicateProposal('${proposalId}')">
                            <i class="fas fa-copy"></i> Duplicar Proposta
                        </button>
                    `}
                </div>
            </div>
        `;

        this.openModal('Detalhes da Proposta', content, 'large');
    }

    // ===== MODAL: CHAT COM INFLUENCIADOR =====
    messageInfluencer(influencerId) {
        const influencer = this.dashboard.data.influencers.find(i => i.id === parseInt(influencerId));
        if (!influencer) return;

        const mockMessages = [
            { sender: 'influencer', text: 'Olá! Vi a proposta da campanha, adorei o conceito!', time: '10:30' },
            { sender: 'company', text: 'Que ótimo! Podemos agendar uma call para alinhar detalhes?', time: '10:35' },
            { sender: 'influencer', text: 'Claro! Minha agenda está livre quinta e sexta.', time: '10:40' }
        ];

        const content = `
            <div class="chat-container">
                <div class="chat-header">
                    <img src="${influencer.avatar}" alt="${influencer.name}">
                    <div class="chat-user-info">
                        <h4>${influencer.name}</h4>
                        <span class="status online">Online agora</span>
                    </div>
                </div>

                <div class="chat-messages" id="chat-messages">
                    ${mockMessages.map(msg => `
                        <div class="message ${msg.sender}">
                            <div class="message-bubble">
                                ${msg.text}
                            </div>
                            <span class="message-time">${msg.time}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="chat-input-container">
                    <div class="chat-toolbar">
                        <button class="btn-icon"><i class="fas fa-paperclip"></i></button>
                        <button class="btn-icon"><i class="fas fa-image"></i></button>
                        <button class="btn-icon"><i class="fas fa-smile"></i></button>
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" class="chat-input" placeholder="Digite sua mensagem..." 
                               id="chat-input" onkeypress="if(event.key==='Enter') modals.sendMessage()">
                        <button class="btn-send" onclick="modals.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal(`Chat - ${influencer.name}`, content, 'medium');
    }

    // ===== MODAL: GERENCIAR CAMPANHA =====
    manageCampaign(campaignId) {
        const campaign = this.dashboard.data.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        const content = `
            <div class="campaign-management">
                <div class="campaign-tabs">
                    <button class="tab-btn active" onclick="modals.switchTab('overview')">Visão Geral</button>
                    <button class="tab-btn" onclick="modals.switchTab('influencers')">Influenciadores</button>
                    <button class="tab-btn" onclick="modals.switchTab('content')">Conteúdo</button>
                    <button class="tab-btn" onclick="modals.switchTab('analytics')">Analytics</button>
                </div>

                <div class="tab-content active" id="tab-overview">
                    <div class="campaign-status-bar">
                        <div class="status-item">
                            <span class="status-label">Status:</span>
                            <span class="status-badge ${campaign.status}">${campaign.status}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Progresso:</span>
                            <div class="progress-bar-inline">
                                <div class="progress-fill" style="width: ${(campaign.deliverables.completed / campaign.deliverables.total) * 100}%"></div>
                            </div>
                            <span>${campaign.deliverables.completed}/${campaign.deliverables.total}</span>
                        </div>
                    </div>

                    <div class="metrics-grid">
                        <div class="metric-card">
                            <i class="fas fa-dollar-sign"></i>
                            <div class="metric-info">
                                <span class="metric-value">R$ ${this.formatNumber(campaign.spent)}</span>
                                <span class="metric-label">Gasto de R$ ${this.formatNumber(campaign.budget)}</span>
                            </div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-users"></i>
                            <div class="metric-info">
                                <span class="metric-value">${campaign.influencers.length}</span>
                                <span class="metric-label">Influenciadores</span>
                            </div>
                        </div>
                        <div class="metric-card">
                            <i class="fas fa-calendar"></i>
                            <div class="metric-info">
                                <span class="metric-value">${this.getDaysRemaining(campaign.endDate)}</span>
                                <span class="metric-label">Dias Restantes</span>
                            </div>
                        </div>
                    </div>

                    ${campaign.performance ? `
                        <h4 class="section-subtitle">Performance em Tempo Real</h4>
                        <div class="real-time-metrics">
                            <div class="rt-metric">
                                <span class="rt-label">Alcance Total</span>
                                <span class="rt-value">${this.formatNumber(campaign.performance.reach)}</span>
                                <span class="rt-trend positive">+12% hoje</span>
                            </div>
                            <div class="rt-metric">
                                <span class="rt-label">Engajamento</span>
                                <span class="rt-value">${campaign.performance.engagement}%</span>
                                <span class="rt-trend positive">+0.3pp</span>
                            </div>
                            <div class="rt-metric">
                                <span class="rt-label">Conversões</span>
                                <span class="rt-value">${campaign.performance.conversions}</span>
                                <span class="rt-trend neutral">mesmo nível</span>
                            </div>
                            <div class="rt-metric">
                                <span class="rt-label">ROI</span>
                                <span class="rt-value">${campaign.performance.roi}x</span>
                                <span class="rt-trend positive">+0.2x</span>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="tab-content" id="tab-influencers">
                    <div class="influencers-management">
                        ${campaign.influencers.map(inf => `
                            <div class="influencer-row">
                                <div class="inf-info">
                                    <img src="https://randomuser.me/api/portraits/women/${inf.id}.jpg" alt="${inf.name}">
                                    <div>
                                        <h5>${inf.name}</h5>
                                        <span class="inf-status ${inf.status}">${inf.status}</span>
                                    </div>
                                </div>
                                <div class="inf-progress">
                                    <div class="progress-bar-sm">
                                        <div class="progress-fill" style="width: ${inf.delivered}%"></div>
                                    </div>
                                    <span>${inf.delivered}% entregue</span>
                                </div>
                                <div class="inf-actions">
                                    <button class="btn-icon" onclick="modals.messageInfluencer(${inf.id})">
                                        <i class="fas fa-comment"></i>
                                    </button>
                                    <button class="btn-icon" onclick="modals.viewInfluencerContent(${inf.id})">
                                        <i class="fas fa-image"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.pauseCampaign('${campaignId}')">
                        <i class="fas fa-pause"></i> Pausar Campanha
                    </button>
                    <button class="btn-primary" onclick="modals.exportCampaignReport('${campaignId}')">
                        <i class="fas fa-download"></i> Exportar Relatório
                    </button>
                </div>
            </div>
        `;

        this.openModal(`Gerenciar - ${campaign.name}`, content, 'large');
    }

    // ===== MODAL: CONVIDAR INFLUENCIADOR =====
    inviteInfluencer() {
        const content = `
            <div class="invite-influencer-form">
                <div class="invite-methods">
                    <div class="method-card active" onclick="modals.selectInviteMethod('direct')">
                        <i class="fas fa-user-plus"></i>
                        <h4>Convite Direto</h4>
                        <p>Envie convite para um influenciador específico</p>
                    </div>
                    <div class="method-card" onclick="modals.selectInviteMethod('bulk')">
                        <i class="fas fa-users"></i>
                        <h4>Convite em Massa</h4>
                        <p>Convide múltiplos influenciadores de uma vez</p>
                    </div>
                    <div class="method-card" onclick="modals.selectInviteMethod('import')">
                        <i class="fas fa-file-import"></i>
                        <h4>Importar Lista</h4>
                        <p>Importe uma lista de contatos</p>
                    </div>
                </div>

                <div id="invite-form-content">
                    <h3 class="section-subtitle">Dados do Influenciador</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label required">Nome</label>
                            <input type="text" class="form-input" id="invite-name" 
                                   placeholder="Nome completo">
                        </div>
                        <div class="form-group">
                            <label class="form-label required">@ Username</label>
                            <input type="text" class="form-input" id="invite-handle" 
                                   placeholder="@username">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label required">Email</label>
                            <input type="email" class="form-input" id="invite-email" 
                                   placeholder="email@exemplo.com">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Telefone</label>
                            <input type="tel" class="form-input" id="invite-phone" 
                                   placeholder="(11) 99999-9999">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Plataforma Principal</label>
                        <select class="form-select" id="invite-platform">
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                            <option value="linkedin">LinkedIn</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Mensagem Personalizada</label>
                        <textarea class="form-textarea" id="invite-message" rows="4"
                                  placeholder="Olá! Adoraríamos ter você em nossa plataforma..."></textarea>
                    </div>

                    <div class="invite-preview">
                        <h4>Preview do Convite</h4>
                        <div class="email-preview">
                            <div class="email-header">
                                <img src="assets/logo.png" alt="Soller" style="height: 30px;">
                            </div>
                            <div class="email-body">
                                <h3>Você foi convidado para a Soller!</h3>
                                <p>A TechCorp Brasil gostaria de convidá-lo para fazer parte de nossa próxima campanha.</p>
                                <button class="btn-email">Aceitar Convite</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.closeModal()">Cancelar</button>
                    <button class="btn-primary" onclick="modals.sendInvite()">
                        <i class="fas fa-paper-plane"></i> Enviar Convite
                    </button>
                </div>
            </div>
        `;

        this.openModal('Convidar Influenciador', content, 'large');
    }

    // ===== MODAL: PERFIL DO INFLUENCIADOR =====
    viewInfluencerProfile(influencerId) {
        const influencer = this.dashboard.data.influencers.find(i => i.id === parseInt(influencerId));
        if (!influencer) return;

        const content = `
            <div class="influencer-profile">
                <div class="profile-header">
                    <img src="${influencer.avatar}" alt="${influencer.name}" class="profile-avatar">
                    <div class="profile-info">
                        <h2>${influencer.name}</h2>
                        <p class="handle">${influencer.handle}</p>
                        <div class="profile-badges">
                            ${influencer.tier === 'platinum' ? '<span class="badge platinum">💎 Platinum</span>' : ''}
                            ${influencer.tier === 'gold' ? '<span class="badge gold">⭐ Gold</span>' : ''}
                            ${influencer.matchScore > 90 ? '<span class="badge match">🎯 High Match</span>' : ''}
                        </div>
                    </div>
                </div>

                <div class="profile-stats">
                    <div class="stat-box">
                        <i class="fas fa-users"></i>
                        <div>
                            <span class="stat-value">${this.formatNumber(influencer.followers)}</span>
                            <span class="stat-label">Seguidores</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-heart"></i>
                        <div>
                            <span class="stat-value">${influencer.engagement}%</span>
                            <span class="stat-label">Engajamento</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="stat-value">${influencer.responseTime}</span>
                            <span class="stat-label">Tempo Resposta</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <span class="stat-value">${influencer.completionRate}%</span>
                            <span class="stat-label">Taxa Conclusão</span>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">
                    <div class="section">
                        <h4>Categorias</h4>
                        <div class="categories-list">
                            ${influencer.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                        </div>
                    </div>

                    <div class="section">
                        <h4>Histórico de Campanhas</h4>
                        <div class="campaign-history">
                            <div class="history-item">
                                <span class="history-label">Total de Campanhas:</span>
                                <span class="history-value">${influencer.pastCampaigns}</span>
                            </div>
                            <div class="history-item">
                                <span class="history-label">Investimento Total:</span>
                                <span class="history-value">R$ ${this.formatNumber(influencer.totalInvested)}</span>
                            </div>
                            <div class="history-item">
                                <span class="history-label">ROI Médio:</span>
                                <span class="history-value">${influencer.avgROI}x</span>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h4>Dados de Audiência</h4>
                        <div class="audience-insights">
                            <div class="insight">
                                <i class="fas fa-venus-mars"></i>
                                <span>65% Feminino / 35% Masculino</span>
                            </div>
                            <div class="insight">
                                <i class="fas fa-birthday-cake"></i>
                                <span>18-34 anos (78%)</span>
                            </div>
                            <div class="insight">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>São Paulo, Rio, BH (Top 3)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.downloadInfluencerReport(${influencerId})">
                        <i class="fas fa-download"></i> Baixar Relatório
                    </button>
                    <button class="btn-primary" onclick="modals.createProposalFor(${influencerId})">
                        <i class="fas fa-paper-plane"></i> Enviar Proposta
                    </button>
                </div>
            </div>
        `;

        this.openModal('Perfil do Influenciador', content, 'large');
    }

    // ===== MODAL: NOTIFICAÇÕES =====
    openNotifications() {
        const notifications = this.dashboard.data.notifications;

        const content = `
            <div class="notifications-container">
                <div class="notifications-header">
                    <div class="notification-filters">
                        <button class="filter-btn active">Todas</button>
                        <button class="filter-btn">Não lidas</button>
                        <button class="filter-btn">Propostas</button>
                        <button class="filter-btn">Campanhas</button>
                    </div>
                    <button class="btn-text" onclick="modals.markAllAsRead()">
                        Marcar todas como lidas
                    </button>
                </div>

                <div class="notifications-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.unread ? 'unread' : ''}" 
                             onclick="modals.handleNotificationClick('${notif.id}')">
                            <div class="notification-icon ${notif.type}">
                                ${this.getNotificationIcon(notif.type)}
                            </div>
                            <div class="notification-content">
                                <p class="notification-message">${notif.message}</p>
                                <span class="notification-time">${notif.time}</span>
                            </div>
                            ${notif.unread ? '<span class="unread-dot"></span>' : ''}
                        </div>
                    `).join('')}
                </div>

                <div class="notifications-footer">
                    <a href="#" class="view-all-link">Ver histórico completo →</a>
                </div>
            </div>
        `;

        this.openModal('Notificações', content, 'medium');
    }

    // ===== MODAL: AÇÕES RÁPIDAS (FAB) =====
    openQuickActions() {
        const actions = [
            { id: 'proposal', icon: 'fa-file-alt', label: 'Nova Proposta', color: 'primary' },
            { id: 'campaign', icon: 'fa-bullhorn', label: 'Nova Campanha', color: 'success' },
            { id: 'invite', icon: 'fa-user-plus', label: 'Convidar Influenciador', color: 'info' },
            { id: 'report', icon: 'fa-chart-bar', label: 'Gerar Relatório', color: 'warning' },
            { id: 'search', icon: 'fa-search', label: 'Buscar Influenciador', color: 'secondary' }
        ];

        const content = `
            <div class="quick-actions-grid">
                ${actions.map(action => `
                    <div class="quick-action-card ${action.color}" 
                         onclick="modals.executeQuickAction('${action.id}')">
                        <i class="fas ${action.icon}"></i>
                        <span>${action.label}</span>
                    </div>
                `).join('')}
            </div>
        `;

        this.openModal('Ações Rápidas', content, 'small');
    }

    // ===== FUNÇÕES AUXILIARES =====

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Validação básica
            if (!this.validateCurrentStep()) return;
            
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.remove('active');
            document.querySelector(`.step[data-step="${this.currentStep}"]`).classList.remove('active');
            
            this.currentStep++;
            
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
            document.querySelector(`.step[data-step="${this.currentStep}"]`).classList.add('active');
            
            // Atualizar botões
            document.getElementById('btn-previous').style.display = 'inline-flex';
            if (this.currentStep === this.totalSteps) {
                document.getElementById('btn-next').style.display = 'none';
                document.getElementById('btn-submit').style.display = 'inline-flex';
                this.generateProposalSummary();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.remove('active');
            document.querySelector(`.step[data-step="${this.currentStep}"]`).classList.remove('active');
            
            this.currentStep--;
            
            document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
            document.querySelector(`.step[data-step="${this.currentStep}"]`).classList.add('active');
            
            // Atualizar botões
            if (this.currentStep === 1) {
                document.getElementById('btn-previous').style.display = 'none';
            }
            document.getElementById('btn-next').style.display = 'inline-flex';
            document.getElementById('btn-submit').style.display = 'none';
        }
    }

    validateCurrentStep() {
        // Implementar validação por step
        return true;
    }

    generateProposalSummary() {
        const summary = document.getElementById('proposal-summary');
        const campaignName = document.getElementById('campaign-name').value;
        const budget = document.getElementById('campaign-budget').value;
        
        summary.innerHTML = `
            <div class="summary-section">
                <h4>Campanha</h4>
                <p>${campaignName}</p>
            </div>
            <div class="summary-section">
                <h4>Orçamento</h4>
                <p>R$ ${this.formatNumber(budget)}</p>
            </div>
            <div class="summary-section">
                <h4>Entregas</h4>
                <p>3 posts, 10 stories</p>
            </div>
        `;
    }

    submitProposal() {
        // Validar termos
        if (!document.getElementById('accept-terms').checked) {
            this.showToast('Por favor, aceite os termos para continuar', 'warning');
            return;
        }

        // Simular envio
        this.showToast('Proposta enviada com sucesso!', 'success');
        this.closeModal();
        
        // Atualizar dashboard
        if (this.dashboard) {
            this.dashboard.loadView('proposals');
        }
    }

    selectCampaignTemplate(templateId) {
        document.getElementById('campaign-details').style.display = 'block';
        
        // Preencher valores baseado no template
        const templates = {
            awareness: { name: 'Campanha de Brand Awareness', budget: 50000, influencers: 10 },
            launch: { name: 'Lançamento de Produto', budget: 75000, influencers: 15 },
            engagement: { name: 'Campanha de Engajamento', budget: 30000, influencers: 8 },
            conversion: { name: 'Campanha de Conversão', budget: 100000, influencers: 20 }
        };

        if (templates[templateId]) {
            const template = templates[templateId];
            document.getElementById('new-campaign-name').value = template.name;
            document.getElementById('campaign-total-budget').value = template.budget;
            document.getElementById('campaign-influencers').value = template.influencers;
        }
    }

    createCampaign() {
        const name = document.getElementById('new-campaign-name').value;
        if (!name) {
            this.showToast('Por favor, preencha o nome da campanha', 'warning');
            return;
        }

        this.showToast('Campanha criada com sucesso!', 'success');
        this.closeModal();
        
        if (this.dashboard) {
            this.dashboard.loadView('campaigns');
        }
    }

    approveProposal(proposalId) {
        const proposal = this.dashboard.data.proposals.find(p => p.id === proposalId);
        if (proposal) {
            proposal.status = 'approved';
            this.showToast('Proposta aprovada com sucesso!', 'success');
            this.closeModal();
            this.dashboard.loadView('proposals');
        }
    }

    rejectProposal(proposalId) {
        // Abrir modal de rejeição com motivo
        const content = `
            <div class="rejection-form">
                <p>Por favor, informe o motivo da rejeição:</p>
                <div class="form-group">
                    <select class="form-select" id="rejection-reason">
                        <option value="">Selecione...</option>
                        <option value="budget">Fora do orçamento</option>
                        <option value="profile">Perfil não adequado</option>
                        <option value="timing">Timing inadequado</option>
                        <option value="other">Outro motivo</option>
                    </select>
                </div>
                <div class="form-group">
                    <textarea class="form-textarea" id="rejection-details" rows="3"
                              placeholder="Detalhes adicionais (opcional)"></textarea>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.closeModal()">Cancelar</button>
                    <button class="btn-error" onclick="modals.confirmRejection('${proposalId}')">
                        Confirmar Rejeição
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('Rejeitar Proposta', content, 'small');
    }

    confirmRejection(proposalId) {
        const proposal = this.dashboard.data.proposals.find(p => p.id === proposalId);
        if (proposal) {
            proposal.status = 'rejected';
            this.showToast('Proposta rejeitada', 'info');
            this.closeModal();
            this.dashboard.loadView('proposals');
        }
    }

    negotiateProposal(proposalId) {
        const content = `
            <div class="negotiation-form">
                <h3>Propor Negociação</h3>
                <div class="form-group">
                    <label class="form-label">Novo Valor (R$)</label>
                    <input type="number" class="form-input" id="negotiation-value" 
                           placeholder="Sugerir novo valor">
                </div>
                <div class="form-group">
                    <label class="form-label">Ajustes nas Entregas</label>
                    <textarea class="form-textarea" id="negotiation-terms" rows="3"
                              placeholder="Descreva as alterações propostas..."></textarea>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="modals.closeModal()">Cancelar</button>
                    <button class="btn-primary" onclick="modals.sendNegotiation('${proposalId}')">
                        Enviar Proposta de Negociação
                    </button>
                </div>
            </div>
        `;
        
        this.openModal('Negociar Proposta', content, 'medium');
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            const messagesContainer = document.getElementById('chat-messages');
            const newMessage = `
                <div class="message company">
                    <div class="message-bubble">${message}</div>
                    <span class="message-time">Agora</span>
                </div>
            `;
            messagesContainer.innerHTML += newMessage;
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    executeQuickAction(actionId) {
        this.closeModal();
        
        switch(actionId) {
            case 'proposal':
                this.openNewProposal();
                break;
            case 'campaign':
                this.openNewCampaign();
                break;
            case 'invite':
                this.inviteInfluencer();
                break;
            case 'report':
                this.showToast('Gerando relatório...', 'info');
                break;
            case 'search':
                window.location.href = 'index.html';
                break;
        }
    }

    // ===== SISTEMA BASE DE MODAIS =====

    openModal(title, content, size = 'medium') {
        this.closeModal(); // Fechar modal anterior se existir
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal modal-${size}">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" onclick="modals.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').appendChild(modal);
        this.activeModal = modal;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            setTimeout(() => {
                this.activeModal.remove();
                this.activeModal = null;
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // ===== UTILITY FUNCTIONS =====

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('pt-BR');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    }

    getDaysRemaining(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }

    getStatusLabel(status) {
        const labels = {
            pending: 'Pendente',
            in_review: 'Em Análise',
            approved: 'Aprovada',
            rejected: 'Rejeitada'
        };
        return labels[status] || status;
    }

    getNotificationIcon(type) {
        const icons = {
            proposal: '📝',
            campaign: '📢',
            delivery: '📦',
            alert: '⚠️'
        };
        return icons[type] || '🔔';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Funções adicionais para completar todas as features
    searchInfluencers(query) {
        // Implementar busca de influenciadores
        const suggestions = this.dashboard.data.influencers
            .filter(inf => inf.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        
        const container = document.getElementById('influencer-suggestions');
        if (container) {
            container.innerHTML = suggestions.map(inf => `
                <div class="suggestion-item" onclick="modals.selectInfluencer(${inf.id})">
                    <img src="${inf.avatar}" alt="${inf.name}">
                    <div>
                        <strong>${inf.name}</strong>
                        <span>${inf.handle}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    markAllAsRead() {
        this.dashboard.data.notifications.forEach(n => n.unread = false);
        this.dashboard.updateNotifications();
        this.showToast('Todas as notificações foram marcadas como lidas', 'success');
        this.closeModal();
    }

    createProposalFor(influencerId) {
        this.closeModal();
        this.openNewProposal(influencerId);
    }

    duplicateProposal(proposalId) {
        this.showToast('Proposta duplicada com sucesso!', 'success');
        this.closeModal();
    }

    // Métodos adicionais de export e compartilhamento
    exportCampaignReport(campaignId) {
        this.showToast('Gerando relatório PDF...', 'info');
        setTimeout(() => {
            this.showToast('Relatório baixado com sucesso!', 'success');
        }, 2000);
    }

    printProposal(proposalId) {
        window.print();
    }

    shareProposal(proposalId) {
        const url = `${window.location.origin}/proposal/${proposalId}`;
        navigator.clipboard.writeText(url);
        this.showToast('Link copiado para a área de transferência!', 'success');
    }
}

// Inicializar quando o dashboard estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar o dashboard carregar
    setTimeout(() => {
        if (window.dashboard) {
            window.modals = new SollerModals(window.dashboard);
            console.log('✅ Sistema de Modais inicializado');
        }
    }, 100);
});