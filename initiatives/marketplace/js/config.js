// ===== SOLLER MARKETPLACE - CENTRAL CONFIGURATION SYSTEM =====

// Global App Configuration
const SollerConfig = {
    // App Info
    app: {
        name: 'Soller Marketplace',
        version: '1.0.0-MVP',
        environment: 'development',
        apiUrl: 'https://api.soller.com.br', // Will be implemented in backend phase
        supportEmail: 'suporte@soller.com.br'
    },
    
    // User Types
    userTypes: {
        INFLUENCER: 'influencer',
        COMPANY: 'company',
        AGENCY: 'agency',
        ADMIN: 'admin'
    },
    
    // Current User (Mock for MVP)
    currentUser: null,
    
    // Feature Flags
    features: {
        companyPortal: true,
        demandSystem: true,
        chatSupport: true,
        notifications: true,
        comparison: true,
        campaigns: true,
        analytics: true,
        wallet: false, // Coming in Sprint 2
        apiAccess: false // Coming in Sprint 3
    },
    
    // UI Settings
    ui: {
        theme: 'light',
        animations: true,
        toastDuration: 3000,
        modalTransitionSpeed: 300
    }
};

// ===== MAIN APPLICATION CONTROLLER =====
class SollerMarketplace {
    constructor() {
        this.config = SollerConfig;
        this.state = {
            isInitialized: false,
            currentView: 'marketplace',
            activeModal: null,
            selectedInfluencers: new Set(),
            comparisonList: new Set(),
            savedLists: [],
            activeDemands: [],
            notifications: []
        };
        
        this.init();
    }
    
    // ===== Initialization =====
    async init() {
        console.log('🚀 Initializing Soller Marketplace v' + this.config.app.version);
        
        // Check localStorage for saved data
        this.loadSavedData();
        
        // Initialize subsystems
        this.initializeAuth();
        this.initializeRouting();
        this.initializeEventHandlers();
        this.initializeNotifications();
        this.initializeDemandSystem();
        
        // Load initial data
        await this.loadInitialData();
        
        this.state.isInitialized = true;
        console.log('✅ Marketplace initialized successfully');
    }
    
    // ===== Authentication System (Mock for MVP) =====
    initializeAuth() {
        // Check if user is logged in (mock)
        const savedUser = localStorage.getItem('sollerUser');
        if (savedUser) {
            this.config.currentUser = JSON.parse(savedUser);
            this.updateUIForUser();
        }
    }
    
    loginUser(type, data) {
        const user = {
            id: Date.now(),
            type: type,
            name: data.name || 'Usuário Demo',
            email: data.email || 'demo@soller.com.br',
            avatar: data.avatar || '👤',
            createdAt: new Date().toISOString()
        };
        
        this.config.currentUser = user;
        localStorage.setItem('sollerUser', JSON.stringify(user));
        this.updateUIForUser();
        
        showToast(`Bem-vindo, ${user.name}!`, 'success');
        return user;
    }
    
    logoutUser() {
        this.config.currentUser = null;
        localStorage.removeItem('sollerUser');
        this.updateUIForUser();
        showToast('Logout realizado com sucesso', 'info');
    }
    
    updateUIForUser() {
        const user = this.config.currentUser;
        const navPills = document.querySelectorAll('.nav-pill');
        
        if (!user) {
            // Show login prompt
            navPills.forEach(pill => {
                if (pill.dataset.view === 'companies' || pill.dataset.view === 'agencies') {
                    pill.style.opacity = '0.5';
                    pill.style.pointerEvents = 'none';
                }
            });
        } else {
            // Enable appropriate views based on user type
            navPills.forEach(pill => {
                pill.style.opacity = '1';
                pill.style.pointerEvents = 'auto';
            });
            
            // Update user menu
            const userAvatar = document.querySelector('.user-avatar-small img');
            if (userAvatar) {
                userAvatar.alt = user.name;
            }
        }
    }
    
    // ===== Routing System =====
    initializeRouting() {
        // Handle navigation
        document.querySelectorAll('.nav-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.navigateTo(view);
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.renderView(e.state.view);
            }
        });
    }
    
    navigateTo(view) {
        // Check if user has access
        if (!this.config.currentUser && (view === 'companies' || view === 'agencies')) {
            this.showLoginModal(view);
            return;
        }
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('view', view);
        window.history.pushState({ view }, '', url);
        
        // Update UI
        this.renderView(view);
        this.state.currentView = view;
    }
    
    renderView(view) {
        const container = document.querySelector('.marketplace-content .container');
        if (!container) return;
        
        // Clear loading states
        container.classList.remove('loading');
        
        switch(view) {
            case 'influencers':
                renderInfluencers();
                break;
            case 'companies':
                this.renderCompanyPortal();
                break;
            case 'agencies':
                this.renderAgencyPortal();
                break;
            default:
                renderInfluencers();
        }
        
        // Update active nav
        document.querySelectorAll('.nav-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.view === view);
        });
    }
    
    // ===== Event Handlers =====
    initializeEventHandlers() {
        // Profile button
        document.querySelector('.user-menu-trigger')?.addEventListener('click', () => {
            this.showUserProfile();
        });
        
        // Notifications button
        document.querySelector('.notification-btn')?.addEventListener('click', () => {
            this.showNotifications();
        });
        
        // Create Campaign button
        document.querySelector('.btn-primary')?.addEventListener('click', () => {
            this.createNewCampaign();
        });
        
        // FAB Actions
        document.querySelector('[data-action="compare"]')?.addEventListener('click', () => {
            this.openComparison();
        });
        
        document.querySelector('[data-action="save"]')?.addEventListener('click', () => {
            this.saveCurrentList();
        });
        
        document.querySelector('[data-action="chat"]')?.addEventListener('click', () => {
            this.openChatSupport();
        });
    }
    
    // ===== Company Portal =====
    renderCompanyPortal() {
        const container = document.querySelector('.marketplace-content .container');
        
        const portalHTML = `
            <div class="company-dashboard">
                <!-- Company Header -->
                <div class="company-header">
                    <div class="company-info">
                        <h1>${this.config.currentUser?.name || 'Portal Empresarial'}</h1>
                        <p class="company-industry">Marketing de Influência Premium</p>
                        <div class="company-badges">
                            <span class="badge-verified">✓ Verificado</span>
                            <span class="badge-budget">💰 Budget: R$ 50k-200k</span>
                        </div>
                    </div>
                    <div class="company-actions">
                        <button class="btn-primary" onclick="sollerApp.createDemand()">
                            <span>Criar Demanda</span>
                        </button>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.state.activeDemands.length}</span>
                            <span class="stat-label">Demandas Ativas</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <span class="stat-value">48</span>
                            <span class="stat-label">Influenciadores Disponíveis</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <span class="stat-value">4.3x</span>
                            <span class="stat-label">ROI Médio</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✨</div>
                        <div class="stat-content">
                            <span class="stat-value">92%</span>
                            <span class="stat-label">Taxa de Sucesso</span>
                        </div>
                    </div>
                </div>
                
                <!-- Demand Creator Section -->
                <div class="demand-creator-section">
                    <h2>🎯 Criar Nova Demanda</h2>
                    <p>Escolha o tipo de campanha que deseja criar</p>
                    
                    <div class="demand-templates">
                        <div class="template-card" onclick="sollerApp.createDemand('launch')">
                            <div class="template-icon">🚀</div>
                            <h4>Lançamento de Produto</h4>
                            <p>Ideal para novos produtos</p>
                        </div>
                        <div class="template-card" onclick="sollerApp.createDemand('awareness')">
                            <div class="template-icon">📢</div>
                            <h4>Brand Awareness</h4>
                            <p>Aumentar reconhecimento</p>
                        </div>
                        <div class="template-card" onclick="sollerApp.createDemand('conversion')">
                            <div class="template-icon">💰</div>
                            <h4>Conversão e Vendas</h4>
                            <p>Foco em resultados</p>
                        </div>
                        <div class="template-card" onclick="sollerApp.createDemand('ambassador')">
                            <div class="template-icon">⭐</div>
                            <h4>Embaixador de Marca</h4>
                            <p>Parceria de longo prazo</p>
                        </div>
                    </div>
                </div>
                
                <!-- Active Demands -->
                <div class="active-demands-section">
                    <h2>📋 Suas Demandas Ativas</h2>
                    <div class="demands-grid" id="demandsGrid">
                        ${this.renderDemandCards()}
                    </div>
                </div>
                
                <!-- Matched Influencers -->
                <div class="matched-influencers-section">
                    <h2>🤝 Influenciadores Recomendados</h2>
                    <p>Baseado no seu perfil e demandas ativas</p>
                    <div class="matches-grid" id="matchesGrid">
                        ${this.renderMatchedInfluencers()}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = portalHTML;
    }
    
    // ===== Demand System =====
    initializeDemandSystem() {
        // Load saved demands
        const savedDemands = localStorage.getItem('sollerDemands');
        if (savedDemands) {
            this.state.activeDemands = JSON.parse(savedDemands);
        }
    }
    
    createDemand(type = 'custom') {
        const modal = this.createModal({
            title: '🎯 Criar Nova Demanda',
            content: this.getDemandFormHTML(type),
            actions: [
                {
                    label: 'Cancelar',
                    class: 'btn-ghost',
                    action: () => this.closeModal()
                },
                {
                    label: 'Publicar Demanda',
                    class: 'btn-primary',
                    action: () => this.submitDemand()
                }
            ]
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    getDemandFormHTML(type) {
        const templates = {
            launch: {
                title: 'Lançamento de Produto',
                budget: '20000-50000',
                duration: '30',
                influencers: '3-5'
            },
            awareness: {
                title: 'Brand Awareness',
                budget: '50000-100000',
                duration: '60',
                influencers: '5-10'
            },
            conversion: {
                title: 'Conversão e Vendas',
                budget: '15000-35000',
                duration: '15',
                influencers: '2-4'
            },
            ambassador: {
                title: 'Embaixador de Marca',
                budget: '100000-500000',
                duration: '180',
                influencers: '1-3'
            },
            custom: {
                title: '',
                budget: '',
                duration: '',
                influencers: ''
            }
        };
        
        const template = templates[type] || templates.custom;
        
        return `
            <div class="demand-form">
                <div class="form-section">
                    <h3>Informações Básicas</h3>
                    <div class="form-group">
                        <label>Título da Demanda</label>
                        <input type="text" id="demandTitle" value="${template.title}" placeholder="Ex: Lançamento Nova Coleção Verão">
                    </div>
                    
                    <div class="form-group">
                        <label>Categoria</label>
                        <select id="demandCategory">
                            <option value="beauty">Beauty</option>
                            <option value="fashion">Fashion</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="fitness">Fitness</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea id="demandDescription" rows="4" placeholder="Descreva os objetivos da campanha..."></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Budget e Prazo</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Budget Total (R$)</label>
                            <input type="text" id="demandBudget" value="${template.budget}" placeholder="Ex: 50000">
                        </div>
                        
                        <div class="form-group">
                            <label>Duração (dias)</label>
                            <input type="number" id="demandDuration" value="${template.duration}" placeholder="30">
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Requisitos</h3>
                    <div class="form-group">
                        <label>Número de Influenciadores</label>
                        <input type="text" id="demandInfluencers" value="${template.influencers}" placeholder="Ex: 5-10">
                    </div>
                    
                    <div class="form-group">
                        <label>Engagement Mínimo (%)</label>
                        <input type="number" id="demandEngagement" value="3.0" step="0.1" min="0" max="20">
                    </div>
                    
                    <div class="form-group">
                        <label>Deliverables</label>
                        <div class="deliverables-checklist">
                            <label><input type="checkbox" checked> Posts no Feed</label>
                            <label><input type="checkbox" checked> Stories</label>
                            <label><input type="checkbox"> Reels/TikTok</label>
                            <label><input type="checkbox"> Live</label>
                            <label><input type="checkbox"> IGTV/YouTube</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    submitDemand() {
        const demand = {
            id: Date.now(),
            title: document.getElementById('demandTitle').value,
            category: document.getElementById('demandCategory').value,
            description: document.getElementById('demandDescription').value,
            budget: document.getElementById('demandBudget').value,
            duration: document.getElementById('demandDuration').value,
            influencersNeeded: document.getElementById('demandInfluencers').value,
            minEngagement: document.getElementById('demandEngagement').value,
            status: 'active',
            createdAt: new Date().toISOString(),
            proposals: []
        };
        
        // Validate
        if (!demand.title || !demand.budget) {
            showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
            return;
        }
        
        // Save demand
        this.state.activeDemands.push(demand);
        localStorage.setItem('sollerDemands', JSON.stringify(this.state.activeDemands));
        
        // Update UI
        this.closeModal();
        showToast('✅ Demanda criada com sucesso!', 'success');
        
        // Refresh view if on company portal
        if (this.state.currentView === 'companies') {
            this.renderCompanyPortal();
        }
        
        // Send notifications to matched influencers (mock)
        this.notifyMatchedInfluencers(demand);
    }
    
    renderDemandCards() {
        if (this.state.activeDemands.length === 0) {
            return `
                <div class="empty-state">
                    <p>Você ainda não tem demandas ativas</p>
                    <button class="btn-primary" onclick="sollerApp.createDemand()">
                        Criar Primeira Demanda
                    </button>
                </div>
            `;
        }
        
        return this.state.activeDemands.map(demand => `
            <div class="demand-card">
                <div class="demand-header">
                    <h3>${demand.title}</h3>
                    <span class="demand-status ${demand.status}">${demand.status}</span>
                </div>
                <div class="demand-info">
                    <div class="info-item">
                        <span class="info-label">Budget</span>
                        <span class="info-value">R$ ${demand.budget}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Categoria</span>
                        <span class="info-value">${demand.category}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Duração</span>
                        <span class="info-value">${demand.duration} dias</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Propostas</span>
                        <span class="info-value">${demand.proposals?.length || 0}</span>
                    </div>
                </div>
                <div class="demand-actions">
                    <button class="btn-ghost" onclick="sollerApp.viewDemand(${demand.id})">Ver Detalhes</button>
                    <button class="btn-primary" onclick="sollerApp.viewProposals(${demand.id})">Ver Propostas</button>
                </div>
            </div>
        `).join('');
    }
    
    renderMatchedInfluencers() {
        // Get top matched influencers based on company profile
        const matches = influencers
            .filter(inf => inf.soller)
            .slice(0, 6)
            .map(inf => ({
                ...inf,
                matchScore: Math.floor(Math.random() * 20) + 80,
                matchReason: this.getMatchReason(inf)
            }));
        
        return matches.map(match => `
            <div class="match-card">
                <span class="match-score">${match.matchScore}% Match</span>
                <div class="match-avatar">${match.avatar}</div>
                <h4>${match.name}</h4>
                <p class="match-handle">${match.handle}</p>
                <p class="match-category">${match.category}</p>
                <div class="match-stats">
                    <span>${match.followers}</span>
                    <span>${match.engagement}%</span>
                </div>
                <p class="match-reason">${match.matchReason}</p>
                <button class="btn-primary" onclick="sollerApp.inviteInfluencer(${match.id})">
                    Convidar
                </button>
            </div>
        `).join('');
    }
    
    getMatchReason(influencer) {
        const reasons = [
            'Alto engajamento no seu nicho',
            'Audiência alinhada com seu target',
            'Histórico de sucesso similar',
            'ROI acima da média',
            'Disponível para campanhas imediatas'
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
    
    // ===== Notification System =====
    initializeNotifications() {
        // Create some mock notifications
        this.state.notifications = [
            {
                id: 1,
                type: 'success',
                title: 'Nova proposta recebida',
                message: 'Aline Marquez enviou proposta para sua demanda',
                time: '5 min atrás',
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: 'Campanha finalizada',
                message: 'Campanha "Lançamento Verão" foi concluída com sucesso',
                time: '1 hora atrás',
                read: false
            }
        ];
        
        this.updateNotificationBadge();
    }
    
    showNotifications() {
        const modal = this.createModal({
            title: '🔔 Notificações',
            content: this.renderNotifications(),
            actions: [
                {
                    label: 'Marcar todas como lidas',
                    class: 'btn-ghost',
                    action: () => this.markAllNotificationsRead()
                },
                {
                    label: 'Fechar',
                    class: 'btn-primary',
                    action: () => this.closeModal()
                }
            ]
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    renderNotifications() {
        if (this.state.notifications.length === 0) {
            return '<p style="text-align: center; padding: 2rem;">Nenhuma notificação</p>';
        }
        
        return `
            <div class="notifications-list">
                ${this.state.notifications.map(notif => `
                    <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                        <div class="notification-icon ${notif.type}">
                            ${this.getNotificationIcon(notif.type)}
                        </div>
                        <div class="notification-content">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notification-time">${notif.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || '📬';
    }
    
    updateNotificationBadge() {
        const unreadCount = this.state.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-dot');
        
        if (badge) {
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }
    
    markAllNotificationsRead() {
        this.state.notifications.forEach(n => n.read = true);
        this.updateNotificationBadge();
        showToast('Todas as notificações foram marcadas como lidas', 'success');
        this.closeModal();
    }
    
    // ===== User Profile =====
    showUserProfile() {
        if (!this.config.currentUser) {
            this.showLoginModal();
            return;
        }
        
        const modal = this.createModal({
            title: '👤 Meu Perfil',
            content: this.renderUserProfile(),
            actions: [
                {
                    label: 'Logout',
                    class: 'btn-ghost',
                    action: () => {
                        this.logoutUser();
                        this.closeModal();
                    }
                },
                {
                    label: 'Fechar',
                    class: 'btn-primary',
                    action: () => this.closeModal()
                }
            ]
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    renderUserProfile() {
        const user = this.config.currentUser;
        return `
            <div class="user-profile">
                <div class="profile-header">
                    <div class="profile-avatar">${user.avatar}</div>
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    <span class="user-type-badge">${user.type}</span>
                </div>
                
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-value">${this.state.activeDemands.length}</span>
                        <span class="stat-label">Demandas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.state.savedLists.length}</span>
                        <span class="stat-label">Listas Salvas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">4.5</span>
                        <span class="stat-label">Rating</span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="btn-ghost" onclick="sollerApp.editProfile()">Editar Perfil</button>
                    <button class="btn-ghost" onclick="sollerApp.viewBilling()">Faturamento</button>
                    <button class="btn-ghost" onclick="sollerApp.viewSettings()">Configurações</button>
                </div>
            </div>
        `;
    }
    
    showLoginModal(targetView = null) {
        const modal = this.createModal({
            title: '🚀 Bem-vindo ao Soller Marketplace',
            content: this.renderLoginForm(),
            actions: [
                {
                    label: 'Cancelar',
                    class: 'btn-ghost',
                    action: () => this.closeModal()
                },
                {
                    label: 'Entrar',
                    class: 'btn-primary',
                    action: () => this.handleLogin(targetView)
                }
            ]
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    renderLoginForm() {
        return `
            <div class="login-form">
                <p style="text-align: center; margin-bottom: 2rem;">
                    Escolha como deseja acessar o marketplace
                </p>
                
                <div class="login-options">
                    <label class="login-option">
                        <input type="radio" name="userType" value="influencer" checked>
                        <div class="option-card">
                            <span class="option-icon">✨</span>
                            <span class="option-label">Sou Influenciador</span>
                        </div>
                    </label>
                    
                    <label class="login-option">
                        <input type="radio" name="userType" value="company">
                        <div class="option-card">
                            <span class="option-icon">🏢</span>
                            <span class="option-label">Sou Empresa</span>
                        </div>
                    </label>
                    
                    <label class="login-option">
                        <input type="radio" name="userType" value="agency">
                        <div class="option-card">
                            <span class="option-icon">🤝</span>
                            <span class="option-label">Sou Agência</span>
                        </div>
                    </label>
                </div>
                
                <div class="form-group" style="margin-top: 2rem;">
                    <label>Nome</label>
                    <input type="text" id="loginName" placeholder="Seu nome ou empresa">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" placeholder="seu@email.com">
                </div>
            </div>
        `;
    }
    
    handleLogin(targetView) {
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const name = document.getElementById('loginName').value;
        const email = document.getElementById('loginEmail').value;
        
        if (!name || !email) {
            showToast('Por favor, preencha todos os campos', 'warning');
            return;
        }
        
        this.loginUser(userType, { name, email });
        this.closeModal();
        
        if (targetView) {
            this.navigateTo(targetView);
        }
    }
    
    // ===== Campaign Creation =====
    createNewCampaign() {
        if (!this.config.currentUser) {
            this.showLoginModal('companies');
            return;
        }
        
        if (this.config.currentUser.type === 'influencer') {
            showToast('Apenas empresas podem criar campanhas', 'info');
            return;
        }
        
        this.createDemand();
    }
    
    // ===== Comparison System =====
    openComparison() {
        if (this.state.comparisonList.size < 2) {
            showToast('Selecione pelo menos 2 influenciadores para comparar', 'info');
            return;
        }
        
        comparisonTool.openComparisonModal();
    }
    
    // ===== Save Lists =====
    saveCurrentList() {
        const filtered = getFilteredInfluencers();
        
        if (filtered.length === 0) {
            showToast('Nenhum influenciador para salvar', 'warning');
            return;
        }
        
        const listName = prompt('Nome da lista:');
        if (!listName) return;
        
        const list = {
            id: Date.now(),
            name: listName,
            influencers: filtered.map(i => i.id),
            createdAt: new Date().toISOString()
        };
        
        this.state.savedLists.push(list);
        localStorage.setItem('sollerLists', JSON.stringify(this.state.savedLists));
        
        showToast(`Lista "${listName}" salva com ${filtered.length} influenciadores`, 'success');
    }
    
    loadSavedData() {
        const savedLists = localStorage.getItem('sollerLists');
        if (savedLists) {
            this.state.savedLists = JSON.parse(savedLists);
        }
    }
    
    // ===== Chat Support =====
    openChatSupport() {
        const modal = this.createModal({
            title: '💬 Suporte ao Vivo',
            content: `
                <div class="chat-support">
                    <div class="chat-messages">
                        <div class="message support">
                            <p>Olá! Como posso ajudar você hoje?</p>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Digite sua mensagem..." id="chatInput">
                        <button class="btn-primary" onclick="sollerApp.sendChatMessage()">Enviar</button>
                    </div>
                    <p style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: var(--gray-500);">
                        Horário de atendimento: Seg-Sex 9h-18h
                    </p>
                </div>
            `,
            actions: [
                {
                    label: 'Fechar',
                    class: 'btn-primary',
                    action: () => this.closeModal()
                }
            ]
        });
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        const messagesContainer = document.querySelector('.chat-messages');
        
        // Add user message
        messagesContainer.innerHTML += `
            <div class="message user">
                <p>${message}</p>
            </div>
        `;
        
        input.value = '';
        
        // Simulate support response
        setTimeout(() => {
            messagesContainer.innerHTML += `
                <div class="message support">
                    <p>Obrigado por sua mensagem! Um de nossos especialistas entrará em contato em breve.</p>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
    
    // ===== Agency Portal =====
    renderAgencyPortal() {
        const container = document.querySelector('.marketplace-content .container');
        
        container.innerHTML = `
            <div class="agency-portal">
                <div class="coming-soon">
                    <h2>🚀 Portal de Agências - Em Breve!</h2>
                    <p>Estamos preparando ferramentas exclusivas para agências parceiras:</p>
                    <ul>
                        <li>✅ Gestão de múltiplos clientes</li>
                        <li>✅ Dashboard white-label</li>
                        <li>✅ API de integração</li>
                        <li>✅ Comissionamento automático</li>
                        <li>✅ Relatórios personalizados</li>
                    </ul>
                    <button class="btn-primary" onclick="sollerApp.joinWaitlist()">
                        Entrar na Lista de Espera
                    </button>
                </div>
            </div>
        `;
    }
    
    joinWaitlist() {
        showToast('✅ Você foi adicionado à lista de espera!', 'success');
    }
    
    // ===== Modal System =====
    createModal(config) {
        const modal = document.createElement('div');
        modal.className = 'modal-wrapper';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="sollerApp.closeModal()"></div>
            <div class="modal-content premium-modal">
                <button class="modal-close" onclick="sollerApp.closeModal()">×</button>
                <div class="modal-header-premium">
                    <h2>${config.title}</h2>
                </div>
                <div class="modal-body">
                    ${config.content}
                </div>
                ${config.actions ? `
                    <div class="modal-footer" style="display: flex; gap: 1rem; padding: 1.5rem; border-top: 1px solid var(--gray-200);">
                        ${config.actions.map(action => `
                            <button class="${action.class}" onclick="${action.action.toString().replace(/^.*\{|\}.*$/g, '')}">
                                ${action.label}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        this.state.activeModal = modal;
        return modal;
    }
    
    closeModal() {
        if (this.state.activeModal) {
            this.state.activeModal.classList.remove('active');
            setTimeout(() => {
                this.state.activeModal.remove();
                this.state.activeModal = null;
            }, 300);
        }
    }
    
    // ===== Initial Data Loading =====
    async loadInitialData() {
        // Simulate loading delay
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('✅ Data loaded');
                resolve();
            }, 500);
        });
    }
    
    // ===== Additional Methods =====
    notifyMatchedInfluencers(demand) {
        // Mock notification to influencers
        const matchedCount = Math.floor(Math.random() * 10) + 5;
        showToast(`📢 ${matchedCount} influenciadores foram notificados sobre sua demanda`, 'success');
    }
    
    inviteInfluencer(influencerId) {
        const influencer = influencers.find(i => i.id === influencerId);
        if (influencer) {
            showToast(`✉️ Convite enviado para ${influencer.name}`, 'success');
        }
    }
    
    viewDemand(demandId) {
        const demand = this.state.activeDemands.find(d => d.id === demandId);
        if (demand) {
            showToast('Visualizando demanda: ' + demand.title, 'info');
        }
    }
    
    viewProposals(demandId) {
        showToast('Sistema de propostas será implementado na próxima versão', 'info');
    }
    
    editProfile() {
        showToast('Editor de perfil em desenvolvimento', 'info');
    }
    
    viewBilling() {
        showToast('Sistema de faturamento em desenvolvimento', 'info');
    }
    
    viewSettings() {
        showToast('Configurações em desenvolvimento', 'info');
    }
}

// ===== Initialize Application =====
let sollerApp;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Soller Marketplace...');
    
    // Initialize main app
    sollerApp = new SollerMarketplace();
    
    // Make it globally accessible
    window.sollerApp = sollerApp;
    
    // Add custom styles for new components
    const styles = document.createElement('style');
    styles.textContent = `
        /* Login Form Styles */
        .login-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .login-option input {
            display: none;
        }
        
        .option-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1.5rem;
            border: 2px solid var(--gray-300);
            border-radius: var(--radius-xl);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .login-option input:checked + .option-card {
            border-color: var(--soller-purple);
            background: linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(236, 72, 153, 0.05));
        }
        
        .option-icon {
            font-size: 2rem;
        }
        
        .option-label {
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        /* User Profile Styles */
        .user-profile {
            padding: 1rem;
        }
        
        .profile-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, var(--soller-purple), var(--soller-pink));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        
        .user-type-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--gray-100);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .profile-stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            padding: 2rem;
            background: var(--gray-50);
            border-radius: var(--radius-xl);
            margin-bottom: 2rem;
        }
        
        .profile-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        /* Chat Support Styles */
        .chat-support {
            height: 400px;
            display: flex;
            flex-direction: column;
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: var(--gray-50);
            border-radius: var(--radius-lg);
            margin-bottom: 1rem;
        }
        
        .message {
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-radius: var(--radius-lg);
            max-width: 70%;
        }
        
        .message.support {
            background: var(--gray-200);
            margin-right: auto;
        }
        
        .message.user {
            background: var(--soller-purple);
            color: white;
            margin-left: auto;
        }
        
        .chat-input {
            display: flex;
            gap: 0.5rem;
        }
        
        .chat-input input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid var(--gray-300);
            border-radius: var(--radius-lg);
        }
        
        /* Notifications List */
        .notifications-list {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--gray-200);
            transition: background 0.3s ease;
        }
        
        .notification-item:hover {
            background: var(--gray-50);
        }
        
        .notification-item.unread {
            background: rgba(107, 70, 193, 0.05);
        }
        
        .notification-icon {
            font-size: 1.5rem;
        }
        
        .notification-content h4 {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
        }
        
        .notification-content p {
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
            color: var(--gray-600);
        }
        
        .notification-time {
            font-size: 0.75rem;
            color: var(--gray-500);
        }
        
        /* Coming Soon */
        .coming-soon {
            text-align: center;
            padding: 4rem;
            background: linear-gradient(135deg, var(--gray-50), var(--primary-white));
            border-radius: var(--radius-2xl);
        }
        
        .coming-soon h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .coming-soon ul {
            list-style: none;
            padding: 2rem 0;
            text-align: left;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .coming-soon li {
            padding: 0.5rem 0;
            font-size: 1.1rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .login-options {
                grid-template-columns: 1fr;
            }
            
            .profile-stats {
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(styles);
    
    console.log('✅ Soller Marketplace ready!');
});

// Export for global access
window.SollerConfig = SollerConfig;
window.SollerMarketplace = SollerMarketplace;