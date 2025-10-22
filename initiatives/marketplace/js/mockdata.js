// REPLACE_WITH_REAL_API: Este arquivo contém dados mockados para o protótipo
const mockData = {
    company: {
        id: 'comp_001',
        name: 'TechCorp Brasil',
        logo: 'TC',
        plan: 'Premium',
        industry: 'Tecnologia',
        cnpj: '12.345.678/0001-90',
        website: 'www.techcorp.com.br',
        createdAt: '2023-01-15',
        budget: {
            monthly: 50000,
            spent: 32500,
            available: 17500
        },
        team: [
            { id: 1, name: 'Carlos Silva', role: 'CMO', email: 'carlos@techcorp.com' },
            { id: 2, name: 'Ana Santos', role: 'Marketing Manager', email: 'ana@techcorp.com' }
        ]
    },

    stats: {
        proposals: {
            sent: 8,
            pending: 3,
            approved: 2,
            rejected: 1,
            in_review: 2,
            growth: 12
        },
        campaigns: {
            active: 5,
            completed: 18,
            scheduled: 3,
            totalROI: 4.3
        },
        influencers: {
            total: 48,
            active: 15,
            ambassadors: 3,
            avgEngagement: 3.8
        },
        investment: {
            month: 45000,
            quarter: 180000,
            year: 720000,
            estimatedReturn: 103000
        }
    },

    proposals: [
        {
            id: 'prop_001',
            influencer: {
                id: 1,
                name: 'Marina Silva',
                handle: '@marinasilva',
                avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                followers: 285000,
                engagement: 4.2,
                categories: ['Fashion', 'Lifestyle']
            },
            campaign: 'Lançamento Produto X',
            value: 5000,
            status: 'pending',
            createdAt: '2025-01-08T14:30:00',
            deliverables: ['3 posts feed', '10 stories', '1 reels'],
            estimatedReach: 180000,
            negotiation: {
                originalValue: 6000,
                discount: 16.67,
                messages: 3
            }
        },
        {
            id: 'prop_002',
            influencer: {
                id: 2,
                name: 'João Costa',
                handle: '@joaocosta',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                followers: 420000,
                engagement: 3.5,
                categories: ['Tech', 'Business']
            },
            campaign: 'Campanha Verão 2025',
            value: 8500,
            status: 'in_review',
            createdAt: '2025-01-07T10:15:00',
            deliverables: ['5 posts feed', '20 stories', '2 reels', '1 IGTV'],
            estimatedReach: 350000,
            negotiation: {
                originalValue: 9000,
                discount: 5.56,
                messages: 2
            }
        },
        {
            id: 'prop_003',
            influencer: {
                id: 3,
                name: 'Ana Santos',
                handle: '@anasantos',
                avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                followers: 180000,
                engagement: 5.1,
                categories: ['Beauty', 'Wellness']
            },
            campaign: 'Black Friday 2024',
            value: 12000,
            status: 'approved',
            createdAt: '2024-11-15T16:20:00',
            deliverables: ['8 posts feed', '30 stories', '4 reels'],
            estimatedReach: 520000,
            negotiation: {
                originalValue: 14000,
                discount: 14.3,
                messages: 4
            },
            performance: {
                actualReach: 580000,
                engagement: 5.8,
                conversions: 342,
                roi: 4.2
            }
        },
        {
            id: 'prop_004',
            influencer: {
                id: 4,
                name: 'Pedro Henrique',
                handle: '@pedrofit',
                avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
                followers: 95000,
                engagement: 6.2,
                categories: ['Fitness', 'Health']
            },
            campaign: 'Produto Fitness Q1',
            value: 3500,
            status: 'pending',
            createdAt: '2025-01-08T09:00:00',
            deliverables: ['2 posts feed', '15 stories'],
            estimatedReach: 75000,
            negotiation: null
        },
        {
            id: 'prop_005',
            influencer: {
                id: 5,
                name: 'Carla Dias',
                handle: '@carladias',
                avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
                followers: 620000,
                engagement: 2.8,
                categories: ['Travel', 'Lifestyle']
            },
            campaign: 'Destino Verão',
            value: 15000,
            status: 'rejected',
            createdAt: '2025-01-05T11:30:00',
            deliverables: ['10 posts feed', '50 stories', '5 reels'],
            estimatedReach: 600000,
            rejectionReason: 'Valores fora do orçamento',
            negotiation: {
                originalValue: 18000,
                discount: 16.67,
                messages: 5
            }
        },
        {
            id: 'prop_006',
            influencer: {
                id: 6,
                name: 'Lucas Martins',
                handle: '@lucasmartins',
                avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
                followers: 120000,
                engagement: 5.5,
                categories: ['Lifestyle', 'Finances']
            },
            campaign: 'Campanha de Educação Financeira',
            value: 4000,
            status: 'in_review',
            createdAt: '2025-01-09T09:00:00',
            deliverables: ['2 posts feed', '10 stories', '1 reels'],
            estimatedReach: 90000,
            negotiation: null
        },
        {
            id: 'prop_007',
            influencer: {
                id: 7,
                name: 'Juliana Rocha',
                handle: '@julianarocha',
                avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
                followers: 750000,
                engagement: 3.1,
                categories: ['Fashion', 'Beauty']
            },
            campaign: 'Lançamento Produto X',
            value: 18000,
            status: 'approved',
            createdAt: '2025-01-09T10:00:00',
            deliverables: ['4 posts feed', '20 stories', '2 reels'],
            estimatedReach: 800000,
            negotiation: {
                originalValue: 20000,
                discount: 10,
                messages: 2
            }
        },
        {
            id: 'prop_008',
            influencer: {
                id: 8,
                name: 'Gustavo Santos',
                handle: '@guzsantoss',
                avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
                followers: 55000,
                engagement: 7.2,
                categories: ['Food', 'Travel']
            },
            campaign: 'Festival de Inverno',
            value: 2500,
            status: 'pending',
            createdAt: '2025-01-09T11:00:00',
            deliverables: ['3 posts feed', '15 stories'],
            estimatedReach: 45000,
            negotiation: null
        }
    ],

    campaigns: [
        {
            id: 'camp_001',
            name: 'Lançamento Produto X',
            status: 'active',
            startDate: '2025-01-01',
            endDate: '2025-01-31',
            budget: 25000,
            spent: 15000,
            influencers: [
                { id: 1, name: 'Marina Silva', status: 'active', delivered: 60 },
                { id: 3, name: 'Ana Santos', status: 'active', delivered: 40 },
                { id: 6, name: 'Lucas Martins', status: 'pending', delivered: 0 }
            ],
            deliverables: {
                total: 50,
                completed: 25,
                inProgress: 10,
                scheduled: 15
            },
            performance: {
                reach: 850000,
                impressions: 2100000,
                engagement: 4.2,
                clicks: 18500,
                conversions: 342,
                roi: 3.8
            },
            topContent: [
                { type: 'reels', influencer: 'Marina Silva', views: 120000, engagement: 8.5 },
                { type: 'post', influencer: 'Ana Santos', views: 85000, engagement: 6.2 }
            ]
        },
        {
            id: 'camp_002',
            name: 'Campanha Verão 2025',
            status: 'scheduled',
            startDate: '2025-02-01',
            endDate: '2025-03-31',
            budget: 50000,
            spent: 0,
            influencers: [
                { id: 2, name: 'João Costa', status: 'confirmed', delivered: 0 },
                { id: 4, name: 'Pedro Henrique', status: 'negotiating', delivered: 0 }
            ],
            deliverables: {
                total: 80,
                completed: 0,
                inProgress: 0,
                scheduled: 80
            }
        },
        {
            id: 'camp_003',
            name: 'Black Friday 2024',
            status: 'completed',
            startDate: '2024-11-20',
            endDate: '2024-11-30',
            budget: 35000,
            spent: 32000,
            influencers: [
                { id: 3, name: 'Ana Santos', status: 'completed', delivered: 100 },
                { id: 7, name: 'Roberto Lima', status: 'completed', delivered: 100 },
                { id: 8, name: 'Juliana Rocha', status: 'completed', delivered: 100 }
            ],
            deliverables: {
                total: 120,
                completed: 120,
                inProgress: 0,
                scheduled: 0
            },
            performance: {
                reach: 2500000,
                impressions: 6800000,
                engagement: 5.1,
                clicks: 125000,
                conversions: 3420,
                roi: 5.2,
                revenue: 166400
            }
        }
    ],

    influencers: [
        {
            id: 1,
            name: 'Marina Silva',
            handle: '@marinasilva',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            followers: 285000,
            engagement: 4.2,
            categories: ['Fashion', 'Lifestyle'],
            location: 'São Paulo, SP',
            matchScore: 92,
            avgPrice: 5000,
            responseTime: '2h',
            completionRate: 98,
            pastCampaigns: 3,
            totalInvested: 15000,
            avgROI: 4.1,
            status: 'active',
            tier: 'gold'
        },
        {
            id: 2,
            name: 'João Costa',
            handle: '@joaocosta',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            followers: 420000,
            engagement: 3.5,
            categories: ['Tech', 'Business'],
            location: 'Rio de Janeiro, RJ',
            matchScore: 85,
            avgPrice: 8500,
            responseTime: '6h',
            completionRate: 95,
            pastCampaigns: 1,
            totalInvested: 8500,
            avgROI: 3.2,
            status: 'invited',
            tier: 'silver'
        },
        {
            id: 3,
            name: 'Ana Santos',
            handle: '@anasantos',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            followers: 180000,
            engagement: 5.1,
            categories: ['Beauty', 'Wellness'],
            location: 'São Paulo, SP',
            matchScore: 88,
            avgPrice: 12000,
            responseTime: '1h',
            completionRate: 100,
            pastCampaigns: 5,
            totalInvested: 48000,
            avgROI: 4.8,
            status: 'active',
            tier: 'platinum'
        }
    ],

    analytics: {
        overview: {
            totalReach: 8500000,
            totalImpressions: 24000000,
            avgEngagement: 4.3,
            totalClicks: 320000,
            totalConversions: 5420,
            totalRevenue: 850000,
            avgROI: 4.2
        },
        monthly: [
            { month: 'Jan', reach: 850000, engagement: 4.2, roi: 3.8 },
            { month: 'Fev', reach: 920000, engagement: 4.5, roi: 4.1 },
            { month: 'Mar', reach: 1100000, engagement: 4.8, roi: 4.5 },
            { month: 'Abr', reach: 980000, engagement: 4.3, roi: 4.0 },
            { month: 'Mai', reach: 1250000, engagement: 5.1, roi: 4.8 },
            { month: 'Jun', reach: 1400000, engagement: 5.3, roi: 5.2 }
        ],
        byCategory: [
            { category: 'Fashion', campaigns: 12, investment: 180000, roi: 4.5 },
            { category: 'Beauty', campaigns: 8, investment: 120000, roi: 5.1 },
            { category: 'Tech', campaigns: 5, investment: 85000, roi: 3.8 },
            { category: 'Lifestyle', campaigns: 10, investment: 150000, roi: 4.2 }
        ],
        topPerformers: [
            { influencer: 'Ana Santos', campaigns: 5, totalReach: 2800000, avgROI: 4.8 },
            { influencer: 'Marina Silva', campaigns: 3, totalReach: 1500000, avgROI: 4.1 },
            { influencer: 'Roberto Lima', campaigns: 4, totalReach: 2200000, avgROI: 3.9 }
        ],
        contentPerformance: [
            { type: 'Reels', count: 45, avgViews: 125000, avgEngagement: 8.2 },
            { type: 'Posts', count: 120, avgViews: 45000, avgEngagement: 4.5 },
            { type: 'Stories', count: 380, avgViews: 25000, avgEngagement: 3.8 },
            { type: 'IGTV', count: 15, avgViews: 65000, avgEngagement: 5.1 }
        ]
    },

    notifications: [
        { id: 1, type: 'proposal', message: 'Nova proposta de @marinasilva', time: '5 min', unread: true },
        { id: 2, type: 'campaign', message: 'Campanha "Verão 2025" aprovada', time: '1h', unread: true },
        { id: 3, type: 'delivery', message: '@anasantos publicou novo conteúdo', time: '2h', unread: false },
        { id: 4, type: 'alert', message: 'Orçamento mensal atingindo 80%', time: '1 dia', unread: false }
    ],

    activities: [
        { id: 1, type: 'proposal_sent', title: 'Proposta enviada', description: 'Para @newinfluencer', time: '10 min' },
        { id: 2, type: 'content_approved', title: 'Conteúdo aprovado', description: 'Reels de @marinasilva', time: '1h' },
        { id: 3, type: 'campaign_started', title: 'Campanha iniciada', description: 'Lançamento Produto X', time: '3h' },
        { id: 4, type: 'milestone', title: 'Marco atingido', description: '1M de alcance na campanha', time: '1 dia' }
    ]
};

// REPLACE_WITH_REAL_API: Substituir por chamadas API reais
window.mockData = mockData;