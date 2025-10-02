/**
 * ClientScatter3D - Visualização de Clientes em 2D/3D
 * Versão Final Corrigida - Lógica dos Quadrantes Ajustada
 * Reference Date: 2025-07-31
 */

class ClientScatter3D {
    constructor(container, options = {}) {
        if (!container) {
            throw new Error('Container é obrigatório');
        }
        
        this.container = typeof container === 'string' 
            ? document.getElementById(container) 
            : container;
            
        if (!this.container) {
            throw new Error('Container não encontrado');
        }
        
        this.options = {
            referenceDate: '2025-07-31',
            pointSize: 8,
            enableLasso: true,
            backgroundColor: 0x2d2d2d,
            gridColor: 0x505050,
            axisColor: 0x808080,
            ...options
        };
        
        this.referenceDate = new Date(this.options.referenceDate);
        this.rawData = [];
        this.processedData = [];
        this.filteredData = [];
        this.selectedIds = new Set();
        
        this.isFullscreen = false;
        this.is3D = false;
        this.currentFilter = 'all';
        this.activeQuadrantFilters = new Set();
        this.activeColorFilters = new Set();
        this.wallsOpaque = false;
        this.exclusiveFilters = false;
        
        this.scene = null;
        this.camera = null;
        this.camera3D = null;
        this.renderer = null;
        this.controls = null;
        this.controls3D = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.pointsGroup = null;
        this.pointsMesh = null;
        this.borderMeshes = [];
        this.quadrantLabels2D = [];
        this.quadrantLabels3D = [];
        this.quadrantSprites = {};
        this.wallHelpers = [];
        
        this.tooltip = null;
        this.controlPanel = null;
        this.statsDisplay = null;
        
        this._boundHandlers = {
            onMouseMove: this.onMouseMove.bind(this),
            onClick: this.onClick.bind(this),
            onResize: this.onResize.bind(this),
            onKeyDown: this.onKeyDown.bind(this)
        };
        
        this.recencyColors = {
            0: 0x228B22,
            90: 0xffc800,
            180: 0xc80000,
            300: 0x960000,
            365: 0x000000
        };
        
        this.colorFilterMap = {
            'ativo': (client) => client.days_since !== null && client.days_since <= 30,
            'atenção': (client) => client.days_since !== null && client.days_since > 30 && client.days_since <= 90,
            'churn': (client) => client.days_since !== null && client.days_since > 90 && client.days_since <= 180,
            'perdido': (client) => client.days_since !== null && client.days_since > 180 && client.days_since <= 300,
            'inativo': (client) => client.days_since !== null && client.days_since > 300,
            'crescimento': (client) => !client.yoy_is_new && ((client.yoy_growth || 0) > 0),
            'decrescimento': (client) => !client.yoy_is_new && ((client.yoy_growth || 0) < 0),
            'crescimento-yoy': (client) => !client.yoy_is_new && ((client.yoy_growth || 0) > 0),
            'decrescimento-yoy': (client) => !client.yoy_is_new && ((client.yoy_growth || 0) < 0),
            'novo': (client) => !!client.yoy_is_new
        };
        
        this.init();
    }

    pseudoSymlogPos(value, linthresh, maxValue) {
        if (value <= 0 || isNaN(value)) return 0;
        if (linthresh <= 0) linthresh = 1;
        
        let t;
        if (value <= linthresh) {
            t = value / linthresh;
        } else {
            t = 1 + Math.log10(value / linthresh);
        }
        
        return t;
    }
    
    mapTransformedToAxisRange(t, axisMin, axisMax) {
        return axisMin + t * (axisMax - axisMin);
    }
    
    calculateXPosition(contracts, maxContracts) {
        const CONTRACTS_CUTOFF = (this.CONTRACTS_CUTOFF != null) ? this.CONTRACTS_CUTOFF : 5;
        const MIN_CONTRACTS = (this.MIN_CONTRACTS != null) ? this.MIN_CONTRACTS : 0;

        const axisNegMin = -45, axisNegMax = -5;
        const axisPosMin = 5, axisPosMax = 45;

        const raw = (contracts === null || contracts === undefined) ? MIN_CONTRACTS : contracts;
        const value = Number.isFinite(raw) ? Number(raw) : MIN_CONTRACTS;

        const observedMax = Number.isFinite(maxContracts) ? Math.max(maxContracts, CONTRACTS_CUTOFF) : Math.max(value, CONTRACTS_CUTOFF);

        let x;

        if (value <= CONTRACTS_CUTOFF) {
            const denom = Math.log(CONTRACTS_CUTOFF + 1);
            const numer = Math.log(value + 1);
            const t = denom > 0 ? (numer / denom) : 0;
            x = axisNegMin + t * (axisNegMax - axisNegMin);
        } else {
            const numer = Math.log(value - CONTRACTS_CUTOFF + 1);
            const denom = Math.log(Math.max(1, observedMax - CONTRACTS_CUTOFF + 1));
            const t = denom > 0 ? (numer / denom) : 0;
            x = axisPosMin + t * (axisPosMax - axisPosMin);
        }

        return Math.max(axisNegMin, Math.min(axisPosMax, x));
    }
    
    calculateYPosition(value, maxValue) {
        const VALUE_CUTOFF = 17100;
        const MIN_VALUE = 100;
        
        const val = Math.max(MIN_VALUE, value || MIN_VALUE);
        
        if (val < VALUE_CUTOFF) {
            const t = this.pseudoSymlogPos(val, VALUE_CUTOFF, VALUE_CUTOFF);
            return this.mapTransformedToAxisRange(t, -45, -5);
        } else {
            const adjustedValue = val - VALUE_CUTOFF + 1;
            const adjustedMax = maxValue - VALUE_CUTOFF + 1;
            const t = this.pseudoSymlogPos(adjustedValue, 1, adjustedMax);
            return this.mapTransformedToAxisRange(t, 5, 45);
        }
    }
    
    calculateZPosition(days) {
        const CHURN_CUTOFF = 90;
        const MIN_DAYS = 0;
        const MAX_DAYS = 365;
        
        if (!this.is3D || days === null || days === undefined) return 0;
        
        const d = Math.max(MIN_DAYS, Math.min(MAX_DAYS, days));
        
        if (d <= CHURN_CUTOFF) {
            const t = d / CHURN_CUTOFF;
            return 45 * (1 - t);
        } else {
            const adjustedDays = d - CHURN_CUTOFF;
            const maxAdjusted = MAX_DAYS - CHURN_CUTOFF;
            
            if (maxAdjusted > 0) {
                const t = Math.log(adjustedDays + 1) / Math.log(maxAdjusted + 1);
                return -45 * t;
            } else {
                return -22.5;
            }
        }
    }
    
    init() {
    this.setupDOM();
    this.setupThree();
    this.setupControls();
    this.setupEventListeners();
    
    // Força múltiplos resizes para garantir dimensões corretas
    const forceResize = () => {
        this.onResize();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    };
    
    // Resize progressivo para garantir que pegue as dimensões corretas
    forceResize();
    setTimeout(forceResize, 80);
    setTimeout(forceResize, 500);
    setTimeout(forceResize, 100);
    setTimeout(forceResize, 250);
    setTimeout(forceResize, 700);
    
    // Iniciar animação após setup completo
    setTimeout(() => {
        this.animate();
        if (this.processedData.length > 0) {
            this.createVisualization();
        }
    }, 300);
}
    
    setupDOM() {
        this.container.innerHTML = '';
        
        this.wrapper = document.createElement('div');
        this.wrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: #2d2d2d;
            border-radius: 12px;
            overflow: hidden;
        `;
        this.container.appendChild(this.wrapper);
        
        this.canvasWrapper = document.createElement('div');
        this.canvasWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
        `;
        this.wrapper.appendChild(this.canvasWrapper);
        
        this.createControlPanel();
        this.createTooltip();
        this.createStatsDisplay();
        this.createSelectedCompaniesDisplay(); 
    }
    
    setupThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
    
    // Força recálculo de dimensões
    this.canvasWrapper.style.display = 'block';
    const rect = this.canvasWrapper.getBoundingClientRect();
    const width = Math.max(rect.width, 800);
    const height = Math.max(rect.height, 600);
    
    this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.canvasWrapper.appendChild(this.renderer.domElement);
    
    const aspect = width / height;
    const frustumSize = 100;
    this.camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
    );
    
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    
    this.camera3D = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    );
    this.camera3D.position.set(80, 80, 120);
    this.camera3D.lookAt(0, 0, 0);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 50, 50);
    this.scene.add(directionalLight);
    
    this.pointsGroup = new THREE.Group();
    this.pointsGroup.renderOrder = 10;
    this.scene.add(this.pointsGroup);
    
    this.createGrid();
    this.createAxes();
    this.createQuadrantLabels();
    this.createAxisWalls();
    
    // Força render inicial
    this.renderer.render(this.scene, this.camera);
}
    
    createGrid() {
        const gridHelper = new THREE.GridHelper(100, 10, this.options.gridColor, this.options.gridColor);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.renderOrder = 0;
        this.scene.add(gridHelper);
    }
    
    createAxes() {
        const axesMaterial = new THREE.LineBasicMaterial({ color: this.options.axisColor });
        
        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-50, 0, 0),
            new THREE.Vector3(50, 0, 0)
        ]);
        const xAxis = new THREE.Line(xGeometry, axesMaterial);
        this.scene.add(xAxis);
        
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -50, 0),
            new THREE.Vector3(0, 50, 0)
        ]);
        const yAxis = new THREE.Line(yGeometry, axesMaterial);
        this.scene.add(yAxis);
        
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, -50),
            new THREE.Vector3(0, 0, 50)
        ]);
        const zAxis = new THREE.Line(zGeometry, axesMaterial);
        zAxis.visible = false;
        this.scene.add(zAxis);
        this.zAxis = zAxis;
        
        this.createAxisLabels();
    }
    
    createAxisWalls() {
        this.wallHelpers.forEach(helper => this.scene.remove(helper));
        this.wallHelpers = [];
        
        const gridYZ = new THREE.GridHelper(100, 10, this.options.gridColor, this.options.gridColor);
        gridYZ.rotation.z = Math.PI / 2;
        gridYZ.visible = false;
        gridYZ.userData = { isWall: true, axis: 'x' };
        this.wallHelpers.push(gridYZ);
        this.scene.add(gridYZ);
        
        const gridXZ = new THREE.GridHelper(100, 10, this.options.gridColor, this.options.gridColor);
        gridXZ.visible = false;
        gridXZ.userData = { isWall: true, axis: 'y' };
        this.wallHelpers.push(gridXZ);
        this.scene.add(gridXZ);
        
        const gridXY = new THREE.GridHelper(100, 10, this.options.gridColor, this.options.gridColor);
        gridXY.rotation.x = Math.PI / 2;
        gridXY.visible = false;
        gridXY.userData = { isWall: true, axis: 'z' };
        this.wallHelpers.push(gridXY);
        this.scene.add(gridXY);
    }
    
    toggleWallOpacity() {
        this.wallsOpaque = !this.wallsOpaque;
        
        if (this.wallsOpaque) {
            this.wallHelpers.forEach(helper => helper.visible = false);
            
            if (!this.opaqueWalls) {
                const wallMaterial = new THREE.MeshBasicMaterial({
                    color: 0x404040,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                
                const wallYZ = new THREE.PlaneGeometry(100, 100);
                this.opaqueWallYZ = new THREE.Mesh(wallYZ, wallMaterial);
                this.opaqueWallYZ.rotation.y = Math.PI / 2;
                this.scene.add(this.opaqueWallYZ);
                
                const wallXZ = new THREE.PlaneGeometry(100, 100);
                this.opaqueWallXZ = new THREE.Mesh(wallXZ, wallMaterial);
                this.opaqueWallXZ.rotation.x = Math.PI / 2;
                this.scene.add(this.opaqueWallXZ);
                
                const wallXY = new THREE.PlaneGeometry(100, 100);
                this.opaqueWallXY = new THREE.Mesh(wallXY, wallMaterial);
                this.scene.add(this.opaqueWallXY);
                
                this.opaqueWalls = true;
            } else {
                this.opaqueWallYZ.visible = true;
                this.opaqueWallXZ.visible = true;
                this.opaqueWallXY.visible = true;
            }
        } else {
            this.wallHelpers.forEach(helper => {
                if (this.is3D) helper.visible = true;
            });
            
            if (this.opaqueWalls) {
                this.opaqueWallYZ.visible = false;
                this.opaqueWallXZ.visible = false;
                this.opaqueWallXY.visible = false;
            }
        }
    }
    
    createAxisLabels() {
    const createTextSprite = (text, position) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Apenas texto, sem fundo
        context.fillStyle = '#a0a0a0';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            depthTest: false,  // Não testa profundidade
            depthWrite: false  // Não escreve no depth buffer
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(15, 3.75, 1);
        sprite.renderOrder = -1; // Renderiza atrás
        
        return sprite;
    };
    
    this.xLabel = createTextSprite('Nº Contratos →', new THREE.Vector3(54.7, 0, 0));
    this.scene.add(this.xLabel);
    
    this.yLabel = createTextSprite('Valor Soller →', new THREE.Vector3(0, 52, 0));
    this.scene.add(this.yLabel);
    
    this.zLabel = createTextSprite('Dias desde Último →', new THREE.Vector3(0, 0, 55));
    this.zLabel.visible = false;
    this.scene.add(this.zLabel);
}
    
    createQuadrantLabels() {
    const quadrants2D = [
        { text: '⭐ Estrelas', x: 25, y: 25, id: 'estrelas' },
        { text: '🥇 Ouro', x: -25, y: 25, id: 'ouro' },
        { text: '🔄 Recorrentes', x: 25, y: -25, id: 'recorrentes' },
        { text: '🧭 Inexplorados', x: -25, y: -25, id: 'inexplorados' }
    ];
    
    const quadrants3D = [
        { text: '⭐✨ Estrelas Ativas', x: 25, y: 25, z: 20, id: 'estrelas-ativas' },
        { text: '🥇✨ Ouro Ativo', x: -25, y: 25, z: 20, id: 'ouro-ativo' },
        { text: '🔄✨ Recorrentes Ativos', x: 25, y: -25, z: 20, id: 'recorrentes-ativos' },
        { text: '🧭✨ Novos Potenciais', x: -25, y: -25, z: 20, id: 'novos-potenciais' },
        { text: '⭐⚠️ Estrelas em Risco', x: 25, y: 25, z: -20, id: 'estrelas-risco' },
        { text: '🥇⚠️ Ouro Dormindo', x: -25, y: 25, z: -20, id: 'ouro-dormindo' },
        { text: '🔄⚠️ Recorrentes em Churn', x: 25, y: -25, z: -20, id: 'recorrentes-churn' },
        { text: '🧭⚠️ Perdidos', x: -25, y: -25, z: -20, id: 'perdidos' }
    ];
    
    this.quadrantLabels2D = [];
    quadrants2D.forEach(q => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(160, 160, 160, 0.7)';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(q.text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.7,
            depthTest: false,  // Desabilita teste de profundidade
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(q.x, q.y, 0);
        sprite.scale.set(20, 5, 1);
        sprite.userData = { quadrantId: q.id, is3D: false };
        sprite.renderOrder = 1;
        
        this.quadrantLabels2D.push(sprite);
        this.quadrantSprites[q.id] = sprite;
        this.scene.add(sprite);
    });
    
    this.quadrantLabels3D = [];
    quadrants3D.forEach(q => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(220, 220, 220, 1)'; // Cor mais forte
        context.font = 'bold 18px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(q.text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 1,
            depthTest: false,  // IMPORTANTE: desabilita teste de profundidade
            depthWrite: false,
            blending: THREE.AdditiveBlending // Blending aditivo para garantir visibilidade
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(q.x, q.y, q.z);
        sprite.scale.set(18, 4.5, 1);
        sprite.visible = false;
        sprite.userData = { quadrantId: q.id, is3D: true };
        sprite.renderOrder = 200; // Muito alto para garantir que fique na frente
        
        this.quadrantLabels3D.push(sprite);
        this.quadrantSprites[q.id] = sprite;
        this.scene.add(sprite);
    });
}
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.minZoom = 0.5;
        this.controls.maxZoom = 5;
        
        this.controls3D = new THREE.OrbitControls(this.camera3D, this.renderer.domElement);
        this.controls3D.enableDamping = true;
        this.controls3D.dampingFactor = 0.05;
        this.controls3D.minDistance = 1;
        this.controls3D.maxDistance = 200;
        this.controls3D.enabled = false;
    }
    
    setupEventListeners() {
        this.renderer.domElement.addEventListener('mousemove', this._boundHandlers.onMouseMove);
        this.renderer.domElement.addEventListener('click', this._boundHandlers.onClick);
        
        window.addEventListener('resize', this._boundHandlers.onResize);
        window.addEventListener('keydown', this._boundHandlers.onKeyDown);
        
        const minimizeBtn = this.controlPanel.querySelector('.btn-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const content = this.controlPanel.querySelector('.panel-content');
                const headerText = this.controlPanel.querySelector('.panel-header h3');
                const fullscreenBtn = this.controlPanel.querySelector('.btn-fullscreen');

                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    minimizeBtn.textContent = '−';
                    headerText.textContent = 'Painel';
                    if (fullscreenBtn) fullscreenBtn.style.display = 'flex';

                    this.controlPanel.style.maxWidth = '320px';
                    this.controlPanel.style.height = 'auto';
                    this.controlPanel.style.background = 'whitesmoke';
                    this.controlPanel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; 
                    if (fullscreenBtn) fullscreenBtn.style.background = 'whitesmoke';
                    minimizeBtn.style.background = '#f3f4f6';

                } else {
                    content.style.display = 'none';
                    minimizeBtn.textContent = '+';
                    headerText.textContent = '';
                    if (fullscreenBtn) fullscreenBtn.style.display = 'none';

                    this.controlPanel.style.maxWidth = '60px'; 
                    this.controlPanel.style.height = '60px';
                    this.controlPanel.style.background = 'transparent';
                    this.controlPanel.style.boxShadow = 'none';
                    if (fullscreenBtn) fullscreenBtn.style.background = 'transparent';
                    minimizeBtn.style.background = 'transparent';
                }
            });
        }

        const novoCheckbox = document.getElementById('filter-novo-checkbox');
        if (novoCheckbox) {
            novoCheckbox.addEventListener('change', (e) => {
                this.applyFilter(this.currentFilter);
            });
        }
        
        const fullscreenBtn = this.controlPanel.querySelector('.btn-fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
            fullscreenBtn.addEventListener('mouseenter', () => {
                if (!this.isFullscreen) {
                    fullscreenBtn.style.background = 'whitesmoke';
                }
            });
            fullscreenBtn.addEventListener('mouseleave', () => {
                if (!this.isFullscreen) {
                    fullscreenBtn.style.background = 'whitesmoke';
                } else {
                    fullscreenBtn.style.background = 'whitesmoke';
                }
            });
        }
        
        const exclusiveCheckbox = document.getElementById('exclusive-filters');
        if (exclusiveCheckbox) {
            exclusiveCheckbox.addEventListener('change', (e) => {
                this.exclusiveFilters = e.target.checked;
                if (this.currentFilter === 'with_agency' || this.currentFilter === 'without_agency') {
                    this.applyFilter(this.currentFilter);
                }
            });
        }
        
        const filterBtns = this.controlPanel.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.exclusiveFilters && (e.target.dataset.filter === 'with_agency' || e.target.dataset.filter === 'without_agency')) {
                    filterBtns.forEach(b => {
                        if (b.dataset.filter === 'all' || (b !== e.target && (b.dataset.filter === 'with_agency' || b.dataset.filter === 'without_agency'))) {
                            b.classList.remove('active');
                            b.style.background = 'white';
                            b.style.color = '#666';
                        }
                    });
                    e.target.classList.add('active');
                    e.target.style.background = '#6A0DAD';
                    e.target.style.color = 'white';
                } else {
                    filterBtns.forEach(b => {
                        b.classList.remove('active');
                        b.style.background = 'white';
                        b.style.color = '#666';
                    });
                    e.target.classList.add('active');
                    e.target.style.background = '#6A0DAD';
                    e.target.style.color = 'white';
                }
                
                this.applyFilter(e.target.dataset.filter);
            });
        });
    }
    
    processLongData(longData) {
        if (!Array.isArray(longData) || longData.length === 0) return [];

        const referenceDate = new Date('2025-07-31');
        const empresas = new Map();

        const last12_start = new Date('2024-08-01');
        const last12_end = new Date('2025-07-31');

        const semester1Start = new Date('2024-07-01');
        const semester1End = new Date('2024-12-31');
        const semester2Start = new Date('2025-01-01');
        const semester2End = new Date('2025-06-30');

        longData.forEach(row => {
            const marca = row.Marca;
            if (!marca) return;

            if (!empresas.has(marca)) {
                empresas.set(marca, {
                    empresa: marca,
                    total_value: 0,
                    total_contracts: 0,
                    contracts_with_agency: 0,
                    contracts_without_agency: 0,
                    contracts_with_agency_last_12m: 0,
                    contracts_without_agency_last_12m: 0,
                    monthly_lucro: {},
                    monthly_contracts: {},
                    last_contract_date: null
                });
            }

            const ent = empresas.get(marca);
            const valorNum = (row.valor_num === null || row.valor_num === undefined || isNaN(row.valor_num))
                ? 0
                : Number(row.valor_num);

            const monthIndex = this.getMonthNumber(row.mes_norm);
            const year = Number(row.ano);
            const rowDate = new Date(year, monthIndex, 1);

            if (row.metric === 'lucro_bruto') {
                ent.total_value += valorNum;
                const key = `${year}-${monthIndex}`;
                ent.monthly_lucro[key] = (ent.monthly_lucro[key] || 0) + valorNum;
            }

            if (row.metric === 'num_contratos') {
                ent.total_contracts += valorNum;
                
                const key = `${year}-${monthIndex}`;
                ent.monthly_contracts[key] = (ent.monthly_contracts[key] || 0) + valorNum;

                if (String(row.agencia).toLowerCase() === 'sim') {
                    ent.contracts_with_agency += valorNum;
                } else {
                    ent.contracts_without_agency += valorNum;
                }

                if (valorNum > 0 && rowDate >= last12_start && rowDate <= last12_end) {
                    if (String(row.agencia).toLowerCase() === 'sim') {
                        ent.contracts_with_agency_last_12m += valorNum;
                    } else {
                        ent.contracts_without_agency_last_12m += valorNum;
                    }
                }

                if (valorNum > 0) {
                    if (!ent.last_contract_date || rowDate > ent.last_contract_date) {
                        ent.last_contract_date = rowDate;
                    }
                }
            }
        });

        const CONTRACTS_CUTOFF = 6;
        const VALUE_CUTOFF = 17100;
        const CHURN_CUTOFF = 90;

        const processed = Array.from(empresas.values()).map((e, idx) => {
            let daysSince = null;
            if (e.last_contract_date) {
                daysSince = Math.floor((referenceDate - e.last_contract_date) / (1000 * 60 * 60 * 24));
                if (daysSince < 0) daysSince = 0;
            }

            let semester1Value = 0, semester2Value = 0;
            Object.entries(e.monthly_lucro).forEach(([k, v]) => {
                const [y, m] = k.split('-').map(Number);
                const dt = new Date(y, m, 1);
                
                if (dt >= semester1Start && dt <= semester1End) {
                    semester1Value += v;
                } else if (dt >= semester2Start && dt <= semester2End) {
                    semester2Value += v;
                }
            });

            let semester1Contracts = 0, semester2Contracts = 0;
            Object.entries(e.monthly_contracts).forEach(([k, v]) => {
                const [y, m] = k.split('-').map(Number);
                const dt = new Date(y, m, 1);
                
                if (dt >= semester1Start && dt <= semester1End) {
                    semester1Contracts += v;
                } else if (dt >= semester2Start && dt <= semester2End) {
                    semester2Contracts += v;
                }
            });

            let semesterGrowth = 0;
            let yoy_is_new = false;

            if (semester1Value > 0) {
                semesterGrowth = (semester2Value - semester1Value) / semester1Value;
            } else if (semester2Value > 0) {
                semesterGrowth = 2.0;
                yoy_is_new = true;
            } else {
                semesterGrowth = 0;
            }

            const contractsSoS = semester2Contracts - semester1Contracts;

            let status = 'Ativo';
            let statusColor = '#228B22';
            if (daysSince === null) {
                status = 'Sem dados';
                statusColor = '#808080';
            } else if (daysSince <= 30) {
                status = 'Ativo';
                statusColor = '#228B22';
            } else if (daysSince <= 90) {
                status = 'Atenção';
                statusColor = '#ffc800';
            } else if (daysSince <= 180) {
                status = 'Churn';
                statusColor = '#c80000';
            } else if (daysSince <= 300) {
                status = 'Inativo';
                statusColor = '#960000';
            } else {
                status = 'Perdido';
                statusColor = '#000000';
            }

            const isHighContracts = (e.total_contracts || 0) >= CONTRACTS_CUTOFF;
            const isHighValue = (e.total_value || 0) >= VALUE_CUTOFF;
            let quadrant = 'Inexplorados';
            if (isHighContracts && isHighValue) quadrant = 'Estrelas';
            else if (!isHighContracts && isHighValue) quadrant = 'Ouro';
            else if (isHighContracts && !isHighValue) quadrant = 'Recorrentes';

            let quadrant3D = quadrant;
            if (daysSince !== null) {
                if (daysSince < CHURN_CUTOFF) {
                    quadrant3D = {
                        'Estrelas': 'estrelas-ativas',
                        'Ouro': 'ouro-ativo',
                        'Recorrentes': 'recorrentes-ativos',
                        'Inexplorados': 'novos-potenciais'
                    }[quadrant] || quadrant;
                } else {
                    quadrant3D = {
                        'Estrelas': 'estrelas-risco',
                        'Ouro': 'ouro-dormindo',
                        'Recorrentes': 'recorrentes-churn',
                        'Inexplorados': 'perdidos'
                    }[quadrant] || quadrant;
                }
            }

            return {
                id: idx,
                empresa: e.empresa,
                total_value: Math.round((e.total_value || 0) * 100) / 100,
                total_contracts: Math.round(e.total_contracts || 0),
                last_contract_date: e.last_contract_date ? e.last_contract_date.toISOString().split('T')[0] : null,
                days_since: daysSince,
                quadrant,
                quadrant3D,
                yoy_growth: semesterGrowth,
                yoy_is_new,
                contracts_sos: contractsSoS,
                status: status,
                status_color: statusColor,
                contracts_with_agency_last_12m: Math.round(e.contracts_with_agency_last_12m || 0),
                contracts_without_agency_last_12m: Math.round(e.contracts_without_agency_last_12m || 0),
                contracts_with_agency: Math.round(e.contracts_with_agency || 0),
                contracts_without_agency: Math.round(e.contracts_without_agency || 0),
                churn: daysSince !== null && daysSince > CHURN_CUTOFF,
                x: Math.round(e.total_contracts || 0),
                y: Math.round(e.total_value || 0),
                z: daysSince !== null ? daysSince : 0
            };
        })
        .filter(c => (c.total_contracts > 0) || (c.total_value > 0));

        console.log(`processLongData: processados ${processed.length} clientes.`);
        return processed;
    }
    
    getMonthNumber(monthName) {
        const months = {
            'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4,
            'mai': 5, 'jun': 6, 'jul': 7, 'ago': 8,
            'set': 9, 'out': 10, 'nov': 11, 'dez': 12
        };
        return months[monthName.toLowerCase()] || 1;
    }
    
    loadData(data) {
        if (Array.isArray(data) && data.length > 0 && data[0].Marca) {
            this.processedData = this.processLongData(data);
        } else if (data.data) {
            this.processedData = data.data;
        } else {
            this.processedData = data;
        }
        
        this.filteredData = [...this.processedData];
        this.createVisualization();
        this.updateStats();
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    createVisualization() {
        while (this.pointsGroup.children.length > 0) {
            const child = this.pointsGroup.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
            this.pointsGroup.remove(child);
        }
        this.borderMeshes = [];
        
        if (this.filteredData.length === 0) return;
        
        const CONTRACTS_CUTOFF = 6;
        const VALUE_CUTOFF = 17100;
        const CHURN_CUTOFF = 90;
        
        const MIN_CONTRACTS = 0;
        const MIN_VALUE = 250;
        const MAX_VALUE_EXPECTED = 308250;
        const MAX_CONTRACTS_EXPECTED = 50;
        const MIN_DAYS = 0;
        const MAX_DAYS = 363;
        
        const maxContracts = Math.max(MAX_CONTRACTS_EXPECTED, ...this.filteredData.map(c => c.total_contracts || 0));
        const maxValue = Math.max(MAX_VALUE_EXPECTED, ...this.filteredData.map(c => c.total_value || 0));
        
        console.log('Distribuição Config:', {
            contracts: { min: MIN_CONTRACTS, cutoff: CONTRACTS_CUTOFF, max: maxContracts },
            value: { min: MIN_VALUE, cutoff: VALUE_CUTOFF, max: maxValue },
            days: { min: MIN_DAYS, cutoff: CHURN_CUTOFF, max: MAX_DAYS },
            total_points: this.filteredData.length
        });
        
        const vertexShader = `
            attribute float size;
            attribute vec3 customColor;
            attribute float borderIntensity;
            attribute float borderType;
            varying vec3 vColor;
            varying float vBorderIntensity;
            varying float vBorderType;
            
            void main() {
                vColor = customColor;
                vBorderIntensity = borderIntensity;
                vBorderType = borderType;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const fragmentShader = `
            uniform float opacity;
            varying vec3 vColor;
            varying float vBorderIntensity;
            varying float vBorderType;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                
                if (dist > 0.5) discard;
                
                float centerRadius = 0.4;
                float borderWidth = 0.1;
                
                vec3 finalColor = vColor;
                float finalAlpha = opacity;
                
                if (vBorderIntensity > 0.0 && dist > centerRadius) {
                    vec3 borderColor;
                    if (vBorderType > 0.5) {
                        borderColor = vec3(0.415, 0.051, 0.678);
                    } else {
                        borderColor = vec3(1.0, 0.30, 0.0);
                    }
                    finalColor = mix(finalColor, borderColor, vBorderIntensity);
                    finalAlpha = mix(opacity, 1.0, vBorderIntensity * 0.8);
                }
                
                float alpha = 1.0 - smoothstep(0.48, 0.5, dist);
                gl_FragColor = vec4(finalColor, alpha * finalAlpha);
            }
        `;
        
        const positions = [];
        const colors = [];
        const sizes = [];
        const borderIntensities = [];
        const borderTypes = [];
        
        let dataToVisualize = this.filteredData;
        
        if (this.activeQuadrantFilters.size > 0) {
            dataToVisualize = dataToVisualize.filter(client => {
                const quadrantKey = this.is3D ? client.quadrant3D : client.quadrant.toLowerCase().replace(' ', '-');
                return this.activeQuadrantFilters.has(quadrantKey);
            });
        }
        
        if (this.activeColorFilters.size > 0) {
            dataToVisualize = dataToVisualize.filter(client => {
                for (let filter of this.activeColorFilters) {
                    if (this.colorFilterMap[filter] && this.colorFilterMap[filter](client)) {
                        return true;
                    }
                }
                return false;
            });
        }
        
        dataToVisualize.forEach(client => {
            const contracts = client.total_contracts || 0;
            let x = 0;
            
            if (contracts === 0) {
                return;
            } else if (contracts === 1) {
                x = -45;
            } else if (contracts < CONTRACTS_CUTOFF) {
                const ratio = (contracts - 1) / (CONTRACTS_CUTOFF - 1);
                const t = Math.pow(ratio, 0.8);
                x = -45 + (t * 40);
            } else {
                const excess = contracts - CONTRACTS_CUTOFF;
                const maxExcess = maxContracts - CONTRACTS_CUTOFF;
                
                if (maxExcess > 0) {
                    const ratio = Math.min(1, excess / maxExcess);
                    const t = ratio > 0 ? Math.sqrt(ratio) : 0;
                    x = 5 + (t * 40);
                } else {
                    x = 5;
                }
            }
            
            const value = client.total_value || 0;
            let y = 0;
            
            if (value === 0) {
                y = -47;
            } else if (value < MIN_VALUE) {
                y = -45;
            } else if (value < VALUE_CUTOFF) {
                const ratio = (value - MIN_VALUE) / (VALUE_CUTOFF - MIN_VALUE);
                const t = Math.pow(Math.max(0, ratio), 0.6);
                y = -45 + (t * 40);
            } else {
                const excess = value - VALUE_CUTOFF;
                const maxExcess = maxValue - VALUE_CUTOFF;
                
                if (maxExcess > 0) {
                    const ratio = Math.min(1, excess / maxExcess);
                    const t = Math.pow(ratio, 0.5);
                    y = 5 + (t * 40);
                } else {
                    y = 25;
                }
            }
            
            let z = 0;
            if (this.is3D) {
                z = this.calculateZPosition(client.days_since);
            }
            
            x = Math.max(-48, Math.min(48, x));
            y = Math.max(-48, Math.min(48, y));
            z = Math.max(-48, Math.min(48, z));
            
            positions.push(x, y, z);
            
            const color = this.getColorForDays(client.days_since);
            colors.push(color.r, color.g, color.b);
            
            sizes.push(this.options.pointSize);
            
            const yoyGrowth = client.yoy_growth || 0;
            if (yoyGrowth > 0) {
                borderIntensities.push(Math.min(1, yoyGrowth * 2));
                borderTypes.push(1);
            } else if (yoyGrowth < 0) {
                borderIntensities.push(Math.min(1, Math.abs(yoyGrowth) * 2));
                borderTypes.push(0);
            } else {
                borderIntensities.push(0);
                borderTypes.push(0);
            }
        });
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('borderIntensity', new THREE.Float32BufferAttribute(borderIntensities, 1));
        geometry.setAttribute('borderType', new THREE.Float32BufferAttribute(borderTypes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                opacity: { value: 1.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: true,
            depthWrite: true
        });
        
        this.pointsMesh = new THREE.Points(geometry, material);
        this.pointsMesh.renderOrder = 50;
        this.pointsGroup.add(this.pointsMesh);
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.is3D ? this.camera3D : this.camera);
        }
        
        console.log(`Visualização criada: ${positions.length / 3} pontos renderizados`);
    }
    
    getColorForDays(daysSince) {
        if (daysSince === null || daysSince === undefined) {
            return new THREE.Color(0x808080);
        }
        
        if (daysSince <= 30) {
            return new THREE.Color(this.recencyColors[0]);
        } else if (daysSince <= 90) {
            return new THREE.Color(this.recencyColors[90]);
        } else if (daysSince <= 180) {
            return new THREE.Color(this.recencyColors[180]);
        } else if (daysSince <= 300) {
            return new THREE.Color(this.recencyColors[300]);
        } else {
            return new THREE.Color(this.recencyColors[365]);
        }
    }
    
    createControlPanel() {
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'scatter-control-panel';
        this.controlPanel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: transparent;
            border-radius: 12px;
            padding: 16px;
            box-shadow: none;
            max-width: 60px;
            min-width: 200px;
            height: 60px;
            z-index: 1000;
        `;
        
        this.controlPanel.innerHTML = `
            <div class="panel-header" style="margin-bottom: 8px; position: relative;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;"></h3>
                <div style="position: absolute; top: 0; right: 0; display: flex; gap: 4px;">
                    <button class="btn-fullscreen" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        background: whitesmoke;
                        color: black;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        line-height: 1;
                        padding: 0;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                    " title="Expandir Visualização">⛶</button>
                    <button class="btn-minimize" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        background: transparent;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        line-height: 1;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " title="Expandir">+</button>
                </div>
            </div>
            
            <div class="panel-content" style="display: none;">
                <div class="filters-section" style="margin-bottom: 8px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666; display: flex; align-items: center; justify-content: space-between;">
                        Filtros
                        <div style="display:flex; gap: 12px; align-items: center;">
                            <label style="font-size:12px;font-weight:normal;display:flex;align-items:center;gap:4px;" title="Mostra empresas que são 'Novo' (sem semestre anterior)">
                                <input type="checkbox" id="filter-novo-checkbox" style="margin:0;">
                                Novo
                            </label>
                            <label style="font-size: 12px; font-weight: normal; display: flex; align-items: center; gap: 4px;" title="Mostra empresas que tiveram APENAS contratos com agência ou APENAS sem agência">
                                <input type="checkbox" id="exclusive-filters" style="margin: 0;">
                                Apenas
                            </label>
                        </div>
                    </h4>
                    <div class="filter-buttons" style="display: flex; gap: 8px;">
                        <button class="filter-btn active" data-filter="all" style="
                            flex: 1;
                            padding: 8px;
                            border: 1px solid #ddd;
                            background: #6A0DAD;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 13px;
                            transition: all 0.2s;
                        ">Todos</button>
                        <button class="filter-btn" data-filter="with_agency" style="
                            flex: 1;
                            padding: 8px;
                            border: 1px solid #ddd;
                            background: white;
                            color: #666;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 13px;
                            transition: all 0.2s;
                        ">Com Agência</button>
                        <button class="filter-btn" data-filter="without_agency" style="
                            flex: 1;
                            padding: 8px;
                            border: 1px solid #ddd;
                            background: white;
                            color: #666;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 13px;
                            transition: all 0.2s;
                        ">Sem Agência</button>
                    </div>
                </div>
                
                <div class="legend-section" style="margin-bottom: 10px;">
                    <h4 style="margin: 0 0 -5px 0; font-size: 14px; color: #666;">Cores e bordas</h4>
                    <div style="font-size: 12px; line-height: 1.8;">
                        <div class="legend-item clickable-legend" data-color-filter="ativo" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: #228B22; border-radius: 50%; margin-right: 8px;"></span>Ativo (≤ 30 dias)
                        </div>
                        <div class="legend-item clickable-legend" data-color-filter="atenção" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: #ffc800; border-radius: 50%; margin-right: 8px;"></span>Atenção (30-90 dias)
                        </div>
                        <div class="legend-item clickable-legend" data-color-filter="churn" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: #c80000; border-radius: 50%; margin-right: 8px;"></span>Churn (90-180 dias)
                        </div>
                        <div class="legend-item clickable-legend" data-color-filter="perdido" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: #960000; border-radius: 50%; margin-right: 8px;"></span>Inativo (180-300 dias)
                        </div>
                        <div class="legend-item clickable-legend" data-color-filter="inativo" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: #000000; border-radius: 50%; margin-right: 8px;"></span>Perdido (> 300 dias)
                        </div>
                        <div style="
                            border-bottom: 1px solid #ccc;
                            margin: 2px 15px;
                        "></div>
                        <div class="legend-item clickable-legend" data-color-filter="crescimento-yoy" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: white; border: 2px solid #6A0DAD; border-radius: 50%; margin-right: 8px;"></span>Crescimento SoS
                        </div>
                        <div class="legend-item clickable-legend" data-color-filter="decrescimento-yoy" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: white; border: 2px solid #ff4d00ff; border-radius: 50%; margin-right: 8px;"></span>Decrescimento SoS
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4 style="margin: -3px 0 6px 0; font-size: 14px; color: #666;">Quadrantes</h4>
                    <div style="font-size: 11px; line-height: 1.6; color: #666;">
                        <div class="quadrants-2d">
                            <div class="quadrant-info clickable-quadrant" data-quadrant="estrelas" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;">
                                ⭐ <strong>Estrelas</strong> - Alto valor + Alta recorrência
                            </div>
                            <div class="quadrant-info clickable-quadrant" data-quadrant="ouro" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s; margin-top: 5px;">
                                🥇 <strong>Ouro</strong> - Alto valor + Baixa recorrência
                            </div>
                            <div class="quadrant-info clickable-quadrant" data-quadrant="recorrentes" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s; margin-top: 5px;">
                                🔄 <strong>Recorrentes</strong> - Baixo valor + Alta recorrência
                            </div>
                            <div class="quadrant-info clickable-quadrant" data-quadrant="inexplorados" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background 0.2s; margin-top: 5px;">
                                🧭 <strong>Inexplorados</strong> - Baixo valor + Baixa recorrência
                            </div>
                        </div>
                        <div class="quadrants-3d" style="display: none; margin-top: 5px;">
                            
                            <div style="margin-top: 8px;">
                                <strong>⭐ Estrelas</strong>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="estrelas-ativas" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ✨ Ativas - Compras recentes
                                </div>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="estrelas-risco" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ⚠️ Em Risco - Sem compras recentes
                                </div>
                            </div>
                            
                            <div style="margin-top: 8px;">
                                <strong>🥇 Ouro</strong>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="ouro-ativo" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ✨ Ativo - Alto valor recente
                                </div>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="ouro-dormindo" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ⚠️ Dormindo - Alto valor inativo
                                </div>
                            </div>
                            
                            <div style="margin-top: 8px;">
                                <strong>🔄 Recorrentes</strong>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="recorrentes-ativos" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ✨ Ativos - Compras frequentes
                                </div>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="recorrentes-churn" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ⚠️ Em Churn - Pararam de comprar
                                </div>
                            </div>
                            
                            <div style="margin-top: 8px;">
                                <strong>🧭 Inexplorados</strong>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="novos-potenciais" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ✨ Com Potencial - Recém chegados
                                </div>
                                <div class="quadrant-info clickable-quadrant" data-quadrant="perdidos" style="cursor: pointer; padding: 2px 4px 2px 20px; border-radius: 4px; transition: background 0.2s; margin-top: 4px;">
                                    ⚠️ Perdidos - Sem engajamento
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.controlPanel);
        
        setTimeout(() => {
            const colorLegends = this.controlPanel.querySelectorAll('.clickable-legend');
            colorLegends.forEach(legend => {
                legend.addEventListener('click', (e) => {
                    const filter = e.currentTarget.dataset.colorFilter;
                    this.toggleColorFilter(filter);
                    
                    if (this.activeColorFilters.has(filter)) {
                        e.currentTarget.style.background = '#e0e7ff';
                    } else {
                        e.currentTarget.style.background = 'transparent';
                    }
                });
            });
            
            const quadrantInfos = this.controlPanel.querySelectorAll('.clickable-quadrant');
            quadrantInfos.forEach(info => {
                info.addEventListener('click', (e) => {
                    const quadrantId = e.currentTarget.dataset.quadrant;
                    this.toggleQuadrantFilter(quadrantId);
                    
                    if (this.activeQuadrantFilters.has(quadrantId)) {
                        e.currentTarget.style.background = '#e0e7ff';
                    } else {
                        e.currentTarget.style.background = 'transparent';
                    }
                });
            });
        }, 100);
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'scatter-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 8px;
            padding: 12px;
            pointer-events: none;
            display: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-size: 13px;
            max-width: 320px;
            z-index: 10000;
        `;
        this.container.appendChild(this.tooltip);
    }
    
    createStatsDisplay() {
        this.statsDisplay = document.createElement('div');
        this.statsDisplay.className = 'scatter-stats';
        this.statsDisplay.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: transparent;
            backdrop-filter: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 13px;
            color: white;
            max-width: 214px;
            z-index: 999;
        `;
        this.container.appendChild(this.statsDisplay);
    }
    
    updateStats() {
        let dataToCount;
        if (this.selectedIds.size > 0) {
            dataToCount = (this.processedData || []).filter(c => this.selectedIds.has(c.id));
        } else {
            dataToCount = this.filteredData || [];

            if (this.activeQuadrantFilters && this.activeQuadrantFilters.size > 0) {
                dataToCount = dataToCount.filter(client => {
                    const quadrantKey = this.is3D ? client.quadrant3D : (client.quadrant || '').toLowerCase().replace(' ', '-');
                    return this.activeQuadrantFilters.has(quadrantKey);
                });
            }

            if (this.activeColorFilters && this.activeColorFilters.size > 0) {
                dataToCount = dataToCount.filter(client => {
                    for (let filter of this.activeColorFilters) {
                        if (
                            this.colorFilterMap &&
                            this.colorFilterMap[filter] &&
                            this.colorFilterMap[filter](client)
                        ) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }

        const total = dataToCount.length;
        const churn = dataToCount.filter(c => c.churn).length;

        const formatCurrencyNoDecimals = (v) => {
            if (v === null || v === undefined || isNaN(v)) return 'R$ 0';
            return `R$ ${Math.round(Number(v)).toLocaleString('pt-BR')}`;
        };
        const formatNumber = (n) => {
            if (n === null || n === undefined || isNaN(n)) return '0';
            return Number(n).toLocaleString('pt-BR');
        };

        let sumValue = dataToCount.reduce(
            (acc, c) => acc + (Number(c.total_value || 0)),
            0
        );
        let sumContracts = dataToCount.reduce(
            (acc, c) => acc + (Number(c.total_contracts || 0)),
            0
        );

        const ticket = sumContracts > 0 ? Math.round(sumValue / sumContracts) : 0;

        const churnHtml =
            churn > 0
                ? `<span style="color: white;"><strong>${churn}</strong> em risco</span>`
                : '';

        this.statsDisplay.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 8px;
            ">
                <span style="color: white;"><strong>${formatCurrencyNoDecimals(sumValue)}</strong> valor Soller</span>
                <span style="color: white;"><strong>${formatNumber(sumContracts)}</strong> contratos</span>
                <span style="color: white;"><strong>${formatCurrencyNoDecimals(ticket)}</strong> ticket médio</span>
                <span style="color: white;"><strong>${total}</strong> marcas</span>
                ${churnHtml}
            </div>
        `;

        this.updateSelectedCompaniesDisplay();
    }

    createSelectedCompaniesDisplay() {
        this.selectedCompaniesDisplay = document.createElement('div');
        this.selectedCompaniesDisplay.className = 'selected-companies-display';
        this.selectedCompaniesDisplay.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 15px;
            background: transparent;
            border-radius: 12px;
            box-shadow: none;
            width: 40px;
            height: 40px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            overflow: hidden;
            transition: all 0.3s ease;
        `;

        this.selectedCompaniesDisplay.innerHTML = `
            <button class="btn-minimize-companies" style="
                position: absolute;
                top: 12px;
                left: 18.4px;
                width: 24px;
                height: 24px;
                border: none;
                background: transparent;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                z-index: 10;
            " title="Expandir">+</button>
            <div class="panel-content" style="
                display: none;
                color: white;
                padding: 14px;
                padding-top: 0px;
                max-height: 300px;
                overflow-y: auto;
                overflow-x: hidden;
                width: 100%;
                box-sizing: border-box;
                -ms-overflow-style: none;
                scrollbar-width: none;
            ">
            </div>
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            .panel-content::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(styleSheet);

        this.container.appendChild(this.selectedCompaniesDisplay);

        const minimizeBtn = this.selectedCompaniesDisplay.querySelector('.btn-minimize-companies');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const content = this.selectedCompaniesDisplay.querySelector('.panel-content');
                const isCollapsed = content.style.display === 'none';

                if (isCollapsed) {
                    content.style.display = 'block';
                    minimizeBtn.textContent = '−';
                    this.selectedCompaniesDisplay.style.width = 'auto';
                    this.selectedCompaniesDisplay.style.height = 'auto';
                    this.selectedCompaniesDisplay.style.padding = '14px';
                    this.selectedCompaniesDisplay.style.paddingTop = '35px';
                    this.selectedCompaniesDisplay.style.background = 'transparent';
                    this.selectedCompaniesDisplay.style.boxShadow = 'none';
                    this.selectedCompaniesDisplay.hasBeenManuallyExpanded = true;
                } else {
                    content.style.display = 'none';
                    minimizeBtn.textContent = '+';
                    this.selectedCompaniesDisplay.style.width = '40px';
                    this.selectedCompaniesDisplay.style.height = '40px';
                    this.selectedCompaniesDisplay.style.padding = '0';
                    this.selectedCompaniesDisplay.style.background = 'transparent';
                    this.selectedCompaniesDisplay.style.boxShadow = 'none';
                    this.selectedCompaniesDisplay.hasBeenManuallyExpanded = false; // <-- CORREÇÃO: Reseta o estado
                }
            });
        }
    }

    updateSelectedCompaniesDisplay() {
        const display = this.selectedCompaniesDisplay.querySelector('.panel-content');
        const minimizeBtn = this.selectedCompaniesDisplay.querySelector('.btn-minimize-companies');
        
        const visibleData = this.getVisibleData()
            .sort((a, b) => b.total_value - a.total_value)
            .slice(0, 5);

        const formatCurrency = (v) => {
            if (v === null || v === undefined || isNaN(v)) return '0';
            return Math.round(Number(v)).toLocaleString('pt-BR');
        };

        if (visibleData.length === 0) {
            this.selectedCompaniesDisplay.style.display = 'none';
            return;
        }

        this.selectedCompaniesDisplay.style.display = 'flex';

        display.innerHTML = `
            <div style="
                display: grid; 
                grid-template-columns: auto 1fr; 
                gap: 8px 20px;
                font-size: 13px; 
                color: white;
                line-height: 1.6;
            ">
                ${visibleData.map(c => `
                    <span style="font-weight: 600; cursor: pointer; white-space: nowrap;" class="company-item" data-id="${c.id}">${c.empresa}</span>
                    <span style="text-align: right; color: #aaa; white-space: nowrap;">R$ ${formatCurrency(c.total_value)}</span>
                `).join('')}
            </div>
        `;
        
        // Apenas ajusta a visibilidade se o usuário tiver expandido a lista manualmente
        if (this.selectedCompaniesDisplay.hasBeenManuallyExpanded) {
            minimizeBtn.textContent = '−';
            display.style.display = 'block';
            this.selectedCompaniesDisplay.style.width = 'auto';
            this.selectedCompaniesDisplay.style.height = 'auto';
            this.selectedCompaniesDisplay.style.padding = '14px';
            this.selectedCompaniesDisplay.style.paddingTop = '35px';
            this.selectedCompaniesDisplay.style.background = 'transparent';
            this.selectedCompaniesDisplay.style.boxShadow = 'none';
        } else {
            // Caso contrário, mantém a lista colapsada
            minimizeBtn.textContent = '+';
            display.style.display = 'none';
            this.selectedCompaniesDisplay.style.width = '40px';
            this.selectedCompaniesDisplay.style.height = '40px';
            this.selectedCompaniesDisplay.style.padding = '0';
            this.selectedCompaniesDisplay.style.background = 'transparent';
            this.selectedCompaniesDisplay.style.boxShadow = 'none';
        }

        if (!this.selectedCompaniesDisplay.hasEventListener) {
            display.addEventListener('click', (e) => {
                const companySpan = e.target.closest('.company-item');
                if (companySpan) {
                    const companyId = parseInt(companySpan.dataset.id);
                    if (!isNaN(companyId)) {
                        if (this.selectedIds.has(companyId)) {
                            this.selectedIds.delete(companyId);
                        } else {
                            this.selectedIds.add(companyId);
                        }
                        this.updateStats();
                    }
                }
            });
            
            const btn = this.selectedCompaniesDisplay.querySelector('.btn-minimize-companies');
            btn.addEventListener('click', () => {
                // A lógica de estado já está no clique, não precisamos dela aqui
            });
            
            this.selectedCompaniesDisplay.hasEventListener = true;
        }
    }
    getVisibleData() {
        if (this.selectedIds.size > 0) {
            return (this.processedData || []).filter(c => this.selectedIds.has(c.id));
        }

        let visibleData = this.filteredData || [];
        
        if (this.activeQuadrantFilters && this.activeQuadrantFilters.size > 0) {
            visibleData = visibleData.filter(client => {
                const quadrantKey = this.is3D ? client.quadrant3D : (client.quadrant || '').toLowerCase().replace(' ', '-');
                return this.activeQuadrantFilters.has(quadrantKey);
            });
        }
        
        if (this.activeColorFilters && this.activeColorFilters.size > 0) {
            visibleData = visibleData.filter(client => {
                for (let filter of this.activeColorFilters) {
                    if (this.colorFilterMap[filter] && this.colorFilterMap[filter](client)) {
                        return true;
                    }
                }
                return false;
            });
        }

        return visibleData;
    }
    
    toggleColorFilter(filter) {
    // Limpa seleção manual ao aplicar filtro de cor
    this.selectedIds.clear();
    
    if (this.activeColorFilters.has(filter)) {
        this.activeColorFilters.delete(filter);
    } else {
        this.activeColorFilters.add(filter);
    }
    
    this.updateColorFilterStatus();
    this.createVisualization();
    this.updateStats();
}

toggleQuadrantFilter(quadrantId) {
    // Limpa seleção manual ao aplicar filtro de quadrante
    this.selectedIds.clear();
    
    if (this.activeQuadrantFilters.has(quadrantId)) {
        this.activeQuadrantFilters.delete(quadrantId);
        if (this.quadrantSprites[quadrantId]) {
            this.quadrantSprites[quadrantId].material.opacity = this.is3D ? 0.8 : 0.7;
        }
    } else {
        this.activeQuadrantFilters.add(quadrantId);
        if (this.quadrantSprites[quadrantId]) {
            this.quadrantSprites[quadrantId].material.opacity = 1.0;
        }
    }
    
    this.updateQuadrantFilterStatus();
    this.createVisualization();
    this.updateStats();
}
    
    toggleQuadrantFilter(quadrantId) {
        if (this.activeQuadrantFilters.has(quadrantId)) {
            this.activeQuadrantFilters.delete(quadrantId);
            if (this.quadrantSprites[quadrantId]) {
                this.quadrantSprites[quadrantId].material.opacity = this.is3D ? 0.8 : 0.7;
            }
        } else {
            this.activeQuadrantFilters.add(quadrantId);
            if (this.quadrantSprites[quadrantId]) {
                this.quadrantSprites[quadrantId].material.opacity = 1.0;
            }
        }
        
        this.updateQuadrantFilterStatus();
        this.createVisualization();
        this.updateStats();
    }
    
    updateColorFilterStatus() {
        const statusDiv = document.getElementById('color-filter-status');
        if (!statusDiv) return;
        
        if (this.activeColorFilters.size === 0) {
            statusDiv.innerHTML = '';
        } else {
            const filters = Array.from(this.activeColorFilters).join(', ');
            statusDiv.innerHTML = `Filtros ativos: ${filters} <button onclick="window.clientScatter.clearColorFilters()" style="margin-left: 8px; padding: 2px 6px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 10px;">Limpar</button>`;
        }
    }
    
    updateQuadrantFilterStatus() {
        const statusDiv = document.getElementById('quadrant-filter-status');
        if (!statusDiv) return;
        
        if (this.activeQuadrantFilters.size === 0) {
            statusDiv.innerHTML = '';
        } else {
            const filters = Array.from(this.activeQuadrantFilters).join(', ');
            statusDiv.innerHTML = `Filtros ativos: ${filters} <button onclick="window.clientScatter.clearQuadrantFilters()" style="margin-left: 8px; padding: 2px 6px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 10px;">Limpar</button>`;
        }
    }
    
    clearColorFilters() {
        this.activeColorFilters.clear();
        
        const legends = this.controlPanel.querySelectorAll('.clickable-legend');
        legends.forEach(legend => legend.style.background = 'transparent');
        
        this.updateColorFilterStatus();
        this.createVisualization();
        this.updateStats();
    }
    
    clearQuadrantFilters() {
        this.activeQuadrantFilters.clear();
        
        this.quadrantLabels2D.forEach(label => label.material.opacity = 0.7);
        this.quadrantLabels3D.forEach(label => label.material.opacity = 0.8);
        
        const quadrants = this.controlPanel.querySelectorAll('.clickable-quadrant');
        quadrants.forEach(q => q.style.background = 'transparent');
        
        this.updateQuadrantFilterStatus();
        this.createVisualization();
        this.updateStats();
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;

        this.clearAllFilters();

        if (!this.processedData.length) return;

        if (this.isFullscreen) {
            this._originalStyles = {
                position: this.container.style.position,
                top: this.container.style.top,
                left: this.container.style.left,
                width: this.container.style.width,
                height: this.container.style.height,
                zIndex: this.container.style.zIndex,
                margin: this.container.style.margin,
                padding: this.container.style.padding,
                borderRadius: this.container.style.borderRadius
            };

            this.container.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: #2d2d2d !important;
                margin: 0 !important;
                padding: 0 !important;
                border-radius: 0 !important;
            `;
            
            document.body.style.overflow = 'hidden';
            document.body.classList.add('fullscreen-active');
            
            if (this.wrapper) {
                this.wrapper.style.borderRadius = '0';
            }

            this.is3D = true;
            this.controls.enabled = false;
            this.controls3D.enabled = true;
            
            this.zAxis.visible = true;
            this.zLabel.visible = true;
            this.wallHelpers.forEach(helper => helper.visible = true);
            if (this.quadrantLabels2D) this.quadrantLabels2D.forEach(label => label.visible = false);
            if (this.quadrantLabels3D) this.quadrantLabels3D.forEach(label => label.visible = true);
            
            const quadrants2D = this.controlPanel.querySelector('.quadrants-2d');
            const quadrants3D = this.controlPanel.querySelector('.quadrants-3d');
            if (quadrants2D) quadrants2D.style.display = 'none';
            if (quadrants3D) quadrants3D.style.display = 'block';

            const btn = this.controlPanel.querySelector('.btn-fullscreen');
            if (btn) {
                btn.innerHTML = '✕';
                btn.style.background = '#dc2626';
                btn.style.fontSize = '13px';
                btn.title = 'Fechar Tela Cheia';
            }

        } else {
            if (this._originalStyles) {
                Object.keys(this._originalStyles).forEach(key => {
                    this.container.style[key] = this._originalStyles[key] || '';
                });
            }
            
            document.body.style.overflow = '';
            document.body.classList.remove('fullscreen-active');
            
            if (this.wrapper) {
                this.wrapper.style.borderRadius = '12px';
            }

            this.is3D = false;
            this.controls.enabled = true;
            this.controls3D.enabled = false;

            this.zAxis.visible = false;
            this.zLabel.visible = false;
            this.wallHelpers.forEach(helper => helper.visible = false);
            if (this.opaqueWalls) {
                this.opaqueWallYZ.visible = false;
                this.opaqueWallXZ.visible = false;
                this.opaqueWallXY.visible = false;
            }
            if (this.quadrantLabels2D) this.quadrantLabels2D.forEach(label => label.visible = true);
            if (this.quadrantLabels3D) this.quadrantLabels3D.forEach(label => label.visible = false);
            
            const quadrants2D = this.controlPanel.querySelector('.quadrants-2d');
            const quadrants3D = this.controlPanel.querySelector('.quadrants-3d');
            if (quadrants2D) quadrants2D.style.display = 'block';
            if (quadrants3D) quadrants3D.style.display = 'none';

            this.camera.position.set(0, 0, 100);
            this.camera.lookAt(0, 0, 0);

            const btn = this.controlPanel.querySelector('.btn-fullscreen');
            if (btn) {
                btn.innerHTML = '⛶';
                btn.style.background = 'whitesmoke';
                btn.title = 'Expandir Visualização';
            }
        }

        setTimeout(() => {
            this.onResize();
            this.createVisualization();
        }, 100);
    }
    
    clearAllFilters() {
        this.activeQuadrantFilters.clear();
        this.quadrantLabels2D.forEach(label => label.material.opacity = 0.7);
        this.quadrantLabels3D.forEach(label => label.material.opacity = 0.8);
        
        this.activeColorFilters.clear();
        
        this.currentFilter = 'all';
        this.filteredData = [...this.processedData];
        
        const exclusiveCheckbox = document.getElementById('exclusive-filters');
        if (exclusiveCheckbox) {
            exclusiveCheckbox.checked = false;
            this.exclusiveFilters = false;
        }
        
        const filterBtns = this.controlPanel.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'white';
            btn.style.color = '#666';
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
                btn.style.background = '#6A0DAD';
                btn.style.color = 'white';
            }
        });
        
        const quadrants = this.controlPanel.querySelectorAll('.clickable-quadrant');
        quadrants.forEach(q => q.style.background = 'transparent');
        
        const legends = this.controlPanel.querySelectorAll('.clickable-legend');
        legends.forEach(legend => legend.style.background = 'transparent');
        
        this.updateQuadrantFilterStatus();
        this.updateColorFilterStatus();
        this.updateStats();
    }
    
    onResize() {
        const width = this.canvasWrapper.offsetWidth || 800;
        const height = this.canvasWrapper.offsetHeight || 600;
        const aspect = width / height;
        
        const frustumSize = 120;
        this.camera.left = -frustumSize * aspect / 2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = -frustumSize / 2;
        this.camera.updateProjectionMatrix();
        
        this.camera3D.aspect = aspect;
        this.camera3D.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    onKeyDown(event) {
        if (event.key === 'Escape' && this.isFullscreen) {
            this.toggleFullscreen();
        }
    }
    
    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const camera = this.is3D ? this.camera3D : this.camera;
        this.raycaster.setFromCamera(this.mouse, camera);
        
        if (this.pointsMesh) {
            const intersects = this.raycaster.intersectObject(this.pointsMesh);
            
            if (intersects.length > 0) {
                const index = intersects[0].index;
                let dataToCheck = this.filteredData;
                
                if (this.activeQuadrantFilters.size > 0) {
                    dataToCheck = dataToCheck.filter(client => {
                        const quadrantKey = this.is3D ? client.quadrant3D : client.quadrant.toLowerCase().replace(' ', '-');
                        return this.activeQuadrantFilters.has(quadrantKey);
                    });
                }
                
                if (this.activeColorFilters.size > 0) {
                    dataToCheck = dataToCheck.filter(client => {
                        for (let filter of this.activeColorFilters) {
                            if (this.colorFilterMap[filter] && this.colorFilterMap[filter](client)) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
                
                const client = dataToCheck[index];
                
                if (client) {
                    this.showTooltip(client, event);
                } else {
                    this.hideTooltip();
                }
            } else {
                this.hideTooltip();
            }
        }
    }
    
    onClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const camera = this.is3D ? this.camera3D : this.camera;
        this.raycaster.setFromCamera(this.mouse, camera);
        
        if (this.is3D) {
            const wallBorders = this.scene.children.filter(obj => obj.userData.isWallBorder);
            const wallIntersects = this.raycaster.intersectObjects(wallBorders);
            
            if (wallIntersects.length > 0) {
                this.toggleWallOpacity();
                return;
            }
        }
        
        const labelGroups = this.is3D ? this.quadrantLabels3D : this.quadrantLabels2D;
        const labelIntersects = this.raycaster.intersectObjects(labelGroups);
        
        if (labelIntersects.length > 0) {
            const clickedLabel = labelIntersects[0].object;
            const quadrantId = clickedLabel.userData.quadrantId;
            
            if (quadrantId) {
                this.toggleQuadrantFilter(quadrantId);
            }
            return;
        }
        
        if (this.pointsMesh) {
            const intersects = this.raycaster.intersectObject(this.pointsMesh);
            
            if (intersects.length > 0) {
                const index = intersects[0].index;
                let dataToCheck = this.filteredData;
                
                if (this.activeQuadrantFilters.size > 0) {
                    dataToCheck = dataToCheck.filter(client => {
                        const quadrantKey = this.is3D ? client.quadrant3D : client.quadrant.toLowerCase().replace(' ', '-');
                        return this.activeQuadrantFilters.has(quadrantKey);
                    });
                }
                
                if (this.activeColorFilters.size > 0) {
                    dataToCheck = dataToCheck.filter(client => {
                        for (let filter of this.activeColorFilters) {
                            if (this.colorFilterMap[filter] && this.colorFilterMap[filter](client)) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
                
                const client = dataToCheck[index];
                
                if (client) {
                    if (this.selectedIds.has(client.id)) {
                        this.selectedIds.delete(client.id);
                    } else {
                        this.selectedIds.add(client.id);
                    }
                    this.updateStats();
                }
            }
        }
    }
    
    showTooltip(client, event) {
        if (!client || !this.tooltip) return;

        const formatCurrency = (v) => {
            if (v === null || v === undefined || isNaN(v)) return 'R$ 0,00';
            return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };
        
        const formatDate = (d) => {
            if (!d) return 'N/A';
            try {
                const dt = new Date(d);
                if (isNaN(dt)) return d;
                return dt.toLocaleDateString('pt-BR');
            } catch { return d; }
        };
        
        const formatPercent = (v) => {
            if (v === null || v === undefined || isNaN(v)) return '0%';
            const pct = Math.round(v * 1000) / 10;
            return `${v >= 0 ? '+' : ''}${pct}%`;
        };
        
        const formatContractsSoS = (v) => {
            if (v === null || v === undefined || isNaN(v)) return '0';
            const sign = v > 0 ? '+' : '';
            return `${sign}${v}`;
        };
        
        const getContractsSoSColor = (v) => {
            if (v > 0) return '#16a34a';
            if (v < 0) return '#dc2626';
            return '#000000';
        };

        const withAgency12 = client.contracts_with_agency_last_12m !== undefined
            ? client.contracts_with_agency_last_12m
            : (client.contracts_with_agency || 0);

        const withoutAgency12 = client.contracts_without_agency_last_12m !== undefined
            ? client.contracts_without_agency_last_12m
            : (client.contracts_without_agency || 0);

        const currentQuadrant = this.is3D ? (client.quadrant3D || client.quadrant) : (client.quadrant || client.quadrant3D);
        
        const status = client.status || 'Sem dados';
        const statusColor = client.status_color || '#808080';
        
        const getStatusBgColor = (color) => {
            switch(color) {
                case '#228B22': return '#e6f4ea';
                case '#ffc800': return '#fff3cd';
                case '#c80000': return '#fee2e2';
                case '#960000': return '#fdd4d4';
                case '#000000': return '#f0f0f0';
                default: return '#f5f5f5';
            }
        };

        this.tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:8px;font-size:14px;color:#222;">
                ${client.empresa || 'Empresa'}
            </div>
            <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:12px;color:#444;">
                <span style="color:#666;">Valor Soller:</span>
                <span style="font-weight:600;">${formatCurrency(client.total_value)}</span>
                
                <span style="color:#666;">Contratos:</span>
                <span style="font-weight:600;">${client.total_contracts || 0}</span>
                
                <span style="color:#666;">Último Contrato:</span>
                <span style="font-weight:600;">${formatDate(client.last_contract_date)}</span>
                
                <span style="color:#666;">Dias desde Último:</span>
                <span style="font-weight:600;color:${(client.days_since || 0) > 90 ? '#dc2626' : '#16a34a'}">
                    ${client.days_since !== null && client.days_since !== undefined ? client.days_since : 'N/A'}
                </span>
                
                <span style="color:#666;">Quadrante:</span>
                <span style="font-weight:600;">${currentQuadrant || 'N/A'}</span>
                
                <span style="color:#666;">Crescimento SoS:</span>
                <span style="font-weight:600;color:${(client.yoy_growth || 0) >= 0 ? '#16a34a' : '#dc2626'}">
                    ${client.yoy_is_new ? 'Novo' : formatPercent(client.yoy_growth)}
                </span>
                
                <span style="color:#666;">Contratos SoS:</span>
                <span style="font-weight:600;color:${getContractsSoSColor(client.contracts_sos || 0)}">
                    ${formatContractsSoS(client.contracts_sos || 0)}
                </span>
                
                <span style="color:#666;">Com agência (12m):</span>
                <span style="font-weight:600;">${withAgency12 || 0}</span>
                
                <span style="color:#666;">Sem agência (12m):</span>
                <span style="font-weight:600;">${withoutAgency12 || 0}</span>
            </div>
            
            <div style="
                margin-top:8px;
                padding:6px;
                background:${getStatusBgColor(statusColor)};
                border-radius:6px;
                text-align:center;
                font-weight:700;
                color:${statusColor};
                border: 2px solid ${statusColor}20;
            ">
                ${status}
            </div>
        `;

        const rect = this.container.getBoundingClientRect();
        const x = (event && event.clientX ? event.clientX - rect.left : rect.width / 2);
        const y = (event && event.clientY ? event.clientY - rect.top : rect.height / 2);

        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${x + 12}px`;
        this.tooltip.style.top = `${y + 12}px`;

        const tooltipRect = this.tooltip.getBoundingClientRect();
        const containerRect = rect;
        if (tooltipRect.right > containerRect.right) {
            this.tooltip.style.left = `${Math.max(8, x - tooltipRect.width - 12)}px`;
        }
        if (tooltipRect.bottom > containerRect.bottom) {
            this.tooltip.style.top = `${Math.max(8, y - tooltipRect.height - 12)}px`;
        }
    }
    
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
    }
    
    applyFilter(filterType) {
    this.currentFilter = filterType;
    
    // IMPORTANTE: Limpar seleção manual ao trocar filtros
    this.selectedIds.clear();

    switch (filterType) {
        case 'all':
            this.filteredData = [...this.processedData];
            break;
        case 'with_agency':
            if (this.exclusiveFilters) {
                this.filteredData = this.processedData.filter(c =>
                    c.contracts_with_agency_last_12m > 0 &&
                    c.contracts_without_agency_last_12m === 0
                );
            } else {
                this.filteredData = this.processedData.filter(c =>
                    (c.contracts_with_agency_last_12m || 0) > 0
                );
            }
            break;
        case 'without_agency':
            if (this.exclusiveFilters) {
                this.filteredData = this.processedData.filter(c =>
                    c.contracts_without_agency_last_12m > 0 &&
                    c.contracts_with_agency_last_12m === 0
                );
            } else {
                this.filteredData = this.processedData.filter(c =>
                    (c.contracts_without_agency_last_12m || 0) > 0
                );
            }
            break;
    }

    const novoCheckbox = document.getElementById('filter-novo-checkbox');
    if (novoCheckbox && novoCheckbox.checked) {
        const tempFiltered = this.filteredData.filter(client => !!client.yoy_is_new);
        this.filteredData = tempFiltered;
    }

    this.createVisualization();
    this.updateStats();
}
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.is3D && this.controls3D) {
            this.controls3D.update();
        } else if (this.controls) {
            this.controls.update();
        }
        
        const camera = this.is3D ? this.camera3D : this.camera;
        this.renderer.render(this.scene, camera);
    }
    
    destroy() {
        this.renderer.domElement.removeEventListener('mousemove', this._boundHandlers.onMouseMove);
        this.renderer.domElement.removeEventListener('click', this._boundHandlers.onClick);
        window.removeEventListener('resize', this._boundHandlers.onResize);
        window.removeEventListener('keydown', this._boundHandlers.onKeyDown);
        
        this.scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
        this.controls.dispose();
        this.controls3D.dispose();
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        
        this.container.innerHTML = '';
    }
}

window.ClientScatter3D = ClientScatter3D;

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('client-scatter');
    if (!container) {
        console.log('ClientScatter3D: Container não encontrado, aguardando...');
        return;
    }
    
    if (typeof THREE === 'undefined') {
        console.error('ClientScatter3D: Three.js não está carregado');
        return;
    }
    
    if (!THREE.OrbitControls) {
        console.error('ClientScatter3D: OrbitControls não está carregado');
        return;
    }
    
    console.log('Inicializando ClientScatter3D...');
    window.clientScatter = new ClientScatter3D('client-scatter');
    
    setTimeout(() => {
        if (window.clientScatter.renderer && window.clientScatter.scene && window.clientScatter.camera) {
            window.clientScatter.renderer.render(window.clientScatter.scene, window.clientScatter.camera);
        }
    }, 300);
    
    if (window.SollerData && window.SollerData.clientsLongData) {
        console.log('Carregando dados de window.SollerData.clientsLongData');
        window.clientScatter.loadData(window.SollerData.clientsLongData);
    } 
    else {
        console.log('Carregando dados do arquivo empresa_contratos_lucro_long.json');
        fetch('empresa_contratos_lucro_long.json')
            .then(response => response.json())
            .then(data => {
                window.clientScatter.loadData(data);
                console.log('Dados carregados com sucesso');
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
                fetch('data/empresa_contratos_lucro_long.json')
                    .then(response => response.json())
                    .then(data => {
                        window.clientScatter.loadData(data);
                        console.log('Dados carregados do caminho alternativo');
                    })
                    .catch(err => {
                        console.error('Erro ao carregar dados do caminho alternativo:', err);
                    });
            });
    }
});

window.reloadClientScatter = function(data) {
    if (window.clientScatter) {
        window.clientScatter.loadData(data);
        console.log('ClientScatter recarregado com novos dados');
    } else {
        console.error('ClientScatter não está inicializado');
    }
};