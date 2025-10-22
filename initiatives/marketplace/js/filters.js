/**
 * Sistema de Filtros Soller - Marketing de Influência
 * Versão 3.0 - Totalmente refatorado e funcional
 */

class SollerFilters {
    constructor() {
        this.activeFilters = {
            category: 'all',
            search: '',
            followers: 'all',
            minEngagement: 0,
            minPrice: 0,
            maxPrice: Infinity,
            location: '',
            platforms: [],
            verified: false
        };
        
        this.influencers = [];
        this.filteredInfluencers = [];
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Soller Filters...');
        await this.loadInfluencers();
        this.setupEventListeners();
        this.renderInfluencers();
    }

    async loadInfluencers() {
        // Usar os dados do data.js
        if (typeof influencers !== 'undefined') {
            this.influencers = influencers;
            console.log(`✅ Loaded ${this.influencers.length} influencers from data.js`);
            
            // Adicionar a lógica de ordenação alfabética aqui
            this.influencers.sort((a, b) => {
                const nameA = a.name.toUpperCase(); // Para ignorar maiúsculas/minúsculas
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0; // Nomes iguais
            });
            
        } else {
            console.error('❌ Influencers data not found!');
            this.influencers = [];
        }
        
        this.filteredInfluencers = [...this.influencers];
    }

    setupEventListeners() {
        // Toggle filtros avançados
        const filterToggle = document.getElementById('filter-toggle-btn');
const advancedFilters = document.getElementById('advanced-filters');

if (filterToggle && advancedFilters) {
    filterToggle.addEventListener('click', () => {
        advancedFilters.classList.toggle('active');
        filterToggle.classList.toggle('active');
    });
}

        // Quick Filters (Pills)
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active de todos
                document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                
                // Adiciona active no clicado
                pill.classList.add('active');
                
                // Aplica o filtro
                const filter = pill.dataset.filter;
                this.applyQuickFilter(filter);
            });
        });

        // Busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.activeFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Segment Control (Alcance de Seguidores)
        document.querySelectorAll('.segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilters.followers = btn.dataset.followers;
                this.applyFilters();
            });
        });

        // Engagement Range
        const engagementRange = document.getElementById('engagement-range');
        const engagementValue = document.getElementById('engagement-value');
        
        if (engagementRange && engagementValue) {
            engagementRange.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                engagementValue.textContent = value.toFixed(1) + '%';
                this.activeFilters.minEngagement = value;
                this.applyFilters();
            });
        }

        // Price Range
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        if (priceMin) {
            priceMin.addEventListener('input', (e) => {
                this.activeFilters.minPrice = parseInt(e.target.value) || 0;
                this.applyFilters();
            });
        }
        
        if (priceMax) {
            priceMax.addEventListener('input', (e) => {
                this.activeFilters.maxPrice = parseInt(e.target.value) || Infinity;
                this.applyFilters();
            });
        }

        // Location
        const locationSelect = document.getElementById('location-filter');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.activeFilters.location = e.target.value;
                this.applyFilters();
            });
        }

        // Multi-select Platforms
        const platformTrigger = document.getElementById('platform-select-trigger');
        const platformDropdown = document.getElementById('platform-dropdown');
        
        if (platformTrigger && platformDropdown) {
            // Toggle dropdown
            platformTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                platformDropdown.classList.toggle('active');
                platformTrigger.classList.toggle('active');
            });
            
            // Handle checkbox changes
            platformDropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updatePlatformFilters();
                    this.updatePlatformTriggerText();
                    this.applyFilters();
                });
            });
            
            // Close on outside click
            document.addEventListener('click', () => {
                platformDropdown.classList.remove('active');
                platformTrigger.classList.remove('active');
            });
            
            platformDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Clear Filters
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Apply Filters Button
        const applyButton = document.getElementById('apply-filters');
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                this.applyFilters();
            });
        }
    }

    updatePlatformFilters() {
        const checkboxes = document.querySelectorAll('#platform-dropdown input[type="checkbox"]:checked');
        this.activeFilters.platforms = Array.from(checkboxes).map(cb => cb.value);
    }

    updatePlatformTriggerText() {
        const trigger = document.getElementById('platform-select-trigger');
        const selected = this.activeFilters.platforms;
        
        if (trigger) {
            const span = trigger.querySelector('span');
            if (selected.length === 0) {
                span.textContent = 'Selecionar';
            } else if (selected.length === 1) {
                span.textContent = selected[0].charAt(0).toUpperCase() + selected[0].slice(1);
            } else {
                span.textContent = `${selected.length} selecionadas`;
            }
        }
    }

    applyQuickFilter(filter) {
        console.log('Applying quick filter:', filter);
        
        this.activeFilters.category = filter;
        
        if (filter === 'all') {
            this.filteredInfluencers = [...this.influencers];
        } else if (filter === 'soller') {
            this.filteredInfluencers = this.influencers.filter(inf => inf.sollerExclusive);
        } else if (filter === 'trending') {
            this.filteredInfluencers = this.influencers.filter(inf => inf.trending);
        } else {
            // Filter by category
            this.filteredInfluencers = this.influencers.filter(inf => {
                const categories = inf.categories || inf.category || [];
                const categoriesArray = Array.isArray(categories) ? categories : [categories];
                return categoriesArray.some(cat => cat.toLowerCase() === filter.toLowerCase());
            });
        }
        
        this.applyFilters(false);
    }

    applyFilters(resetCategory = true) {
        let filtered = resetCategory ? [...this.influencers] : [...this.filteredInfluencers];

        // Search filter
        if (this.activeFilters.search) {
            filtered = filtered.filter(inf => 
                inf.name.toLowerCase().includes(this.activeFilters.search) ||
                inf.handle.toLowerCase().includes(this.activeFilters.search) ||
                (inf.bio && inf.bio.toLowerCase().includes(this.activeFilters.search))
            );
        }

        // Followers filter
        if (this.activeFilters.followers !== 'all') {
            filtered = filtered.filter(inf => {
                const followers = this.parseFollowers(inf.followers);
                
                switch(this.activeFilters.followers) {
                    case 'micro':
                        return followers >= 10000 && followers < 100000;
                    case 'mid':
                        return followers >= 100000 && followers < 500000;
                    case 'macro':
                        return followers >= 500000 && followers < 1000000;
                    case 'mega':
                        return followers >= 1000000;
                    default:
                        return true;
                }
            });
        }

        // Engagement filter
        if (this.activeFilters.minEngagement > 0) {
            filtered = filtered.filter(inf => 
                inf.engagement >= this.activeFilters.minEngagement
            );
        }

        // Price filter
        filtered = filtered.filter(inf => {
            const price = inf.price || 0;
            return price >= this.activeFilters.minPrice && price <= this.activeFilters.maxPrice;
        });

        // Location filter
        if (this.activeFilters.location) {
            filtered = filtered.filter(inf => 
                inf.location && inf.location.includes(this.activeFilters.location)
            );
        }

        // Platform filter
        if (this.activeFilters.platforms.length > 0) {
            filtered = filtered.filter(inf => {
                const infPlatforms = (inf.platforms || []).map(p => p.toLowerCase());
                
                // Usamos .every() para garantir que TODAS as plataformas selecionadas
                // estão presentes no array do influenciador.
                return this.activeFilters.platforms.every(platform => 
                    infPlatforms.includes(platform)
                );
            });
        }

        this.filteredInfluencers = filtered;
        this.renderInfluencers();
        this.updateResultsCount();
    }

    parseFollowers(followersStr) {
        if (typeof followersStr === 'number') return followersStr;
        
        const str = followersStr.toString().toUpperCase();
        let multiplier = 1;
        
        if (str.includes('M')) {
            multiplier = 1000000;
        } else if (str.includes('K')) {
            multiplier = 1000;
        }
        
        const number = parseFloat(str.replace(/[^0-9.]/g, ''));
        return number * multiplier;
    }

    clearAllFilters() {
        // Reset filters
        this.activeFilters = {
            category: 'all',
            search: '',
            followers: 'all',
            minEngagement: 0,
            minPrice: 0,
            maxPrice: Infinity,
            location: '',
            platforms: [],
            verified: false
        };

        // Reset UI
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        document.querySelector('.filter-pill[data-filter="all"]')?.classList.add('active');
        
        document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.segment-btn[data-followers="all"]')?.classList.add('active');
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        const engagementRange = document.getElementById('engagement-range');
        if (engagementRange) {
            engagementRange.value = 0;
            document.getElementById('engagement-value').textContent = '0.0%';
        }
        
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        document.getElementById('location-filter').value = '';
        
        document.querySelectorAll('#platform-dropdown input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        this.updatePlatformTriggerText();
        
        this.filteredInfluencers = [...this.influencers];
        this.renderInfluencers();
        this.updateResultsCount();
    }

    renderInfluencers() {
        const container = document.getElementById('influencers-container');
        if (!container) return;

        if (this.filteredInfluencers.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum influenciador encontrado</h3>
                    <p>Tente ajustar os filtros ou fazer uma nova busca</p>
                    <button class="btn btn-primary" onclick="sollerFilters.clearAllFilters()">
                        Limpar Filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredInfluencers.map(inf => this.createInfluencerCard(inf)).join('');
    }

    createInfluencerCard(influencer) {
        // Get avatar - use emoji or image
        const avatar = influencer.avatar?.startsWith('http') 
            ? `<img src="${influencer.avatar}" alt="${influencer.name}" class="influencer-avatar">`
            : `<div class="influencer-avatar-emoji">${influencer.avatar || '👤'}</div>`;

        // Get platforms
        const platforms = (influencer.platforms || ['instagram']).map(platform => {
    const icons = {
        instagram: 'fab fa-instagram',
        tiktok: 'fab fa-tiktok',
        youtube: 'fab fa-youtube',
        linkedin: 'fab fa-linkedin',
        twitter: 'fab fa-twitter'
    };
    return `<i class="${icons[platform.toLowerCase()] || 'fas fa-globe'}" title="${platform}"></i>`;
}).join('');

        // Get categories
        const categories = Array.isArray(influencer.categories) 
            ? influencer.categories 
            : (influencer.category ? [influencer.category] : []);

        return `
            <div class="influencer-card" data-id="${influencer.id}">
                ${influencer.sollerExclusive ? '<div class="soller-badge">⭐</div>' : ''}
                ${influencer.trending ? '<div class="trending-badge">Em Alta</div>' : ''}
                
                <div class="card-header">
                    ${avatar}
                </div>
                
                <div class="card-body">
                    <h3>${influencer.name}</h3>
                    <p class="handle">${influencer.handle}</p>
                    <p class="influencer-bio" style="font-size: 0.8125rem; color: #4B5563; line-height: 1.4; text-align: center; height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;">${influencer.bio || ''}</p>
                    
                    <div class="stats-row">
                        <div class="stat">
                            <span class="stat-value">${influencer.followers}</span>
                            <span class="stat-label">Seguidores</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${influencer.engagement}%</span>
                            <span class="stat-label">Engajamento</span>
                        </div>
                    </div>
                    
                    <div class="categories">
                        ${categories.map(cat => `
                            <span class="category-tag">${cat}</span>
                        `).join('')}
                    </div>
                    
                    <div class="platforms">
                        ${platforms}
                    </div>
                    
                    <div class="card-footer">
                        <span class="price">R$ ${window.SollerUtils.formatNumberCompact(influencer.price)}/post</span>
                        <button class="btn btn-primary btn-sm" onclick="openProposalModal(${influencer.id})">
                            Enviar Proposta
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = `${this.filteredInfluencers.length} influenciadores encontrados`;
        }
    }
}

// Global function for opening proposal modal
function openProposalModal(influencerId) {
    const modal = document.getElementById('proposal-modal');
    if (modal) {
        modal.classList.add('active');
        console.log('Opening proposal for influencer:', influencerId);
    }
}

// Global function for closing modals
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize when DOM is ready
let sollerFilters;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Soller Filters...');
    sollerFilters = new SollerFilters();
    window.sollerFilters = sollerFilters;
});