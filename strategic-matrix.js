// Strategic Matrix - Controlador principal e visualização 3D
class StrategicMatrix3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.spheres = {};
        this.connections = [];
        this.labels = [];
        this.isDragging = false;
        this.selectedObject = null;
        
        this.container = null;
        this.tooltip = null;
        
        this.animationId = null;
        this.isInitialized = false;
        
        // Filtros
        this.filters = {
            showIPO: false,
            selectedCountry: null,
            selectedCategory: null
        };
        
        // Armazenar unicórnios filtrados
        this.filteredUnicorns = {};
    }

    init(containerId = 'matrix3d-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Adicionar CSS para cursor drag
        const style = document.createElement('style');
        style.textContent = '.matrix-dragging { cursor: grabbing !important; }';
        document.head.appendChild(style);

        // Configurar cena
        this.setupScene();
        this.setupLights();
        this.setupGrid();
        this.createSpheres();
        this.setupEventListeners();
        this.setupSidebarToggle();
        this.setupFilters();
        
        // Criar tooltip
        this.createTooltip();
        
        // Sincronizar com engine
        this.setupEngineSync();
        
        // Iniciar animação
        this.animate();
        
        this.isInitialized = true;

        setTimeout(() => {
            this.onWindowResize();
            if (this.controls) this.controls.update();
        }, 100);
        
        // Atualizar posição inicial
        this.updateFromEngine();
    }

    setupFilters() {
        // Encontrar o elemento correto para os filtros
        const filterTarget = document.querySelector('.matrix-sidebar .matrix-info-card');
        if (!filterTarget) return;

        // Limpar filtros existentes, se houver
        const existingFilters = filterTarget.querySelector('.matrix-filters');
        if (existingFilters) existingFilters.remove();

        // Criar container de filtros posicionado corretamente
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'matrix-filters';
        filtersContainer.style.cssText = `
            position: absolute;
            left: 75px;
            top: 25px;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 10;
        `;
        
        // Adicionei os estilos para garantir o alinhamento
        const h4Title = filterTarget.querySelector('h4');
        if (h4Title) {
            h4Title.style.position = 'relative';
        }

        // Checkbox IPO
        const ipoContainer = document.createElement('div');
        ipoContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 3px 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        ipoContainer.innerHTML = `
            <input type="checkbox" id="ipoFilter" style="cursor: pointer; margin: 0;">
            <label for="ipoFilter" style="cursor: pointer; font-size: 11px; color: #fff; margin: 0;">IPO</label>
        `;
        ipoContainer.onmouseover = () => ipoContainer.style.background = 'rgba(255, 255, 255, 0.15)';
        ipoContainer.onmouseout = () => ipoContainer.style.background = 'rgba(255, 255, 255, 0.1)';
        filtersContainer.appendChild(ipoContainer);

        // Filtro de País  
        const countryFilter = document.createElement('div');
        countryFilter.className = 'country-filter';
        countryFilter.style.cssText = `
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 16px;
            min-width: 32px;
            text-align: center;
            transition: background 0.2s;
        `;
        countryFilter.innerHTML = '<span id="selectedCountryFlag">🌎</span>';
        countryFilter.onmouseover = () => countryFilter.style.background = 'rgba(255, 255, 255, 0.15)';
        countryFilter.onmouseout = () => countryFilter.style.background = 'rgba(255, 255, 255, 0.1)';
        
        const countryDropdown = document.createElement('div');
        countryDropdown.className = 'country-dropdown';
        countryDropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(20, 20, 30, 0.98);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 4px;
            padding: 6px;
            margin-top: 4px;
            display: none;
            z-index: 10000;
            min-width: 50px;
            max-height: 180px;
            overflow-y: auto;
        `;
        
        // Adicionar opção "Todos"
        const allOption = document.createElement('div');
        allOption.style.cssText = `
            padding: 3px 6px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 16px;
            text-align: center;
        `;
        allOption.innerHTML = '🌎';
        allOption.title = 'Todos os países';
        allOption.onmouseover = () => allOption.style.background = 'rgba(167, 139, 250, 0.2)';
        allOption.onmouseout = () => allOption.style.background = '';
        allOption.onclick = () => {
            this.filters.selectedCountry = null;
            document.getElementById('selectedCountryFlag').innerHTML = '🌎';
            countryDropdown.style.display = 'none';
            this.applyFilters();
        };
        countryDropdown.appendChild(allOption);

        // Adicionar países
        Object.entries(MatrixData.countries).forEach(([code, country]) => {
            const option = document.createElement('div');
            option.style.cssText = `
                padding: 3px 6px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 16px;
                text-align: center;
            `;
            option.innerHTML = country.flag;
            option.title = country.name;
            option.onmouseover = () => option.style.background = 'rgba(167, 139, 250, 0.2)';
            option.onmouseout = () => option.style.background = '';
            option.onclick = () => {
                this.filters.selectedCountry = code;
                document.getElementById('selectedCountryFlag').innerHTML = country.flag;
                countryDropdown.style.display = 'none';
                this.applyFilters();
            };
            countryDropdown.appendChild(option);
        });

        countryFilter.appendChild(countryDropdown);
        countryFilter.onclick = (e) => {
            e.stopPropagation();
            countryDropdown.style.display = countryDropdown.style.display === 'none' ? 'block' : 'none';
        };
        filtersContainer.appendChild(countryFilter);

        // Filtro de Setor
        const categoryFilter = document.createElement('select');
        categoryFilter.id = 'categoryFilter';
        categoryFilter.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            padding: 3px 6px;
            color: #fff;
            font-size: 11px;
            cursor: pointer;
            outline: none;
            transition: background 0.2s;
            max-width: 60px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        `;
        categoryFilter.onmouseover = () => categoryFilter.style.background = 'rgba(255, 255, 255, 0.15)';
        categoryFilter.onmouseout = () => categoryFilter.style.background = 'rgba(255, 255, 255, 0.1)';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Setores';
        categoryFilter.appendChild(defaultOption);
        
        MatrixData.getCategories().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        filtersContainer.appendChild(categoryFilter);

        // Adicionar ao header
        filterTarget.appendChild(filtersContainer);

        // Event listeners
        document.getElementById('ipoFilter').addEventListener('change', (e) => {
            this.filters.showIPO = e.target.checked;
            this.applyFilters();
        });

        categoryFilter.addEventListener('change', (e) => {
            this.filters.selectedCategory = e.target.value || null;
            this.applyFilters();
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', () => {
            countryDropdown.style.display = 'none';
        });
    }

    applyFilters() {
        // Filtrar unicórnios baseado nos filtros ativos
        this.filteredUnicorns = {};
        
        Object.entries(MatrixData.unicorns).forEach(([key, unicorn]) => {
            let shouldShow = true;
            
            // Filtro IPO
            if (!this.filters.showIPO && unicorn.ipo) {
                shouldShow = false;
            }
            
            // Filtro País
            if (this.filters.selectedCountry && unicorn.country !== this.filters.selectedCountry) {
                shouldShow = false;
            }
            
            // Filtro Categoria
            if (this.filters.selectedCategory && unicorn.category !== this.filters.selectedCategory) {
                shouldShow = false;
            }
            
            if (shouldShow) {
                this.filteredUnicorns[key] = unicorn;
            }
        });
        
        // Atualizar visualização
        this.updateSpheresVisibility();
        this.updateConnections();
        this.updateProximityDisplay();
    }

    updateSpheresVisibility() {
        Object.entries(this.spheres).forEach(([key, sphere]) => {
            if (key === 'soller') return; // Sempre mostrar Soller
            
            const isVisible = key in this.filteredUnicorns;
            sphere.visible = isVisible;
            
            // Também atualizar visibilidade dos elementos filhos (anéis, glow, etc)
            if (sphere.children) {
                sphere.children.forEach(child => {
                    child.visible = isVisible;
                });
            }
        });
    }

    setupSidebarToggle() {
        const sidebar = document.querySelector('.matrix-sidebar');
        const visualization = document.querySelector('.matrix-visualization');
        const mainContainer = document.querySelector('.matrix-main-container');
        
        if (!sidebar || !visualization) return;
        
        // Limpar botões existentes
        const existingFloatingBtn = document.querySelector('.sidebar-toggle-floating');
        const existingInnerBtn = document.querySelector('.sidebar-inner-toggle');
        const existingFullscreenBtn = document.querySelector('.sidebar-fullscreen-toggle');
        
        if (existingFloatingBtn) existingFloatingBtn.remove();
        if (existingInnerBtn) existingInnerBtn.remove();
        if (existingFullscreenBtn) existingFullscreenBtn.remove();
        
        // Criar botão flutuante (sempre visível)
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-floating';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1001;
            opacity: 0.8;
        `;
        mainContainer.appendChild(toggleBtn);
        
        // SEMPRE começar com sidebar ABERTO
        let isRetracted = false;
        
        // Aplicar estado inicial ABERTO
        sidebar.classList.remove('retracted');
        visualization.classList.remove('expanded');
        mainContainer.classList.remove('sidebar-hidden');
        toggleBtn.classList.remove('visible');
        toggleBtn.innerHTML = '<span class="material-icons"></span>';
        toggleBtn.style.right = '-325px';
        
        const toggleSidebar = () => {
            isRetracted = !isRetracted;
            
            if (isRetracted) {
                // Fechando sidebar
                sidebar.classList.add('retracted');
                visualization.classList.add('expanded');
                mainContainer.classList.add('sidebar-hidden');
                toggleBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
                toggleBtn.style.right = '10px';
                
                // Salvar estado
                localStorage.setItem('matrixSidebarRetracted', 'true');
            } else {
                // Abrindo sidebar
                sidebar.classList.remove('retracted');
                visualization.classList.remove('expanded');
                mainContainer.classList.remove('sidebar-hidden');
                toggleBtn.innerHTML = '<span class="material-icons"></span>';
                toggleBtn.style.right = '-325px';
                
                // Salvar estado
                localStorage.setItem('matrixSidebarRetracted', 'false');
            }
            
            // Resize após animação
            setTimeout(() => {
                this.onWindowResize();
                if (this.controls) this.controls.update();
            }, 350);
        };
        
        toggleBtn.addEventListener('click', toggleSidebar);
        
        // Criar botões internos na sidebar
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-inner-toggle';
        sidebarToggle.innerHTML = '<span class="material-icons">chevron_right</span>';
        sidebarToggle.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100;
        `;
        
        // Botão fullscreen
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'sidebar-fullscreen-toggle';
        fullscreenBtn.innerHTML = '<span class="material-icons">fullscreen</span>';
        fullscreenBtn.style.cssText = `
            position: absolute;
            right: 44px;
            top: 10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 101;
        `;
        
        const firstCard = sidebar.querySelector('.matrix-info-card');
        if (firstCard) {
            firstCard.style.position = 'relative';
            firstCard.appendChild(sidebarToggle);
            firstCard.appendChild(fullscreenBtn);
        }
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        fullscreenBtn.addEventListener('click', () => {
            MatrixController.toggleFullScreen();
        });
        
        // Ajustar tamanho inicial após um pequeno delay
        setTimeout(() => {
            this.onWindowResize();
        }, 100);
    }

    setupScene() {
        // Cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(15, 10, 15);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controles orbitais
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 40;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;

        this.controls.rotateSpeed = 0.8;
        this.controls.zoomSpeed = 0.8;  
        this.controls.panSpeed = 0.18;
    }

    setupLights() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Luz pontual para realce
        const pointLight = new THREE.PointLight(0xa78bfa, 0.5, 30);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }

    setupGrid() {
        const gridSize = 20;
        const divisions = 10;
        
        // Grid XZ (Tech x Platform)
        const gridXZ = new THREE.GridHelper(gridSize, divisions, 0x667eea, 0x333366);
        gridXZ.position.y = -10;
        this.scene.add(gridXZ);

        // Criar eixos com interatividade
        this.axisHelpers = [];
        
        // Eixo X - Tech & Automação
        this.createInteractiveAxis('Tech & Automação', 
            new THREE.Vector3(1, 0, 0), 
            new THREE.Vector3(10, 0, 0),
            0xfc8d56
        );
        
        // Eixo Z - Marketplace
        this.createInteractiveAxis('Marketplace', 
            new THREE.Vector3(0, 0, 1), 
            new THREE.Vector3(0, 0, 10),
            0xa78bfa
        );
        
        // Eixo Y - Recorrência
        this.createInteractiveAxis('Recorrência', 
            new THREE.Vector3(0, 1, 0), 
            new THREE.Vector3(0, 10, 0),
            0x22c55e
        );
        
        // Planos semi-transparentes
        this.planes = {};
        this.planesClickCount = {};
        this.createInteractivePlane('XZ', 0x667eea);
        this.createInteractivePlane('XY', 0xa78bfa);
        this.createInteractivePlane('YZ', 0x22c55e);
    }

    createInteractiveAxis(name, direction, position, color) {
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 12;
        
        // Arrow helper visual (renderOrder alto para ficar sobre a esfera)
        const arrowHelper = new THREE.ArrowHelper(
            direction, 
            origin, 
            length, 
            color,
            3,
            2
        );
        arrowHelper.renderOrder = 10;
        this.scene.add(arrowHelper);
        
        // Cilindro invisível para detecção de hover
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, length, 8);
        const material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        
        // Posicionar e rotacionar o cilindro
        if (direction.x === 1) { // Eixo X
            cylinder.rotation.z = -Math.PI / 2;
            cylinder.position.set(length / 2, 0, 0);
        } else if (direction.y === 1) { // Eixo Y
            cylinder.position.set(0, length / 2, 0);
        } else if (direction.z === 1) { // Eixo Z
            cylinder.rotation.x = Math.PI / 2;
            cylinder.position.set(0, 0, length / 2);
        }
        
        cylinder.userData = {
            type: 'axis',
            name: name,
            color: color
        };
        
        this.axisHelpers.push(cylinder);
        this.scene.add(cylinder);
        
        // Label visual
        this.createTextLabel(name, position, color);
    }

     createInteractivePlane(orientation, color) {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.02,
            side: THREE.DoubleSide,
            depthWrite: false, // Desativa a escrita no buffer de profundidade
            depthTest: false   // Desativa o teste de profundidade
        });
        const plane = new THREE.Mesh(geometry, material);
        
        if (orientation === 'XZ') {
            plane.rotation.x = Math.PI / 2;
            plane.position.y = -10;
        } else if (orientation === 'XY') {
            plane.position.z = -10;
        } else if (orientation === 'YZ') {
            plane.rotation.y = Math.PI / 2;
            plane.position.x = -10;
        }
        
        // Adicionando um renderOrder para garantir a ordem de renderização
        plane.renderOrder = 0;
        
        // Adicionando uma tag para identificação via userData
        plane.userData = { 
            orientation, 
            originalOpacity: 0.02, 
            clickable: true,
            isPlane: true // Nova flag para identificação
        };

        this.planes[orientation] = plane;
        this.planesClickCount[orientation] = 0;
        this.scene.add(plane);
    }

    createSpheres() {
        // Aplicar filtros iniciais - sem IPOs por padrão
        this.applyFilters();
        
        // Criar esferas para cada unicórnio
        Object.entries(MatrixData.unicorns).forEach(([key, unicorn]) => {
            const position = this.coordinatesToPosition(unicorn.coordinates);
            const size = 0.3 + (unicorn.valuation / 100000) * 0.85;
            
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(unicorn.color),
                metalness: 0.3,
                roughness: 0.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.9
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(position);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            sphere.userData = { 
                type: 'unicorn', 
                key: key,
                data: unicorn 
            };
            
            // Aplicar visibilidade inicial baseada nos filtros
            sphere.visible = !unicorn.ipo || this.filters.showIPO;
            
            this.scene.add(sphere);
            this.spheres[key] = sphere;
            
            // Adicionar anel orbital
            this.addOrbitalRing(sphere, size + 0.2, unicorn.color);
            
            // Label
            this.createTextLabel(unicorn.name, position.clone().add(new THREE.Vector3(0, size + 1, 0)), unicorn.color);
        });

        // Criar esfera da Soller
        this.createSollerSphere();
    }

    createSollerSphere() {
        const position = this.coordinatesToPosition(MatrixEngine.sollerPosition);
        
        // Calcular tamanho baseado no valuation estimado
        const valuation = MatrixEngine.estimateValuation(MatrixEngine.sollerPosition);
        const valuationInMillions = valuation / 5000000;
        const size = 0.3 + (valuationInMillions / 100000) * 0.85;
        const clampedSize = Math.min(Math.max(size, 0.4), 1.2);
        
        // Criar grupo para a Soller (facilita controle de renderização)
        const sollerGroup = new THREE.Group();
        
        // Geometria esférica
        const geometry = new THREE.SphereGeometry(clampedSize, 64, 64);
        
        // Material
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(MatrixData.visualization.colors.soller),
            metalness: 0.2,
            roughness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            emissive: new THREE.Color(MatrixData.visualization.colors.soller),
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.95,
            depthWrite: true,
            depthTest: true
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        // Adicionar uma segunda esfera com outline
        const outlineGeometry = new THREE.SphereGeometry(clampedSize * 1.05, 64, 64);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(MatrixData.visualization.colors.soller),
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
            depthWrite: false,
            depthTest: false
        });
        
        const outlineSphere = new THREE.Mesh(outlineGeometry, outlineMaterial);
        
        // Adicionar ao grupo
        sollerGroup.add(outlineSphere);
        sollerGroup.add(sphere);
        sollerGroup.position.copy(position);
        
        // Ordem de renderização estratégica
        outlineSphere.renderOrder = 998;
        sphere.renderOrder = 999;
        
        sphere.userData = { 
            type: 'soller',
            draggable: true,
            valuation: valuation,
            size: clampedSize
        };
        
        // Armazenar referências
        this.scene.add(sollerGroup);
        this.spheres.soller = sphere;
        this.sollerGroup = sollerGroup;
        
        // Adicionar glow effect
        this.addGlowEffect(sphere, clampedSize + 0.3, MatrixData.visualization.colors.soller);
        
        // Adicionar anéis pulsantes
        this.addPulsingRings(sphere, clampedSize + 0.5);
        
        // Label
        const labelText = `Soller (R$ ${(valuation/1000000).toFixed(0)}M)`;
        this.createTextLabel(labelText, position.clone().add(new THREE.Vector3(0, clampedSize + 1.5, 0)), MatrixData.visualization.colors.soller, true);
        
        this.currentSollerSize = clampedSize;
    }

    updateSollerSize() {
        if (!this.spheres.soller || !MatrixEngine) return;
        
        const valuation = MatrixEngine.estimateValuation(MatrixEngine.sollerPosition);
        const valuationInMillions = valuation / 5000000;
        const newSize = 0.3 + (valuationInMillions / 100000) * 0.85;
        const clampedSize = Math.min(Math.max(newSize, 0.4), 1.2);
        
        // Só atualizar se mudou significativamente (>5%)
        if (Math.abs(clampedSize - this.currentSollerSize) > this.currentSollerSize * 0.05) {
            const duration = 1000;
            const start = performance.now();
            const startScale = this.spheres.soller.scale.x;
            const targetScale = clampedSize / this.currentSollerSize;
            
            const animateScale = (time) => {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeInOutCubic(progress);
                
                const scale = startScale + (targetScale - startScale) * eased;
                this.spheres.soller.scale.set(scale, scale, scale);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScale);
                } else {
                    this.currentSollerSize = clampedSize;
                    this.spheres.soller.userData.size = clampedSize;
                    this.spheres.soller.userData.valuation = valuation;
                }
            };
            
            requestAnimationFrame(animateScale);
        }
    }

    addOrbitalRing(sphere, radius, color) {
        const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        sphere.add(ring);
    }

    addGlowEffect(sphere, radius, color) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                viewVector: { value: this.camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.4 - dot(vNormal, vNormel), 1.5);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float intensity;
                void main() {
                    vec3 glow = color * intensity;
                    gl_FragColor = vec4(glow, intensity * 0.4);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glow = new THREE.Mesh(geometry, material);
        glow.renderOrder = 998;
        glow.material.depthTest = false;
        sphere.add(glow);
    }

    addPulsingRings(sphere, radius) {
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(radius + i * 0.3, radius + i * 0.3 + 0.1, 64);
            const material = new THREE.MeshBasicMaterial({
                color: MatrixData.visualization.colors.soller,
                transparent: true,
                opacity: 0.3 - i * 0.1,
                side: THREE.DoubleSide,
                depthTest: false,
                depthWrite: false
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;
            ring.userData = { pulsePhase: i * 2 };
            ring.renderOrder = 1000 + i;
            sphere.add(ring);
        }
    }

    createTextLabel(text, position, color, special = false) {
        // Implementação simplificada - em produção, usar CSS2DRenderer
        this.labels.push({ text, position, color, special });
    }

    coordinatesToPosition(coords) {
        if (!coords) return new THREE.Vector3(0, 0, 0);
        
        const x = (coords.tech - 50) / 5;
        const y = (coords.recurring - 50) / 5;
        const z = (coords.platform - 50) / 5;
        
        return new THREE.Vector3(x, y, z);
    }

    positionToCoordinates(position) {
        const b2bFocus = MatrixEngine && MatrixEngine.sollerPosition ? MatrixEngine.sollerPosition.b2bFocus : 80;
        const scale = MatrixEngine && MatrixEngine.sollerPosition ? MatrixEngine.sollerPosition.scale : 100;
        
        return {
            tech: Math.max(0, Math.min(100, position.x * 5 + 50)),
            platform: Math.max(0, Math.min(100, position.z * 5 + 50)),
            recurring: Math.max(0, Math.min(100, position.y * 5 + 50)),
            b2bFocus: b2bFocus,
            scale: scale
        };
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Dimension sliders
        this.setupDimensionSliders();

        // Resize com debounce
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.onWindowResize();
                const modalContent = this.container.closest('.unicorn-modal-content');
                if (modalContent && modalContent.classList.contains('full-screen')) {
                    modalContent.style.display = 'none';
                    modalContent.offsetHeight;
                    modalContent.style.display = '';
                }
            }, 100);
        };

        window.addEventListener('resize', debouncedResize);
        document.addEventListener('fullscreenchange', debouncedResize);
        document.addEventListener('webkitfullscreenchange', debouncedResize);
        document.addEventListener('mozfullscreenchange', debouncedResize);
        document.addEventListener('MSFullscreenChange', debouncedResize);
    }

    setupDimensionSliders() {
        const slidersContainer = document.getElementById('dimensionSliders');
        if (!slidersContainer || !MatrixData || !MatrixEngine) return;
        
        slidersContainer.innerHTML = '';
        
        Object.entries(MatrixData.dimensions).forEach(([key, dim]) => {
            const control = document.createElement('div');
            control.className = 'dimension-control';
            control.innerHTML = `
                <label>${dim.icon} ${dim.name}</label>
                <div class="value-display" id="dim-value-${key}">
                    ${MatrixEngine.sollerPosition[key]}%
                </div>
                <input type="range" 
                       class="dimension-slider" 
                       id="dim-slider-${key}"
                       min="0" 
                       max="100" 
                       value="${MatrixEngine.sollerPosition[key]}"
                       data-dimension="${key}">
            `;
            slidersContainer.appendChild(control);
            
            const slider = control.querySelector(`#dim-slider-${key}`);
            slider.addEventListener('input', this.onSliderChange.bind(this));
        });
        
        this.updatePositionDisplay(MatrixEngine.sollerPosition);
    }

    onSliderChange(event) {
        if (!MatrixEngine) return;
        
        const dimension = event.target.dataset.dimension;
        const value = parseFloat(event.target.value);
        
        // Atualiza instantaneamente sem debounce
        const valueDisplay = document.getElementById(`dim-value-${dimension}`);
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(value)}%`;
        }
        
        const newPosition = { ...MatrixEngine.sollerPosition };
        newPosition[dimension] = value;
        MatrixEngine.sollerPosition = newPosition;
        
        // Atualizar posição da esfera instantaneamente
        if (dimension === 'scale' || dimension === 'b2bFocus') {
            this.updateConnections();
            this.updateProximityDisplay();
        } else {
            const pos3D = this.coordinatesToPosition(newPosition);
            if (this.sollerGroup) {
                this.sollerGroup.position.copy(pos3D);
            } else if (this.spheres.soller) {
                this.spheres.soller.position.copy(pos3D);
            }
            this.updateConnections();
            this.updateProximityDisplay();
        }
        
        // Sync com forecast
        const params = MatrixEngine.positionToProjectionParams(newPosition);
        this.syncToForecast(params);
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (this.isDragging && this.selectedObject) {
            this.dragObject();
        } else {
            this.checkHover();
        }
    }

    onMouseDown(event) {
        if (event.button !== 0) return;
        
        if (!this.raycaster || !this.camera || !this.spheres || !this.spheres.soller) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Verificar clique nos planos
        if (this.planes && Object.keys(this.planes).length > 0) {
            const planeIntersects = this.raycaster.intersectObjects(Object.values(this.planes));
            if (planeIntersects.length > 0) {
                const clickedPlane = planeIntersects[0].object;
                const orientation = clickedPlane.userData.orientation;
                
                if (!this.planesClickCount[orientation]) {
                    this.planesClickCount[orientation] = 0;
                }
                
                this.planesClickCount[orientation]++;
                if (this.planesClickCount[orientation] >= 3) {
                    const isHidden = clickedPlane.material.opacity < 0.01;
                    clickedPlane.material.opacity = isHidden ? 0.02 : 0;
                    this.planesClickCount[orientation] = 0;
                }
                
                clearTimeout(this.planeClickTimeout);
                this.planeClickTimeout = setTimeout(() => {
                    Object.keys(this.planesClickCount).forEach(key => {
                        this.planesClickCount[key] = 0;
                    });
                }, 2000);
                
                return;
            }
        }
        
        // Verificar drag da esfera
        const intersects = this.raycaster.intersectObjects(Object.values(this.spheres));
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.draggable) {
                this.isDragging = true;
                this.selectedObject = object;
                if (this.controls) this.controls.enabled = false;
                
                if (this.renderer && this.renderer.domElement) {
                    this.renderer.domElement.classList.add('matrix-dragging');
                }
                
                this.dragPlane = new THREE.Plane(
                    new THREE.Vector3(0, 1, 0),
                    -intersects[0].point.y
                );
            }
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            if (this.selectedObject && this.spheres && this.spheres.soller && this.selectedObject === this.spheres.soller) {
                const finalPosition = this.spheres.soller.position.clone();
                this.syncToForecastDrag(finalPosition);
            }
            
            this.isDragging = false;
            this.selectedObject = null;
            if (this.controls) this.controls.enabled = true;
            if (this.renderer && this.renderer.domElement) {
                this.renderer.domElement.classList.remove('matrix-dragging');
            }

            // Garante que a atualização da lista de unicórnios ocorra aqui também
            this.updateProximityDisplay();
        }
    }

    dragObject() {
        if (!this.isDragging || !this.selectedObject || !this.raycaster || !this.camera) return;
        
        if (!this.dragPlane) {
            this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.selectedObject.position.y);
        }
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersectPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint);
        
        const maxDistance = 10;
        if (intersectPoint.length() > maxDistance) {
            intersectPoint.normalize().multiplyScalar(maxDistance);
        }
        
        this.selectedObject.position.x = intersectPoint.x;
        this.selectedObject.position.z = intersectPoint.z;
        
        const coordinates = this.positionToCoordinates(intersectPoint);
        this.updatePositionDisplay(coordinates);
        
        this.updateProximityCard();
        
        this.updateConnections();
    }

    checkHover() {
        if (!this.raycaster || !this.camera) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Verificar esferas primeiro
        if (this.spheres) {
            const sphereObjects = Object.values(this.spheres).filter(s => s.visible);
            const intersects = this.raycaster.intersectObjects(sphereObjects);
            if (intersects.length > 0) {
                const object = intersects[0].object;
                this.showTooltip(object);
                this.renderer.domElement.style.cursor = object.userData.draggable ? 'grab' : 'pointer';
                return;
            }
        }
        
        // Verificar eixos
        if (this.axisHelpers) {
            const axisIntersects = this.raycaster.intersectObjects(this.axisHelpers);
            if (axisIntersects.length > 0) {
                const axis = axisIntersects[0].object;
                this.showAxisTooltip(axis);
                this.renderer.domElement.style.cursor = 'help';
                return;
            }
        }
        
        this.hideTooltip();
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.style.cursor = 'default';
        }
    }

    showAxisTooltip(axis) {
        if (!this.tooltip || !axis.userData) return;
        
        const vector = axis.position.clone();
        vector.project(this.camera);
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (vector.x * 0.5 + 0.5) * rect.width + rect.left;
        const y = (-vector.y * 0.5 + 0.5) * rect.height + rect.top;
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = (y - 20) + 'px';
        
        const axisData = axis.userData;
        const dimensions = {
            'Tech & Automação': {
                description: 'Automação em processos internos',
                impact: 'Aumenta eficiência operacional e margem',
                current: Math.round(MatrixEngine.sollerPosition.tech) + '%'
            },
            'Marketplace': {
                description: 'Agência → Plataforma Digital',
                impact: 'Escala exponencial e redução de CAC',
                current: Math.round(MatrixEngine.sollerPosition.platform) + '%'
            },
            'Recorrência': {
                description: 'Modelo transacional → CS',
                impact: 'Previsibilidade',
                current: Math.round(MatrixEngine.sollerPosition.recurring) + '%'
            }
        };
        
        const info = dimensions[axisData.name] || {};
        
        this.tooltip.innerHTML = `
            <h5 style="color: #${axisData.color.toString(16).padStart(6, '0')}">
                ${axisData.name}
            </h5>
            <div class="tooltip-metrics">
                <div class="metric-row">
                    <span class="metric-label-chart" style="display: block; margin-bottom: 4px;">
                        ${info.description || ''}
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-label-chart">Posição Atual:</span>
                    <span class="metric-value-chart">${info.current || '0%'}</span>
                </div>
            </div>
        `;
        
        this.tooltip.classList.add('visible');
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'matrix-tooltip';
        this.container.appendChild(this.tooltip);
    }

    showTooltip(object) {
        if (!this.tooltip) return;
        
        const vector = object.position.clone();
        vector.project(this.camera);
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (vector.x * 0.5 + 0.5) * rect.width + rect.left;
        const y = (-vector.y * 0.5 + 0.5) * rect.height + rect.top;
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = (y - 20) + 'px';
        
        if (object.userData.type === 'unicorn') {
            const unicorn = object.userData.data;
            const countryInfo = MatrixData.countries[unicorn.country] || { flag: '🌏', name: 'Unknown' };
            
            this.tooltip.innerHTML = `
                <h5 style="color: ${unicorn.color}">
                    ${unicorn.name} ${unicorn.ipo ? '(IPO)' : ''}
                </h5>
                <div class="unicorn-1">${unicorn.category || ''}</div>
                <div style="color: ${unicorn.color}" class="unicorn-keyword">${unicorn.keyword || ''}</div>
                <div class="tooltip-metrics">
                    <div class="metric-row">
                        <span class="metric-label-chart">Valuation&nbsp</span>
                        <span class="metric-value-chart">$${unicorn.valuation > 1000 ? (unicorn.valuation/1000).toFixed(1) + 'B' : unicorn.valuation + 'M'}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">País&nbsp</span>
                        <span class="metric-value-chart">${countryInfo.name}</span>
                    </div>
                    <div style="margin: 8px 0; border-top: 1px solid rgba(255,255,255,0.1);"></div>
                    <div class="metric-row">
                        <span class="metric-label-chart">Tech&nbsp</span>
                        <span class="metric-value-chart">${unicorn.coordinates.tech}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">Marketplace&nbsp</span>
                        <span class="metric-value-chart">${unicorn.coordinates.platform}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">Foco B2B&nbsp</span>
                        <span class="metric-value-chart">${unicorn.coordinates.b2bFocus}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">Recorrência&nbsp</span>
                        <span class="metric-value-chart">${unicorn.coordinates.recurring}%</span>
                    </div>
                </div>
            `;
        } else if (object.userData.type === 'soller') {
            if (!MatrixEngine || !MatrixData) return;
            
            const valuationElement = document.getElementById('valuationProjected');
            const gmvElement = document.getElementById('gmvProjected');
            const valorSollerElement = document.getElementById('valorSollerProjected');
            
            const valuationValue = valuationElement ? valuationElement.textContent : 'R$ 0';
            const gmvValue = gmvElement ? gmvElement.textContent : 'R$ 0';
            const valorSollerValue = valorSollerElement ? valorSollerElement.textContent : 'R$ 0';
            
            const sollerColor = MatrixData.visualization?.colors?.soller || '#a78bfa';
            
            this.tooltip.innerHTML = `
                <h5 style="color: ${sollerColor}">Soller</h5>
                <div class="tooltip-metrics">
                    <div class="metric-row">
                        <span class="metric-label-chart">Valor Soller&nbsp</span>
                        <span class="metric-value-chart">${valorSollerValue}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">GMV&nbsp</span>
                        <span class="metric-value-chart">${gmvValue}</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label-chart">Valuation&nbsp</span>
                        <span class="metric-value-chart">${valuationValue}</span>
                    </div>
                </div>
            `;
        }
        
        this.tooltip.classList.add('visible');
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    setupEngineSync() {
        if (MatrixEngine && MatrixEngine.on) {
            MatrixEngine.on('positionUpdated', (position) => {
                this.updateFromEngine();
            });
        }
    }

    updateSpheresOpacity() {
        if (!this.spheres || !this.controls) return;

        const distance = this.camera.position.distanceTo(this.controls.target);
        const normalizedDistance = Math.min(distance / this.controls.maxDistance, 1);
        
        const minOpacity = 0.99;
        const maxOpacity = 1.0;
        const opacity = maxOpacity - (maxOpacity - minOpacity) * normalizedDistance;

        Object.values(this.spheres).forEach(sphere => {
            if (sphere && sphere.material && sphere.visible) {
                sphere.material.opacity = opacity;
            }
        });
    }

    updateFromEngine() {
        if (!this.spheres || !this.spheres.soller || !MatrixEngine) return;
        
        const position = MatrixEngine.sollerPosition;
        const pos3D = this.coordinatesToPosition(position);
        
        const target = this.sollerGroup || this.spheres.soller;
        
        this.animateSphere(target, pos3D);
        this.updatePositionDisplay(position);
        this.updateProximityDisplay();
        this.updateTradeOffsDisplay();
        this.updateSlidersFromPosition(position);
        this.updateConnections();
    }

    animateSphere(sphere, targetPosition) {
        if (!sphere || !sphere.position) {
            console.warn('Sphere não inicializada ainda');
            return;
        }
        
        const target = sphere === this.spheres.soller && this.sollerGroup ? 
                       this.sollerGroup : sphere;
        
        const duration = 1000;
        const start = performance.now();
        const startPos = target.position.clone();
        
        const animate = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);
            
            target.position.lerpVectors(startPos, targetPosition, eased);
            
            if (sphere === this.spheres.soller && progress < 1) {
                this.updateConnections();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.updateConnections();
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateSollerToPosition(coordinates) {
        if (!this.spheres || !this.spheres.soller) {
            console.warn('Soller sphere não inicializada ainda');
            return;
        }
        
        const pos3D = this.coordinatesToPosition(coordinates);
        const target = this.sollerGroup || this.spheres.soller;
        
        const duration = 1000;
        const start = performance.now();
        const startPos = target.position.clone();
        
        const animate = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);
            
            target.position.lerpVectors(startPos, pos3D, eased);
            this.updateConnections();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.updatePositionDisplay(coordinates);
                this.updateProximityDisplay();
                this.updateTradeOffsDisplay();
                this.updateConnections();
            }
        };
        
        requestAnimationFrame(animate);
    }

    toggleFullScreen() {
        if (!this.container) return;

        const modalContent = this.container.closest('.unicorn-modal-content');
        if (!modalContent) return;

        const isFullScreen = modalContent.classList.contains('full-screen');
        
        if (isFullScreen) {
            modalContent.classList.remove('full-screen');
            localStorage.removeItem('matrixWasFullScreen');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } else {
            modalContent.classList.add('full-screen');
            localStorage.setItem('matrixWasFullScreen', 'true');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }

        this.onWindowResize();

        const expandIcon = modalContent.querySelector('.modal-expand .material-icons');
        if (expandIcon) {
            expandIcon.textContent = isFullScreen ? 'fullscreen' : 'fullscreen_exit';
        }
        
        const sidebarFullscreenBtn = document.querySelector('.sidebar-fullscreen-toggle .material-icons');
        if (sidebarFullscreenBtn) {
            sidebarFullscreenBtn.textContent = isFullScreen ? 'fullscreen' : 'fullscreen_exit';
        }
    }

    updateConnections() {
        if (!this.scene || !this.spheres || !this.spheres.soller || !MatrixEngine) return;
        
        // Remover conexões antigas
        this.connections.forEach(line => {
            if (line && line.geometry) line.geometry.dispose();
            if (line && line.material) {
                if (Array.isArray(line.material)) {
                    line.material.forEach(m => m.dispose());
                } else {
                    line.material.dispose();
                }
            }
            this.scene.remove(line);
        });
        this.connections = [];
        
        // Pegar os unicórnios mais próximos que estão visíveis
        const allNearest = MatrixEngine.findNearestUnicorns(MatrixEngine.sollerPosition, 100);
        const visibleNearest = allNearest.filter(unicorn => {
            return this.spheres[unicorn.key] && this.spheres[unicorn.key].visible;
        }).slice(0, 5); // Limitar a no máximo 5 conexões
        
        visibleNearest.forEach((unicorn, index) => {
            const baseOpacity = 1 - (index / 5);
            
            let sollerPos;
            if (this.sollerGroup) {
                sollerPos = this.sollerGroup.position.clone();
            } else {
                sollerPos = this.spheres.soller.position.clone();
            }
            
            const unicornPos = this.spheres[unicorn.key].position.clone();
            
            const line = this.createOptimalConnection(
                sollerPos,
                unicornPos,
                unicorn.color,
                baseOpacity * 0.8,
                unicorn
            );
            
            if (line) {
                this.scene.add(line);
                this.connections.push(line);
            }
        });
    }   

    createOptimalConnection(start, end, color, opacity, unicornData = null) {
        // Calcular distância
        const distance = start.distanceTo(end);
        
        // Calcular vetor direção e ponto de saída na superfície da esfera
        const direction = end.clone().sub(start).normalize();
        const sphereRadius = this.currentSollerSize || 0.5;
        const exitPoint = start.clone().add(direction.multiplyScalar(sphereRadius));
        
        // Ajustar opacidade baseada em scale
        let finalOpacity = opacity;
        if (unicornData && MatrixEngine) {
            const sollerScale = MatrixEngine.sollerPosition.scale;
            const scaleEffect = sollerScale / 100;
            finalOpacity = opacity * scaleEffect;
            
            if (finalOpacity < 0.1) return null;
        }
        
        // Calcular força da conexão (similaridade)
        const similarity = unicornData ? unicornData.similarity / 100 : 0.5;
        
        // Criar curva Bézier otimizada
        const points = [];
        const segments = 30;
        
        // Altura da curva proporcional à distância (menos curva para distâncias pequenas)
        const curveHeight = Math.min(distance * 0.15, 2);
        
        // Ponto de controle no meio
        const midPoint = exitPoint.clone().lerp(end, 0.5);
        midPoint.y += curveHeight;
        
        // Gerar pontos da curva
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const point = new THREE.Vector3();
            
            // Curva de Bézier quadrática
            const oneMinusT = 1 - t;
            point.x = oneMinusT * oneMinusT * exitPoint.x + 2 * oneMinusT * t * midPoint.x + t * t * end.x;
            point.y = oneMinusT * oneMinusT * exitPoint.y + 2 * oneMinusT * t * midPoint.y + t * t * end.y;
            point.z = oneMinusT * oneMinusT * exitPoint.z + 2 * oneMinusT * t * midPoint.z + t * t * end.z;
            
            points.push(point);
        }
        
        // Criar linha principal
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: finalOpacity,
            linewidth: 2
        });
        
        // Adicionar linhas extras baseado na força da conexão
        const lineGroup = new THREE.Group();
        const mainLine = new THREE.Line(geometry, material);
        lineGroup.add(mainLine);
        
        // Adicionar linhas paralelas apenas se a conexão for forte
        if (similarity > 0.5) {
            const extraLines = Math.floor((similarity - 0.5) * 10); // 0-5 linhas extras
            const dispersion = similarity * 0.15; // Máximo 15% de dispersão
            
            for (let i = 0; i < extraLines; i++) {
                const parallelPoints = points.map(p => {
                    const offset = new THREE.Vector3(
                        (Math.random() - 0.5) * dispersion,
                        (Math.random() - 0.5) * dispersion * 0.5,
                        (Math.random() - 0.5) * dispersion
                    );
                    return p.clone().add(offset);
                });
                
                const parallelGeometry = new THREE.BufferGeometry().setFromPoints(parallelPoints);
                const parallelMaterial = new THREE.LineBasicMaterial({
                    color: new THREE.Color(color),
                    transparent: true,
                    opacity: finalOpacity * (0.8 - i * 0.1),
                    linewidth: 1
                });
                
                const parallelLine = new THREE.Line(parallelGeometry, parallelMaterial);
                lineGroup.add(parallelLine);
            }
            
            // Adicionar glow se muito forte (>80%)
            if (similarity > 0.8) {
                const glowMaterial = new THREE.LineBasicMaterial({
                    color: new THREE.Color(color),
                    transparent: true,
                    opacity: finalOpacity * 0.3,
                    linewidth: 4
                });
                
                const glowLine = new THREE.Line(geometry.clone(), glowMaterial);
                glowLine.scale.set(1.02, 1.02, 1.02);
                lineGroup.add(glowLine);
            }
        }
        
        lineGroup.userData = {
            unicorn: unicornData ? unicornData.name : 'unknown',
            similarity: similarity,
            distance: distance.toFixed(2)
        };
        
        return lineGroup;
    }

    updatePositionDisplay(position) {
        const container = document.getElementById('currentPosition');
        if (!container || !MatrixData) return;
        
        // Garantir que scale está incluído
        if (!position.scale && MatrixEngine) {
            position.scale = MatrixEngine.sollerPosition.scale || 100;
        }
        
        // Limpar container sem afetar o título "Match"
        const matchTitle = container.querySelector('h4');
        container.innerHTML = '';
        if (matchTitle) {
            container.appendChild(matchTitle);
        }
        
        // Array com todas as dimensões incluindo scale
        const allDimensions = {
            tech: MatrixData.dimensions.tech,
            platform: MatrixData.dimensions.platform,
            recurring: MatrixData.dimensions.recurring,
            b2bFocus: MatrixData.dimensions.b2bFocus,
            // scale: { name: 'Capilaridade', icon: '🟡', color: '#fbbf24' }
        };
        
        Object.entries(allDimensions).forEach(([key, dim]) => {
            const value = Math.round(position[key] || 0);
            
            const control = document.createElement('div');
            control.className = 'position-metric slider-control';
            control.style.marginBottom = '16px';
            control.innerHTML = `
                <div class="label">${dim.icon} ${dim.name}</div>
                <div class="slider-with-value">
                    <input type="range" 
                           class="dimension-slider" 
                           id="dim-slider-${key}"
                           min="0" 
                           max="100" 
                           value="${value}"
                           data-dimension="${key}"
                           style="flex: 1;">
                    <div class="slider-value-display" id="dim-value-${key}">${value}%</div>
                </div>
            `;
            container.appendChild(control);
            
            const slider = control.querySelector('.dimension-slider');
            slider.addEventListener('input', (e) => {
                this.onSliderChange(e);
                const newValue = e.target.value;
                document.getElementById(`dim-value-${key}`).textContent = `${Math.round(newValue)}%`;
            });
        });
    }

    updateProximityDisplaySmooth() {
        const container = document.getElementById('proximityList');
        if (!container || !MatrixEngine) return;
        
        // Pegar empresas visíveis
        const allNearest = MatrixEngine.findNearestUnicorns(MatrixEngine.sollerPosition, 100);
        const visibleNearest = [];
        
        for (const unicorn of allNearest) {
            if (this.filteredUnicorns && this.filteredUnicorns[unicorn.key]) {
                visibleNearest.push(unicorn);
                if (visibleNearest.length === 5) break;
            }
        }
        
        if (visibleNearest.length === 0) {
            container.style.opacity = '0.5';
            setTimeout(() => {
                container.innerHTML = `
                    <div class="proximity-item" style="opacity: 0.5; text-align: center;">
                        <span style="font-style: italic;">Nenhuma empresa encontrada com os filtros atuais</span>
                    </div>
                `;
                container.style.opacity = '1';
            }, 200);
            return;
        }
        
        // Atualizar elementos existentes sem recriar DOM
        const existingItems = container.querySelectorAll('.proximity-item');
        
        // Se quantidade mudou, fazer fade e recriar
        if (existingItems.length !== visibleNearest.length) {
            container.style.opacity = '0.3';
            setTimeout(() => {
                container.innerHTML = visibleNearest.map(unicorn => {
                    const countryInfo = MatrixData.countries[unicorn.country] || { flag: '🌏' };
                    return `
                        <div class="proximity-item" style="border-left-color: ${unicorn.color}">
                            <div style="flex: 1;">
                                <span class="unicorn-name" style="color: ${unicorn.color}">
                                    ${unicorn.name} ${countryInfo.flag}
                                </span>
                            </div>
                            <span class="match-percent" data-value="${unicorn.similarity}">${unicorn.similarity}% match</span>
                        </div>
                    `;
                }).join('');
                container.style.opacity = '1';
            }, 200);
        } else {
            // Apenas atualizar valores sem recriar elementos
            visibleNearest.forEach((unicorn, index) => {
                const item = existingItems[index];
                if (item) {
                    const matchElement = item.querySelector('.match-percent');
                    if (matchElement) {
                        const currentValue = parseFloat(matchElement.dataset.value || 0);
                        const newValue = unicorn.similarity;
                        
                        // Animar apenas se mudou significativamente (>0.5%)
                        if (Math.abs(currentValue - newValue) > 0.5) {
                            matchElement.style.transition = 'none';
                            matchElement.style.transform = 'scale(1.1)';
                            matchElement.textContent = `${newValue}% match`;
                            matchElement.dataset.value = newValue;
                            
                            setTimeout(() => {
                                matchElement.style.transition = 'transform 0.3s ease';
                                matchElement.style.transform = 'scale(1)';
                            }, 50);
                        }
                    }
                }
            });
        }
    }

    updateProximityDisplay() {
        const container = document.getElementById('proximityList');
        if (!container || !MatrixEngine) return;
        
        // Pegar TODOS os unicórnios e filtrar
        const allNearest = MatrixEngine.findNearestUnicorns(MatrixEngine.sollerPosition, 100);
        const visibleNearest = [];
        
        // Primeiro, tentar pegar 5 visíveis
        for (const unicorn of allNearest) {
            if (this.filteredUnicorns && this.filteredUnicorns[unicorn.key]) {
                visibleNearest.push(unicorn);
                if (visibleNearest.length === 5) break;
            }
        }
        
        // Se não tiver 5, completar com os mais próximos
        if (visibleNearest.length < 5) {
            for (const unicorn of allNearest) {
                if (!visibleNearest.find(v => v.key === unicorn.key)) {
                    // Marcar como "fora do filtro"
                    unicorn.outOfFilter = true;
                    visibleNearest.push(unicorn);
                    if (visibleNearest.length === 5) break;
                }
            }
        }
        
        // Sempre mostrar 5 empresas
        container.innerHTML = visibleNearest.slice(0, 5).map(unicorn => {
            const countryInfo = MatrixData.countries[unicorn.country] || { flag: '🌏' };
            const opacity = unicorn.outOfFilter ? '0.5' : '1';
            return `
                <div class="proximity-item" style="border-left-color: ${unicorn.color}; opacity: ${opacity}">
                    <div style="flex: 1;">
                        <span class="unicorn-name" style="color: ${unicorn.color}">
                            ${unicorn.name} ${countryInfo.flag}
                        </span>
                    </div>
                    <span class="match-percent">${unicorn.similarity}% match</span>
                </div>
            `;
        }).join('');
    }

    updateTradeOffsDisplay() {
        const container = document.getElementById('tradeoffsList');
        if (!container || !MatrixEngine) return;
        
        const optimal = MatrixEngine ? MatrixEngine.findOptimalPath() : null;
        if (!optimal) return;
        
        const tradeoffs = MatrixEngine.calculateTradeOffs(MatrixEngine.sollerPosition, optimal.position);
        
        if (tradeoffs && tradeoffs.length > 0) {
            container.innerHTML = tradeoffs.slice(0, 5).map(tradeoff => `
                <div class="tradeoff-item ${tradeoff.type}">
                    <div class="tradeoff-label">
                        ${tradeoff.dimension}: ${tradeoff.from.toFixed(0)}% → ${tradeoff.to.toFixed(0)}%
                    </div>
                    <div class="tradeoff-impact">
                        Custo: R$ ${(tradeoff.impact.cost/1000).toFixed(0)}k | 
                        Tempo: ${tradeoff.impact.time.toFixed(1)} meses
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="no-data">Calculando trade-offs...</div>';
        }
    }

    updateSlidersFromPosition(position) {
        if (!position) return;
        
        // Incluir scale
        const allDimensions = ['tech', 'platform', 'recurring', 'scale', 'b2bFocus'];
        
        allDimensions.forEach(key => {
            const value = position[key] || 0;
            const slider = document.getElementById(`dim-slider-${key}`);
            const display = document.getElementById(`dim-value-${key}`);
            if (slider) slider.value = value;
            if (display) display.textContent = `${Math.round(value)}%`;
        });
    }

    syncToForecast(params) {
        if (!params) return;
        
        if (window.projectionCalculator && window.projectionCalculator.parameters) {
            Object.assign(window.projectionCalculator.parameters, params);
            
            if (typeof window.updateUIFromParameters === 'function') {
                window.updateUIFromParameters(params);
            }
            
            if (typeof window.recalculateProjections === 'function') {
                window.recalculateProjections();
            }
            
            const unicornBtn = document.querySelector('.floating-unicorn-button');
            if (unicornBtn) {
                unicornBtn.classList.add('active');
                setTimeout(() => unicornBtn.classList.remove('active'), 2000);
            }
        } else {
            console.warn('Sistema de forecast não disponível');
        }
    }

    syncToForecastDrag(position) {
        if (!MatrixEngine) return;
        
        const coordinates = this.positionToCoordinates(position);
        MatrixEngine.sollerPosition = coordinates;
        const params = MatrixEngine.positionToProjectionParams(coordinates);
        this.syncToForecast(params);
    }

    syncFromForecast(params) {
        if (!params || !this.isInitialized) {
            console.warn('Sistema não inicializado ou parâmetros inválidos');
            return;
        }
        
        const newPosition = MatrixEngine.updateFromProjectionParams(params);
        this.animateSollerToPosition(newPosition);
        this.updateSlidersFromPosition(newPosition);
        this.updatePositionDisplay(newPosition);
        this.updateProximityDisplay();
        this.updateTradeOffsDisplay();
    }

    // Adicione esta função dentro da classe StrategicMatrix3D
updateProximityCard() {
    if (!this.proximityCard) {
        console.warn("Elemento 'match-proximity-card' não encontrado.");
        return;
    }

    const nearestUnicorns = MatrixEngine.getNearestUnicorns();
    let htmlContent = '<ul>';
    nearestUnicorns.forEach(item => {
        htmlContent += `
            <li>
                <span class="unicorn-name">${item.name}</span>
                <span class="match-percentage">${item.match}%</span>
            </li>
        `;
    });
    htmlContent += '</ul>';
    this.proximityCard.innerHTML = htmlContent;
}

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || this.container.clientWidth;
        const height = rect.height || this.container.clientHeight;
        
        if (width > 0 && height > 0) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.spheres && this.spheres.soller && this.spheres.soller.children) {
            this.spheres.soller.children.forEach((child, index) => {
                if (child && child.userData && child.userData.pulsePhase !== undefined && child.material) {
                    const scale = 1 + Math.sin(Date.now() * 0.001 + child.userData.pulsePhase) * 0.1;
                    child.scale.set(scale, scale, scale);
                    child.material.opacity = 0.3 - index * 0.1 - Math.sin(Date.now() * 0.001 + child.userData.pulsePhase) * 0.1;
                }
            });
        }
        
        if (this.spheres) {
            Object.values(this.spheres).forEach(sphere => {
                if (sphere && sphere.children) {
                    sphere.children.forEach(child => {
                        if (child && child.geometry && child.geometry.type === 'TorusGeometry') {
                            child.rotation.z += 0.01;
                        }
                    });
                }
            });
        }

        this.updateSpheresOpacity();
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    destroy() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        window.removeEventListener('resize', this.debouncedResize);
        document.removeEventListener('fullscreenchange', this.debouncedResize);
        document.removeEventListener('webkitfullscreenchange', this.debouncedResize);
        document.removeEventListener('mozfullscreenchange', this.debouncedResize);
        document.removeEventListener('MSFullscreenChange', this.debouncedResize);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        const floatingBtn = document.querySelector('.sidebar-toggle-floating');
        if (floatingBtn) {
            floatingBtn.classList.remove('visible');
        }
        
        const innerToggle = document.querySelector('.sidebar-inner-toggle');
        if (innerToggle) innerToggle.remove();
        
        if (this.planeClickTimeout) {
            clearTimeout(this.planeClickTimeout);
            this.planeClickTimeout = null;
        }
        
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
            this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
            this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
        }
        
        window.removeEventListener('resize', this.onWindowResize.bind(this));

        const modalContent = this.container?.closest('.unicorn-modal-content');
        if (modalContent?.classList.contains('full-screen')) {
            localStorage.setItem('matrixWasFullScreen', 'true');
        }
        
        if (this.scene) {
            this.scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            
            while(this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.spheres = {};
        this.connections = [];
        this.labels = [];
        this.planes = {};
        this.planesClickCount = {};
        this.tooltip = null;
        this.container = null;
        this.isInitialized = false;
        this.isDragging = false;
        this.selectedObject = null;
        this.proximityCard = document.getElementById('match-proximity-card');
        this.dragPlane = null;
        this.filteredUnicorns = {};
    }
}

// Inicialização e controle global
window.MatrixController = {
    instance: null,
    
    init() {
        if (this.instance) {
            try {
                this.instance.destroy();
                this.instance = null;
            } catch (e) {
                console.warn('Erro ao destruir:', e);
            }
        }
        
        setTimeout(() => {
            const container = document.getElementById('matrix3d-container');
            if (!container) {
                console.error('Container não encontrado');
                return;
            }
            
            container.innerHTML = '';
            
            this.instance = new StrategicMatrix3D();
            this.instance.init('matrix3d-container');
        }, 100);
    },
    
    findOptimalPath() {
        if (this.instance && this.instance.isInitialized) {
            this.instance.findOptimalPath();
        } else {
            console.warn('Matrix não inicializada ainda');
        }
    },
    
    syncFromForecast(params) {
        if (this.instance && this.instance.isInitialized) {
            this.instance.syncFromForecast(params);
        } else {
            console.warn('Matrix não inicializada ainda');
        }
    },

    toggleFullScreen() {
        if (this.instance && this.instance.isInitialized) {
            this.instance.toggleFullScreen();
        } else {
            console.warn('Matrix não inicializada ainda');
        }
    }
};

function toggleUnicornModal() {
    const modal = document.getElementById('unicornModal');
    const unicornBtn = document.querySelector('.floating-unicorn-button');
    
    if (!modal) return;
    
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        modal.classList.remove('active');
        if (unicornBtn) unicornBtn.classList.remove('modal-active');
        
        if (window.MatrixController && window.MatrixController.instance) {
            window.MatrixController.instance.destroy();
            window.MatrixController.instance = null;
        }
    } else {
        modal.classList.add('active');
        if (unicornBtn) unicornBtn.classList.add('modal-active');
        
        setTimeout(() => {
            window.MatrixController.init();
        }, 100);
    }
}

document.addEventListener('mousemove', (event) => {
    const unicornModal = document.getElementById('unicornModal');
    const customModal = document.getElementById('customPanelModal');

    if (!unicornModal || !customModal) return;

    const unicornContent = unicornModal.querySelector('.unicorn-modal-content');
    const customContent = customModal.querySelector('.modal-content');

    const isUnicornActive = unicornModal.classList.contains('active');
    const isCustomActive = customModal.classList.contains('active');

    if (isUnicornActive && unicornContent) {
        const rect = unicornContent.getBoundingClientRect();
        const isInside = event.clientX >= rect.left &&
                         event.clientX <= rect.right &&
                         event.clientY >= rect.top &&
                         event.clientY <= rect.bottom;

        unicornContent.style.opacity = isInside ? '1' : '0.0001';
        unicornContent.style.transition = 'opacity 0.3s ease';
    }

    if (isCustomActive && customContent) {
        const rect = customContent.getBoundingClientRect();
        const isInside = event.clientX >= rect.left &&
                         event.clientX <= rect.right &&
                         event.clientY >= rect.top &&
                         event.clientY <= rect.bottom;

        customContent.style.opacity = isInside ? '1' : '0.0001';
        customContent.style.transition = 'opacity 0.3s ease';
    }
});

if (window.addEventListener) {
    window.addEventListener('forecastUpdated', (event) => {
        try {
            if (MatrixController.instance && event.detail) {
                MatrixController.syncFromForecast(event.detail);
            }
        } catch(e) {
            console.warn('Erro ao sincronizar com forecast:', e);
        }
    });
}

document.addEventListener('keydown', (event) => {
    const unicornModal = document.getElementById('unicornModal');
    const isModalActive = unicornModal && unicornModal.classList.contains('active');
    const isFullscreen = unicornModal && unicornModal.classList.contains('fullscreen');

    if (isModalActive && event.key === 'Escape') {
        if (isFullscreen) {
            MatrixController.toggleFullScreen();
        } else {
            toggleUnicornModal();
        }
    }
});

// Export para uso global
window.StrategicMatrix3D = StrategicMatrix3D;