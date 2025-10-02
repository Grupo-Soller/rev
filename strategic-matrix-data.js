// Strategic Matrix Data - Unicórnios LATAM e Configurações
const MatrixData = {
    // Dimensões estratégicas
    dimensions: {
        tech: {
            name: 'Tech & Automação',
            description: 'Grau de automação e tecnologia',
            color: '#fc8d56',
            icon: '🟠',
            weight: 0.29
        },
        platform: {
            name: 'Marketplace',
            description: 'Marketplace vs. Serviço tradicional',
            color: '#a78bfa',
            icon: '🟣',
            weight: 0.24
        },
        recurring: {
            name: 'Recorrência',
            description: 'Receita recorrente vs. Transacional',
            color: '#22c55e',
            icon: '🟢',
            weight: 0.29
        },
        b2bFocus: {
            name: 'B2C → SMB → Midmarket → Enterprise',
            description: 'Enterprise (100) vs. Consumer (0)',
            color: '#ef4444',
            icon: '🏢',
            weight: 0.18
        }
    },

    // Dados dos Unicórnios LATAM
    unicorns: {
        // UNICÓRNIOS ATIVOS
        nubank: {
            name: 'Nubank',
            category: 'Fintech',
            keyword: 'Acessibilidade',
            valuation: 45000, // milhões USD
            color: '#8B5CF6',
            country: 'BR',
            ipo: true,
            coordinates: {
                tech: 85,
                platform: 15,
                recurring: 95,
                scale: 100,
                b2bFocus: 25
            }
        },
        rappi: {
            name: 'Rappi',
            category: 'Ecomm',
            keyword: 'SuperApp',
            valuation: 5500,
            color: '#FF6B6B',
            country: 'CO',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 90,
                recurring: 45,
                scale: 100,
                b2bFocus: 30
            }
        },
        wildlife: {
            name: 'Wildlife Studios',
            category: 'Gaming',
            keyword: 'Big Data & AI',
            valuation: 3000,
            color: '#E91E63',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 45,
                platform: 35,
                recurring: 75,
                scale: 100,
                b2bFocus: 5
            }
        },
        quintoandar: {
            name: 'QuintoAndar',
            category: 'Proptech',
            keyword: 'Digitalização',
            valuation: 5200,
            color: '#4CAF50',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 85,
                recurring: 65,
                scale: 100,
                b2bFocus: 15
            }
        },
        kavak: {
            name: 'Kavak',
            category: 'Ecomm',
            keyword: 'Confiança',
            valuation: 8700,
            color: '#FF9800',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 50,
                platform: 45,
                recurring: 25,
                scale: 100,
                b2bFocus: 20
            }
        },
        loggi: {
            name: 'Loggi',
            category: 'Logtech',
            keyword: 'Otimização',
            valuation: 2200,
            color: '#00baff',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 85,
                platform: 95,
                recurring: 70,
                scale: 100,
                b2bFocus: 90
            }
        },
        gympass: {
            name: 'Gympass',
            category: 'Serviços',
            keyword: 'Parcerias',
            valuation: 2400,
            color: '#9C27B0',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 85,
                platform: 90,
                recurring: 95,
                scale: 100,
                b2bFocus: 95
            }
        },
        ebanx: {
            name: 'EBANX',
            category: 'Fintech',
            keyword: 'Cross-border',
            valuation: 1000,
            color: '#ff6900',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 45,
                recurring: 25,
                scale: 100,
                b2bFocus: 85
            }
        },
        creditas: {
            name: 'Creditas',
            category: 'Fintech',
            keyword: 'Garantia',
            valuation: 4800,
            color: '#00d4aa',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 55,
                platform: 15,
                recurring: 45,
                scale: 100,
                b2bFocus: 25
            }
        },
        c6bank: {
            name: 'C6 Bank',
            category: 'Fintech',
            keyword: 'Sofisticação',
            valuation: 5050,
            color: '#ffcd00',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 20,
                recurring: 85,
                scale: 100,
                b2bFocus: 25
            }
        },
        tiendanube: {
            name: 'Tiendanube',
            category: 'Ecomm',
            keyword: 'Infraestrutura',
            valuation: 3100,
            color: '#7c3aed',
            country: 'AR',
            ipo: false,
            coordinates: {
                tech: 40,
                platform: 90,
                recurring: 95,
                scale: 100,
                b2bFocus: 60
            }
        },
        cloudwalk: {
            name: 'CloudWalk',
            category: 'Fintech',
            keyword: 'Infraestrutura',
            valuation: 2150,
            color: '#1e40af',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 95,
                platform: 35,
                recurring: 70,
                scale: 100,
                b2bFocus: 75
            }
        },
        neon: {
            name: 'Neon',
            category: 'Fintech',
            keyword: 'Simplicidade',
            valuation: 1380,
            color: '#00ff88',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 65,
                platform: 20,
                recurring: 85,
                scale: 100,
                b2bFocus: 25
            }
        },
        dock: {
            name: 'Dock',
            category: 'Fintech',
            keyword: 'Fintech-as-Service',
            valuation: 1500,
            color: '#6366f1',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 85,
                platform: 90,
                recurring: 75,
                scale: 100,
                b2bFocus: 100
            }
        },
        bitso: {
            name: 'Bitso',
            category: 'Fintech',
            keyword: 'Blockchain',
            valuation: 2200,
            color: '#00d4ff',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 85,
                recurring: 45,
                scale: 100,
                b2bFocus: 55
            }
        },
        clip: {
            name: 'Clip',
            category: 'Fintech',
            keyword: 'Mobilidade',
            valuation: 2000,
            color: '#ff4081',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 65,
                platform: 35,
                recurring: 40,
                scale: 100,
                b2bFocus: 75
            }
        },
        clara: {
            name: 'Clara',
            category: 'Fintech',
            keyword: 'Eficiência',
            valuation: 1000,
            color: '#8b5cf6',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 20,
                recurring: 85,
                scale: 100,
                b2bFocus: 85
            }
        },
        lifemiles: {
            name: 'LifeMiles',
            category: 'Ecomm',
            keyword: 'Loyalty',
            valuation: 1150,
            color: '#dc2626',
            country: 'CO',
            ipo: false,
            coordinates: {
                tech: 40,
                platform: 70,
                recurring: 60,
                scale: 100,
                b2bFocus: 30
            }
        },
        uala: {
            name: 'Ualá',
            category: 'Fintech',
            keyword: 'Inclusão',
            valuation: 2810,
            color: '#00bcd4',
            country: 'AR',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 45,
                recurring: 70,
                scale: 100,
                b2bFocus: 25
            }
        },
        globant: {
            name: 'Globant',
            category: 'Serviços',
            keyword: 'Inovação',
            valuation: 8000,
            color: '#84cc16',
            country: 'AR',
            ipo: true,
            coordinates: {
                tech: 85,
                platform: 20,
                recurring: 55,
                scale: 100,
                b2bFocus: 95
            }
        },
        notco: {
            name: 'NotCo',
            category: 'Serviços',
            keyword: 'Sustentabilidade',
            valuation: 1500,
            color: '#22c55e',
            country: 'CL',
            ipo: false,
            coordinates: {
                tech: 90,
                platform: 35,
                recurring: 45,
                scale: 100,
                b2bFocus: 60
            }
        },
        betterfly: {
            name: 'Betterfly',
            category: 'Insurtech',
            keyword: 'Propósito',
            valuation: 1000,
            color: '#f59e0b',
            country: 'CL',
            ipo: false,
            coordinates: {
                tech: 45,
                platform: 15,
                recurring: 85,
                scale: 100,
                b2bFocus: 75
            }
        },
        unico: {
            name: 'Unico',
            category: 'Fintech',
            keyword: 'Identidade',
            valuation: 2500,
            color: '#ef4444',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 90,
                platform: 20,
                recurring: 90,
                scale: 100,
                b2bFocus: 95
            }
        },
        loft: {
            name: 'Loft',
            category: 'Proptech',
            keyword: 'Transformação',
            valuation: 2900,
            color: '#6366f1',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 60,
                platform: 80,
                recurring: 40,
                scale: 100,
                b2bFocus: 70
            }
        },
        mercado_bitcoin: {
            name: 'Mercado Bitcoin',
            category: 'Fintech',
            keyword: 'Criptomoedas',
            valuation: 2100,
            color: '#1e40af',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 15,
                recurring: 35,
                scale: 100,
                b2bFocus: 10
            }
        },
        kushki: {
            name: 'Kushki',
            category: 'Fintech',
            keyword: 'Infraestrutura',
            valuation: 1500,
            color: '#fcba03',
            country: 'EC',
            ipo: false,
            coordinates: {
                tech: 65,
                platform: 35,
                recurring: 45,
                scale: 100,
                b2bFocus: 85
            }
        },
        olist: {
            name: 'Olist',
            category: 'Ecomm',
            keyword: 'Marketplace',
            valuation: 1200,
            color: '#3b82f6',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 50,
                platform: 85,
                recurring: 70,
                scale: 100,
                b2bFocus: 55
            }
        },
        plata: {
            name: 'Plata',
            category: 'Fintech',
            keyword: 'Pagamentos',
            valuation: 1500,
            color: '#a855f7',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 85,
                platform: 15,
                recurring: 75,
                scale: 100,
                b2bFocus: 5
            }
        },
        prisma: {
            name: 'Prisma',
            category: 'Fintech',
            keyword: 'Pagamentos',
            valuation: 1400,
            color: '#2c6ebc',
            country: 'AR',
            ipo: false,
            coordinates: {
                tech: 65,
                platform: 85,
                recurring: 45,
                scale: 100,
                b2bFocus: 70
            }
        },
        konfio: {
            name: 'Konfio',
            category: 'Fintech',
            keyword: 'Crédito',
            valuation: 1100,
            color: '#10b981',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 80,
                platform: 40,
                recurring: 60,
                scale: 100,
                b2bFocus: 85
            }
        },
        incode: {
            name: 'Incode',
            category: 'Fintech',
            keyword: 'Biometria',
            valuation: 1200,
            color: '#8b5cf6',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 95,
                platform: 15,
                recurring: 85,
                scale: 100,
                b2bFocus: 100
            }
        },
        merama: {
            name: 'Merama',
            category: 'Ecomm',
            keyword: 'Aceleração',
            valuation: 1100,
            color: '#ef4444',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 45,
                platform: 20,
                recurring: 75,
                scale: 100,
                b2bFocus: 40
            }
        },
        stori: {
            name: 'Stori',
            category: 'Fintech',
            keyword: 'Crédito',
            valuation: 1050,
            color: '#f97316',
            country: 'MX',
            ipo: false,
            coordinates: {
                tech: 70,
                platform: 10,
                recurring: 90,
                scale: 100,
                b2bFocus: 5
            }
        },
        nowports: {
            name: 'Nowports',
            category: 'Logtech',
            keyword: 'Logística',
            valuation: 1100,
            color: '#22c55e',
            country: 'CO',
            ipo: false,
            coordinates: {
                tech: 75,
                platform: 20,
                recurring: 60,
                scale: 100,
                b2bFocus: 95
            }
        },
        habi: {
            name: 'Habi',
            category: 'Proptech',
            keyword: 'Imóveis',
            valuation: 1100,
            color: '#10b981',
            country: 'CO',
            ipo: false,
            coordinates: {
                tech: 70,
                platform: 55,
                recurring: 25,
                scale: 100,
                b2bFocus: 20
            }
        },
        madeiramadeira: {
            name: 'MadeiraMadeira',
            category: 'Ecomm',
            keyword: 'Atacado',
            valuation: 1300,
            color: '#22c55e',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 55,
                platform: 85,
                recurring: 40,
                scale: 100,
                b2bFocus: 5
            }
        },
        movile: {
            name: 'Movile',
            category: 'Serviços',
            keyword: 'Holding',
            valuation: 1500,
            color: '#f97316',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 42,
                platform: 68,
                recurring: 52,
                scale: 100,
                b2bFocus: 32
            }
        },
        qitech: {
            name: 'QI Tech',
            category: 'Proptech',
            keyword: 'Aluguel',
            valuation: 1000,
            color: '#4f46e5',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 87,
                platform: 23,
                recurring: 83,
                scale: 100,
                b2bFocus: 93
            }
        },
        fretecom: {
            name: 'Frete.com',
            category: 'Logtech',
            keyword: 'Frete',
            valuation: 1000,
            color: '#22c55e',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 53,
                platform: 88,
                recurring: 63,
                scale: 100,
                b2bFocus: 83
            }
        },
        hotmart: {
            name: 'Hotmart',
            category: 'Ecomm',
            keyword: 'Conteúdo',
            valuation: 1200,
            color: '#f97316',
            country: 'BR',
            ipo: false,
            coordinates: {
                tech: 65,
                platform: 85,
                recurring: 45,
                scale: 100,
                b2bFocus: 25
            }
        },

        // EX-UNICÓRNIOS (FIZERAM IPO)
        mercadolibre: {
            name: 'MercadoLibre',
            category: 'Ecomm',
            keyword: 'Ecossistema',
            valuation: 80000,
            color: '#FFC107',
            country: 'AR',
            ipo: true, // IPO em 2007
            coordinates: {
                tech: 90,
                platform: 95,
                recurring: 70,
                scale: 100,
                b2bFocus: 15
            }
        },
        stoneco: {
            name: 'Stone Co.',
            category: 'Fintech',
            keyword: 'Empoderamento',
            valuation: 15000,
            color: '#4ade80',
            country: 'BR',
            ipo: true, // IPO em 2018
            coordinates: {
                tech: 55,
                platform: 35,
                recurring: 65,
                scale: 100,
                b2bFocus: 75
            }
        },
        pagseguro: {
            name: 'PagSeguro',
            category: 'Fintech',
            keyword: 'Acessibilidade',
            valuation: 12000,
            color: '#3b82f6',
            country: 'BR',
            ipo: true, // IPO em 2018
            coordinates: {
                tech: 75,
                platform: 35,
                recurring: 85,
                scale: 100,
                b2bFocus: 40
            }
        },
        dlocal: {
            name: 'dLocal',
            category: 'Fintech',
            keyword: 'Localização',
            valuation: 12000,
            color: '#00BCD4',
            country: 'UY',
            ipo: true, // IPO em 2021
            coordinates: {
                tech: 85,
                platform: 70,
                recurring: 70,
                scale: 100,
                b2bFocus: 95
            }
        },
        vtex: {
            name: 'VTEX',
            category: 'Ecomm',
            keyword: 'Modularidade',
            valuation: 4100,
            color: '#FF5722',
            country: 'BR',
            ipo: true, // IPO em 2021
            coordinates: {
                tech: 90,
                platform: 85,
                recurring: 95,
                scale: 100,
                b2bFocus: 85
            }
        }
    },

    // Países disponíveis para filtro
    countries: {
    BR: { name: 'Brasil', flag: '🇧🇷' },
    AR: { name: 'Argentina', flag: '🇦🇷' },
    CL: { name: 'Chile', flag: '🇨🇱' },
    CO: { name: 'Colômbia', flag: '🇨🇴' },
    EC: { name: 'Equador', flag: '🇪🇨' },
    MX: { name: 'México', flag: '🇲🇽' },
    UY: { name: 'Uruguai', flag: '🇺🇾' }
},

    // Categorias únicas (setores) para filtro
    getCategories() {
        const categories = new Set();
        Object.values(this.unicorns).forEach(unicorn => {
            categories.add(unicorn.category);
        });
        return Array.from(categories).sort();
    },

    // Configurações de visualização
    visualization: {
        sphereSize: {
            min: 0.3,
            max: 0.8,
            valuationScale: 0.00001 // escala para converter valuation em tamanho
        },
        colors: {
            soller: '#ffffffff',
            grid: 'rgba(255,255,255,0.1)',
            axes: 'rgba(255,255,255,0.3)',
            connection: 'rgba(167,139,250,0.2)',
            highlight: '#fbbf24',
            optimal: '#22c55e'
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutCubic'
        }
    },

    // Benchmarks e métricas alvo
    benchmarks: {
        unicornThreshold: 1000, // milhões USD
        growthRate: {
            minimum: 40,
            target: 80,
            exceptional: 120
        },
        margins: {
            service: 15,
            hybrid: 25,
            saas: 35,
            marketplace: 20
        },
        retention: {
            poor: 70,
            good: 85,
            excellent: 95
        }
    },

    // Mapeamento de toggles para dimensões
    toggleMapping: {
        crmImplementation: {
            tech: 5,
            platform: 2,
            scale: 3
        },
        salesAutomation: {
            tech: 8,
            recurring: 3,
            scale: 5
        },
        customerSuccessTeam: {
            recurring: 10,
            b2bFocus: 5
        },
        marketplaceBeta: {
            platform: 15,
            tech: 5,
            scale: 8
        },
        selfServicePlatform: {
            tech: 10,
            platform: 8,
            recurring: 5
        },
        mobileApp: {
            tech: 7,
            scale: 10,
            b2bFocus: -5
        },
        microinfluencersProgram: {
            scale: 12,
            platform: 5,
            b2bFocus: -8
        },
        marketplaceFull: {
            platform: 25,
            tech: 10,
            recurring: 8,
            scale: 15
        },
        saasRevenue: {
            recurring: 30,
            tech: 12,
            b2bFocus: 10
        },
        internationalExpansion: {
            scale: 35,
            tech: 5,
            platform: 8
        }
    }
};