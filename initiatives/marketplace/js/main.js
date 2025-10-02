/**
 * Soller Main JavaScript
 * Arquivo principal de inicialização
 */

class SollerApp {
    constructor() {
        this.isInitialized = false;
        this.components = {
            filters: null,
            auth: null,
            data: null
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Soller Marketplace...');
            
            // Verificar dependências
            await this.checkDependencies();
            
            // Carregar dados
            await this.loadData();
            
            // Inicializar componentes
            this.initializeComponents();
            
            // Setup event listeners
            this.setupGlobalListeners();
            
            this.isInitialized = true;
            console.log('✅ Soller Marketplace initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            this.showErrorState();
        }
    }

    async checkDependencies() {
        const requiredScripts = ['config', 'data', 'filters', 'auth'];
        const missing = [];
        
        requiredScripts.forEach(script => {
            if (!window[script + 'Loaded']) {
                // Marcar como carregado se o objeto existe
                if (script === 'config' && window.MARKETPLACE_CONFIG) {
                    window.configLoaded = true;
                } else if (script === 'data' && window.influencersData) {
                    window.dataLoaded = true;
                } else if (script === 'filters' && window.SollerFilters) {
                    window.filtersLoaded = true;
                } else if (script === 'auth' && window.SollerAuth) {
                    window.authLoaded = true;
                }
            }
        });
        
        // Re-verificar
        requiredScripts.forEach(script => {
            if (!window[script + 'Loaded']) {
                missing.push(script);
            }
        });
        
        if (missing.length > 0) {
            console.warn('⚠️ Some dependencies are not fully loaded:', missing);
            // Continuar mesmo assim, pois os scripts podem estar parcialmente carregados
        }
        
        return true;
    }

    async loadData() {
        // Se os dados já existem, usar eles
        if (window.influencersData) {
            this.components.data = window.influencersData;
            console.log('✅ Data loaded from data.js');
            return;
        }
        
        // Senão, criar dados mockados
        this.components.data = this.getMockData();
        console.log('✅ Mock data created');
    }

    getMockData() {
        return [
            {
                id: 1,
                name: "Marina Beauty",
                handle: "@marinabeauty",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
                categories: ["beauty", "fashion"],
                followers: 125000,
                engagement: 4.8,
                price: 1500,
                location: "São Paulo, SP",
                platforms: ["instagram", "tiktok"],
                verified: true,
                trending: true,
                sollerExclusive: true,
                bio: "Beauty expert e criadora de conteúdo",
                media: {
                    posts: 1234,
                    avgLikes: 6000,
                    avgComments: 250
                }
            },
            {
                id: 2,
                name: "João Lifestyle",
                handle: "@joaolifestyle",
                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                categories: ["lifestyle", "fitness"],
                followers: 85000,
                engagement: 5.2,
                price: 800,
                location: "Rio de Janeiro, RJ",
                platforms: ["instagram"],
                verified: true,
                trending: false,
                sollerExclusive: false,
                bio: "Lifestyle coach e personal trainer"
            },
            {
                id: 3,
                name: "Ana Fashion",
                handle: "@anafashion",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                categories: ["fashion", "beauty"],
                followers: 250000,
                engagement: 3.9,
                price: 2500,
                location: "São Paulo, SP",
                platforms: ["instagram", "tiktok", "youtube"],
                verified: true,
                trending: true,
                sollerExclusive: true,
                bio: "Fashion influencer e consultora de estilo"
            }
        ];
    }

    initializeComponents() {
        // Inicializar filtros se a classe existir
        if (window.SollerFilters && !window.sollerFilters) {
            window.sollerFilters = new SollerFilters();
            this.components.filters = window.sollerFilters;
            console.log('✅ Filters component initialized');
        }
        
        // Inicializar autenticação se existir
        if (window.SollerAuth && !window.sollerAuth) {
            window.sollerAuth = new SollerAuth();
            this.components.auth = window.sollerAuth;
            console.log('✅ Auth component initialized');
        }
        
        // Remover loading state
        this.hideLoadingState();
    }

    setupGlobalListeners() {
        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Mobile menu
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
        
        // Adicionar animações de scroll
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos com classe animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    hideLoadingState() {
        const loadingStates = document.querySelectorAll('.loading-state');
        loadingStates.forEach(state => {
            setTimeout(() => {
                state.style.display = 'none';
            }, 500);
        });
    }

    showErrorState() {
        const container = document.getElementById('influencers-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Ops! Algo deu errado</h3>
                    <p>Não foi possível carregar os influenciadores. Por favor, tente novamente.</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fas fa-sync"></i>
                        Recarregar Página
                    </button>
                </div>
            `;
        }
    }

    // API Pública
    getComponent(name) {
        return this.components[name];
    }

    isReady() {
        return this.isInitialized;
    }
}

function formatNumberCompact(num) {
    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
    }
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'K' : formatted + 'K';
    }
    return num;
}

// Funções Globais Utilitárias
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

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Toast Notifications
function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll to Element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Get Query Parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set Query Parameter
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// Remove Query Parameter
function removeQueryParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url);
}

// Lazy Load Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Copy to Clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiado para a área de transferência!', 'success');
        }).catch(() => {
            showToast('Erro ao copiar', 'error');
        });
    } else {
        // Fallback para browsers antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Copiado!', 'success');
        } catch (err) {
            showToast('Erro ao copiar', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Inicializar aplicação quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sollerApp = new SollerApp();
    });
} else {
    // DOM já carregado
    window.sollerApp = new SollerApp();
}

// Exportar funções úteis
window.SollerUtils = {
    debounce,
    formatCurrency,
    formatNumberCompact,
    formatNumber,
    showToast,
    scrollToTop,
    scrollToElement,
    getQueryParam,
    setQueryParam,
    removeQueryParam,
    lazyLoadImages,
    copyToClipboard
};

// Marcar script como carregado
window.mainLoaded = true;