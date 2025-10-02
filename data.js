// ULTIMO data.js - Dados completos do Dashboard Executivo Soller Group
// Última atualização: 21 de Julho de 2025

// Declaração única do objeto SollerData com TODOS os dados
const SollerData = {
    // Metadados e configurações
    metadata: {
        lastUpdate: '2025-07-21',
        currentDate: new Date('2025-07-21'),
        dataSource: 'Análise completa de dados até Julho/2025'
    },

    // Links para fontes de dados
    dataSources: {
        aggregatedData: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/Eb3i8mhVbwdImMwhfGrSZWoBi2u1iF9h3FXBcU26Idx6gw?e=KtrLG0",
        averageTicket: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/ETip6UxX0TZNmFTly12zXoIBChKrL7ZGv65ulb9-MJ01ew?e=vSzbFO",
        ticketMedio: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/Ea116t3n9PxJmUbAw6S0eZwBjZAKvp4Ts3rWVNLeuSVtFw?e=7HblNN",
        churnAnalysis: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/EW5cDcJhC_1Drq8Z4v9uijUBFfcLbO6xVqtNme9aTyjw8A?e=rFSdgV",
        cicloVenda: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/EWMP6uVnr9tCnmrcMO9MxncBnb_I_5qeT5sHTyOpgyH0Vw?e=bVAwgV",
        contratosFormalizados: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/Eec3hRJVV-JDpFDOgtifXBABUQVn2veUw_48Bx_vO6cUHg?e=A28jVw",
        crescimentoGMV: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/ERjMVRJ3rstGpxxn0NSs6wgBoIBIsf0wPCJRrzVnbVc7oA?e=m2hJKk",
        firstDeal: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/EYtRzplFYodAjf8wjvykoUABVyHVKPY-Ie6zEH9sHTwX5w?e=q8QMII",
        margemAgencia: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/ET7i5VUpQEFFkcrBlC7T36YBO1Y_KJkS4RXeue43f-s8MQ?e=aEjOvd",
        topNichos: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/ER7PAFpnOgNLnKgb8lY4rsoB-mBZqp7ud44rUTjGxdAC5Q?e=CIDgE1",
        top61Influencers: "https://isabelasoller-my.sharepoint.com/:x:/g/personal/bruno_figueiredo_gruposoller_com_br/EU4Mbp6c5fFItb90HUpN1FoBhvRkIuof-7nzfxEohPTCbQ?e=ncweQS"
    },

    // KPIs Principais
    kpis: {
        churnRate: {
            value: 74.9,
            period: '12 meses',
            details: '679 de 906 marcas',
            trend: 'down',
            status: 'critical'
        },
        churnRate3Months: {
            value: 70.9,
            period: '3 meses',
            details: '249 de 351 marcas'
        },
        acquisitionRate: {
            current: 17,
            peak2023: 61,
            decline: -72,
            unit: 'empresas/mês',
            trend: 'down',
            status: 'warning'
        },
        averageMargin: {
            value: 23,
            withoutAgency: 25,
            withAgency: 13,
            difference: 48,
            unit: '%',
            trend: 'stable',
            status: 'success'
        },
        concentration: {
            top61: 89.06,
            revenue: 6465157,
            totalInfluencers: 305,
            trend: 'risk',
            status: 'info'
        }
    },

    // GMV Histórico
    gmv: {
        total: 52072945.44,
        averageTicket: 17888.34,
        totalTrades: 2911,
        paymentDistribution: {
            cash: 71.1,
            installments: 29.9
        },
        labels: [
            '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
            '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
            '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
            '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
            '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
            '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'
        ],
        values: [
    // 2023
    212100, 285100, 1159082.24, 2062489.96, 1821293, 1320000,
    1578399.5, 1881172.28, 1370504.61, 805412.5, 1187256.75, 2403479.99,
    // 2024
    1115433.65, 1123254.84, 1122250, 1607239, 1624775, 1709113.33,
    1635470.65, 1986742.3, 1585550.02, 2019521.65, 2068804.88, 2309449.4,
    // 2025
    2257375.98, 2607915.45, 2239703.33, 2284695.93, 2473741.14, 3433297.418,
    2870545.95, 0, 0, 0, 0, 0
],
values2: [
        // 2023
        46300, 56477.74, 237709.028, 372247.98, 345344.4, 220999,
        351881.9, 420381.964, 290389.5, 205671.1, 243227.16, 471475.974,
        // 2024
        248923.398, 243045.088, 212881, 288482.22, 341035.74, 377427.6055,
        411953, 351539.9, 382525.0012, 407293.53, 412715.29, 390969.6868,
        // 2025 (dados reais até agosto, projeções depois)
        443538.66, 552197.738, 527452.86, 558588.394, 543182.21, 667244.2756,
        598682.416, 3600, 0, 0, 0, 0
    ],

    values3: [
        // 2023
    21.80, 19.80, 20.50, 18.00, 19.00, 16.70,
    22.30, 22.30, 21.20, 25.50, 20.50, 19.60,
    // 2024
    22.30, 21.60, 19.00, 17.90, 21.00, 22.10,
    25.20, 17.70, 24.10, 20.20, 19.90, 16.90,
    // 2025 (dados reais até agosto, projeções depois)
    19.60, 21.20, 23.60, 24.40, 22.00, 19.40,
    20.90, 0.00, 0.00, 0.00, 0.00, 0.00
    ],

        monthly: {
            // 2023
            '2023-01': { value: 200000, trades: 4, ticket: 20000 },
            '2023-02': { value: 300000, trades: 10, ticket: 12000 },
            '2023-03': { value: 1200000, trades: 25, ticket: 15200 },
            '2023-04': { value: 2100000, trades: 30, ticket: 14000 },
            '2023-05': { value: 1800000, trades: 35, ticket: 12857 },
            '2023-06': { value: 1300000, trades: 40, ticket: 13000 },
            '2023-07': { value: 1400000, trades: 42, ticket: 13095 },
            '2023-08': { value: 1600000, trades: 38, ticket: 13947 },
            '2023-09': { value: 1400000, trades: 35, ticket: 14000 },
            '2023-10': { value: 800000, trades: 36, ticket: 14167 },
            '2023-11': { value: 1200000, trades: 34, ticket: 14118 },
            '2023-12': { value: 2400000, trades: 32, ticket: 14063 },
            // 2024
            '2024-01': { value: 1100000, trades: 35, ticket: 14857 },
            '2024-02': { value: 1100000, trades: 33, ticket: 14848 },
            '2024-03': { value: 1100000, trades: 37, ticket: 14865 },
            '2024-04': { value: 1600000, trades: 38, ticket: 15263 },
            '2024-05': { value: 1600000, trades: 35, ticket: 15143 },
            '2024-06': { value: 1700000, trades: 36, ticket: 15000 },
            '2024-07': { value: 1600000, trades: 37, ticket: 15135 },
            '2024-08': { value: 1900000, trades: 39, ticket: 15128 },
            '2024-09': { value: 1500000, trades: 36, ticket: 15278 },
            '2024-10': { value: 2000000, trades: 42, ticket: 16190 },
            '2024-11': { value: 2000000, trades: 40, ticket: 15500 },
            '2024-12': { value: 2300000, trades: 38, ticket: 15526 },
            // 2025 (até julho)
            '2025-01': { value: 2300000, trades: 35, ticket: 16571 },
            '2025-02': { value: 2600000, trades: 37, ticket: 16757 },
            '2025-03': { value: 2400000, trades: 38, ticket: 17105 },
            '2025-04': { value: 2300000, trades: 40, ticket: 17000 },
            '2025-05': { value: 2500000, trades: 42, ticket: 17143 },
            '2025-06': { value: 3300000, trades: 44, ticket: 17045 },
            '2025-07': { value: 2800000, trades: 41, ticket: 17073 }
        }
    },

    // Contratos Formalizados
    contracts: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        data: {
            2023: [3, 9, 30, 96, 136, 99, 76, 87, 64, 76, 86, 51],
            2024: [48, 51, 67, 66, 67, 84, 79, 84, 90, 119, 100, 119],
            2025: [82, 96, 111, 129, 142, 116, 109, null, null, null, null, null]

        },
        monthly: {
            // 2023
            '2023-01': 27, '2023-02': 41, '2023-03': 55, '2023-04': 66, '2023-05': 58, '2023-06': 97,
            '2023-07': 75, '2023-08': 88, '2023-09': 69, '2023-10': 73, '2023-11': 71, '2023-12': 37,
            // 2024
            '2024-01': 27, '2024-02': 41, '2024-03': 55, '2024-04': 66, '2024-05': 58, '2024-06': 54,
            '2024-07': 62, '2024-08': 70, '2024-09': 71, '2024-10': 96, '2024-11': 76, '2024-12': 73,
            // 2025
            '2025-01': 48, '2025-02': 54, '2025-03': 57, '2025-04': 87, '2025-05': 100, '2025-06': 74,
            '2025-07': 85
        },
        averages: {
            2023: 78.5,
            2024: 62.4,
            2025: 72.1
        }
    },

    // Origem dos Leads
    leadSource: {
        distribution: {
            inbound: { percentage: 59, count: 1776 },
            outbound: { percentage: 41, count: 1215 }
        },
        byCoordinator: {
            'Paula': { inbound: 52, outbound: 48, total: 1033 },
            'Ana Brito': { inbound: 61, outbound: 39, total: 821 },
            'Kath': { inbound: 58, outbound: 42, total: 634 },
            'Rebecca': { inbound: 37, outbound: 63, total: 423 }
        },
        strategy: {
            inbound: {
                strengths: ['Liderando conversões'],
                weaknesses: [
                    'Sem blog ativo',
                    'Sem newsletter estruturada',
                    'Website com tráfego baixo',
                    'Sem cases indexados'
                ]
            },
            outbound: {
                strengths: ['48% do pipeline'],
                weaknesses: [
                    'Sem cadências automatizadas',
                    'Sem ABM estruturado',
                    'Personalização manual',
                    'RD Station em implementação'
                ]
            }
        }
    },

    // Margens e Performance
    margins: {
        average: 23,
        byType: {
            withoutAgency: 25,
            withAgency: 13
        },
        topInfluencers: [
            { name: 'Carol Leite', margin: 30.0, thirdParty: 0, status: 'optimal' },
            { name: 'Saide Mattar', margin: 28.5, thirdParty: 0, status: 'optimal' },
            { name: 'Gabriela Morais', margin: 21.4, thirdParty: 0, status: 'good' },
            { name: 'Camila Monteiro', margin: 20.9, thirdParty: 0, status: 'good' },
            { name: 'Petala Barreiros', margin: 20.4, thirdParty: 0, status: 'good' },
            { name: 'Marcello Novaes', margin: 20.0, thirdParty: 16.0, status: 'review' },
            { name: 'Bruna Cardoso', margin: 10.0, thirdParty: 10.0, status: 'critical' }
        ],
        byAgency: [
            { name: 'Canal A', negotiations: 39, avgMargin: 15.4, status: 'critical' },
            { name: 'BR MEDIA', negotiations: 25, avgMargin: 18.0, status: 'review' },
            { name: 'AGENCIA PAR', negotiations: 18, avgMargin: 9.8, status: 'critical' },
            { name: 'AGÊNCIA AMAR', negotiations: 15, avgMargin: 11.2, status: 'critical' },
            { name: 'MALU BORGES', negotiations: 12, avgMargin: 13.5, status: 'critical' }
        ]
    },

    // Dados das agências do Excel
    agencies: [
        {
            "name": "3C",
            "contracts": 4,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 150000.0
        },
        {
            "name": "4 PILLARS",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 2800.0
        },
        {
            "name": "AFRICA",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.0,
            "totalValue": 138000.0
        },
        {
            "name": "AGENCIA FH",
            "contracts": 1,
            "avgMargin": 18.95,
            "avgMarginSoller": 4.76,
            "totalValue": 95000.0
        },
        {
            "name": "AGENCIA PAR",
            "contracts": 28,
            "avgMargin": 9.86,
            "avgMarginSoller": 10.64,
            "totalValue": 195900.0
        },
        {
            "name": "AIR",
            "contracts": 9,
            "avgMargin": 0.0,
            "avgMarginSoller": 19.11,
            "totalValue": 201800.0
        },
        {
            "name": "ANMA",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 3200.0
        },
        {
            "name": "AR PROPAGANDA",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 5000.0
        },
        {
            "name": "AWIN",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.8,
            "totalValue": 5043.29
        },
        {
            "name": "BANCA DIGITAL",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 19500.0
        },
        {
            "name": "BARBARA",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 15000.0
        },
        {
            "name": "BASE",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 6000.0
        },
        {
            "name": "BCW",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 16.0,
            "totalValue": 80000.0
        },
        {
            "name": "BIANCA",
            "contracts": 2,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 20000.0
        },
        {
            "name": "BLUES",
            "contracts": 1,
            "avgMargin": 20.0,
            "avgMarginSoller": 20.0,
            "totalValue": 7000.0
        },
        {
            "name": "BM NEG DIGITAIS",
            "contracts": 3,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 13000.0
        },
        {
            "name": "BORA ASSESSORIA",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 28300.0
        },
        {
            "name": "BR INFLUENCIADORES",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 40000.0
        },
        {
            "name": "BR MEDIA",
            "contracts": 30,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.87,
            "totalValue": 848000.0
        },
        {
            "name": "BROCCO PUBLICIDADE",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 40000.0
        },
        {
            "name": "BT ARTS",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 250000.0
        },
        {
            "name": "BW DIGITAL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 1500.0
        },
        {
            "name": "B-YOUNG",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.0,
            "totalValue": 20000.0
        },
        {
            "name": "CANAL A",
            "contracts": 53,
            "avgMargin": 9.84,
            "avgMarginSoller": 14.22,
            "totalValue": 295600.0
        },
        {
            "name": "CARA DE CONTE£DO",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 64000.0
        },
        {
            "name": "CELEBRYTS",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 11.0,
            "totalValue": 122500.0
        },
        {
            "name": "CELY",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 30000.0
        },
        {
            "name": "COND",
            "contracts": 1,
            "avgMargin": 5.55,
            "avgMarginSoller": 5.55,
            "totalValue": 30000.0
        },
        {
            "name": "CONECTADA",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 13500.0
        },
        {
            "name": "COOLAB",
            "contracts": 5,
            "avgMargin": 5.2,
            "avgMarginSoller": 18.0,
            "totalValue": 38500.0
        },
        {
            "name": "CREATIVE CONNECTION",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 30.0,
            "totalValue": 5500.0
        },
        {
            "name": "CROSSNETWORKING",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 11666.0
        },
        {
            "name": "DAY",
            "contracts": 2,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 13000.0
        },
        {
            "name": "DENY",
            "contracts": 2,
            "avgMargin": 10.0,
            "avgMarginSoller": 20.0,
            "totalValue": 17000.0
        },
        {
            "name": "DIGITAL SOCIAL BR",
            "contracts": 1,
            "avgMargin": 20.0,
            "avgMarginSoller": 20.0,
            "totalValue": 12000.0
        },
        {
            "name": "DM9",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.0,
            "totalValue": 25000.0
        },
        {
            "name": "DOJO",
            "contracts": 5,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 146000.0
        },
        {
            "name": "DONNA AG",
            "contracts": 1,
            "avgMargin": 10.94,
            "avgMarginSoller": 10.94,
            "totalValue": 10666.67
        },
        {
            "name": "DP BRANDING",
            "contracts": 3,
            "avgMargin": 6.67,
            "avgMarginSoller": 18.67,
            "totalValue": 36331.66
        },
        {
            "name": "DUOAG",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 15000.0
        },
        {
            "name": "EM2",
            "contracts": 1,
            "avgMargin": 15.95,
            "avgMarginSoller": 20.0,
            "totalValue": 4200.0
        },
        {
            "name": "ENSINA DIGITAL",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 7500.0
        },
        {
            "name": "FAROL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 26000.0
        },
        {
            "name": "FERNANDA RIBAS MANAGEMENTS",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 27000.0
        },
        {
            "name": "FHITS",
            "contracts": 12,
            "avgMargin": 0.0,
            "avgMarginSoller": 22.5,
            "totalValue": 201032.47
        },
        {
            "name": "FIZZ",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 22.5,
            "totalValue": 23566.67
        },
        {
            "name": "FRI.TO",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 46.0,
            "totalValue": 56000.0
        },
        {
            "name": "FSB PUBLICIDADE",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 9000.0
        },
        {
            "name": "GABRIEL COLABONE",
            "contracts": 1,
            "avgMargin": 10.31,
            "avgMarginSoller": 10.31,
            "totalValue": 10500.0
        },
        {
            "name": "GALERIA ESTRATEGIA",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 34000.0
        },
        {
            "name": "GLOBO",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 70000.0
        },
        {
            "name": "GOTT DIGITAL",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 4166.96
        },
        {
            "name": "GRAPA DIGITAL",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 24725.0
        },
        {
            "name": "GRAVITY ROAD",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 7000.0
        },
        {
            "name": "GRUPO INPRESS",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 44000.0
        },
        {
            "name": "GRUPO RAI",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 12000.0
        },
        {
            "name": "HAKU",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 8000.0
        },
        {
            "name": "HIGHFY",
            "contracts": 5,
            "avgMargin": 8.02,
            "avgMarginSoller": 16.82,
            "totalValue": 59333.33
        },
        {
            "name": "HINOVA",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 5600.0
        },
        {
            "name": "ICONIC",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 17600.0
        },
        {
            "name": "IDEAL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 3000.0
        },
        {
            "name": "IGOR",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 6666.66
        },
        {
            "name": "INDEX",
            "contracts": 1,
            "avgMargin": 16.67,
            "avgMarginSoller": 16.67,
            "totalValue": 36000.0
        },
        {
            "name": "INFLUU",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 40000.0
        },
        {
            "name": "INNOCEAN",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 30.0,
            "totalValue": 28000.0
        },
        {
            "name": "INTERTALENT",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 6500.0
        },
        {
            "name": "IWM DIGITAL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 14000.0
        },
        {
            "name": "JOCO",
            "contracts": 2,
            "avgMargin": 100.0,
            "avgMarginSoller": 0.0,
            "totalValue": 1000.0
        },
        {
            "name": "JOTACOM",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 10.0,
            "totalValue": 100000.0
        },
        {
            "name": "JUICY TEC",
            "contracts": 7,
            "avgMargin": 0.0,
            "avgMarginSoller": 30.52,
            "totalValue": 71750.0
        },
        {
            "name": "KAIZEN",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 6000.0
        },
        {
            "name": "KATCHUM",
            "contracts": 5,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 109500.0
        },
        {
            "name": "LEBLON",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 10.0,
            "totalValue": 30000.0
        },
        {
            "name": "LETS",
            "contracts": 1,
            "avgMargin": 8.06,
            "avgMarginSoller": 8.06,
            "totalValue": 23333.33
        },
        {
            "name": "LOI",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 23.5,
            "totalValue": 62500.0
        },
        {
            "name": "LTK",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 1200.0
        },
        {
            "name": "LUCIANA BORTMAN",
            "contracts": 3,
            "avgMargin": 12.55,
            "avgMarginSoller": 12.55,
            "totalValue": 24500.0
        },
        {
            "name": "MARINA CARNEIRO",
            "contracts": 6,
            "avgMargin": 8.33,
            "avgMarginSoller": 11.67,
            "totalValue": 25966.67
        },
        {
            "name": "MESS",
            "contracts": 2,
            "avgMargin": 20.0,
            "avgMarginSoller": 20.0,
            "totalValue": 8250.0
        },
        {
            "name": "MFIELD",
            "contracts": 6,
            "avgMargin": 5.96,
            "avgMarginSoller": 18.19,
            "totalValue": 272000.0
        },
        {
            "name": "MIS INFLUENCIA",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 8500.0
        },
        {
            "name": "MOOD MKT",
            "contracts": 7,
            "avgMargin": 7.14,
            "avgMarginSoller": 11.71,
            "totalValue": 80500.0
        },
        {
            "name": "MULTIFATO",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 15.0,
            "totalValue": 24000.0
        },
        {
            "name": "MUTATO",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 24000.0
        },
        {
            "name": "MYND",
            "contracts": 7,
            "avgMargin": 0.0,
            "avgMarginSoller": 16.1,
            "totalValue": 192250.0
        },
        {
            "name": "MZ CREATORS",
            "contracts": 6,
            "avgMargin": 5.44,
            "avgMarginSoller": 14.69,
            "totalValue": 71700.0
        },
        {
            "name": "NETCOS",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 10000.0
        },
        {
            "name": "NXT STEP",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 7500.0
        },
        {
            "name": "PHYGITAL",
            "contracts": 3,
            "avgMargin": 6.67,
            "avgMarginSoller": 10.0,
            "totalValue": 8000.0
        },
        {
            "name": "PLATINUM",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 10.0,
            "totalValue": 40000.0
        },
        {
            "name": "PLAY9",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 120000.0
        },
        {
            "name": "PLIC ASSESSORIA",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 38000.0
        },
        {
            "name": "POP",
            "contracts": 36,
            "avgMargin": 9.91,
            "avgMarginSoller": 11.77,
            "totalValue": 376850.0
        },
        {
            "name": "PROS",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 10.0,
            "totalValue": 138000.0
        },
        {
            "name": "PUBLIKA",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 15000.0
        },
        {
            "name": "PUBLINATION",
            "contracts": 19,
            "avgMargin": 0.0,
            "avgMarginSoller": 19.89,
            "totalValue": 283500.0
        },
        {
            "name": "PULLSE COMUNICACO",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 30.0,
            "totalValue": 20000.0
        },
        {
            "name": "REWARDSTYLE MIDIA DIGITAL LTDA",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 8500.0
        },
        {
            "name": "ROBERTA",
            "contracts": 2,
            "avgMargin": 10.0,
            "avgMarginSoller": 55.0,
            "totalValue": 11500.0
        },
        {
            "name": "SCOPE",
            "contracts": 4,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 4500.0
        },
        {
            "name": "SIADE",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 30000.0
        },
        {
            "name": "SNACK",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 25000.0
        },
        {
            "name": "SOCIAL TAILORS",
            "contracts": 6,
            "avgMargin": 0.0,
            "avgMarginSoller": 14.67,
            "totalValue": 229500.0
        },
        {
            "name": "SOKO",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 16.0,
            "totalValue": 47000.0
        },
        {
            "name": "SOMA",
            "contracts": 8,
            "avgMargin": 7.09,
            "avgMarginSoller": 13.58,
            "totalValue": 60480.0
        },
        {
            "name": "SOOUL MEDIA",
            "contracts": 2,
            "avgMargin": 16.36,
            "avgMarginSoller": 18.18,
            "totalValue": 22000.0
        },
        {
            "name": "SPARK",
            "contracts": 14,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.14,
            "totalValue": 868200.0
        },
        {
            "name": "SQUID",
            "contracts": 13,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.62,
            "totalValue": 241550.0
        },
        {
            "name": "SUBA",
            "contracts": 9,
            "avgMargin": 0.0,
            "avgMarginSoller": 14.44,
            "totalValue": 281000.0
        },
        {
            "name": "SUPERSONICA",
            "contracts": 3,
            "avgMargin": 16.21,
            "avgMarginSoller": 18.98,
            "totalValue": 130000.0
        },
        {
            "name": "TAKE1",
            "contracts": 3,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 72000.0
        },
        {
            "name": "TEIA",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 6500.0
        },
        {
            "name": "THE BUZZ NOW",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 15000.0
        },
        {
            "name": "THE INSIDERS BRASIL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 2400.0
        },
        {
            "name": "THE OTHER WAY",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 22500.0
        },
        {
            "name": "TISE",
            "contracts": 1,
            "avgMargin": 10.0,
            "avgMarginSoller": 10.0,
            "totalValue": 3500.0
        },
        {
            "name": "TK1",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 31000.0
        },
        {
            "name": "TMKRS",
            "contracts": 2,
            "avgMargin": 0.0,
            "avgMarginSoller": 19.21,
            "totalValue": 126000.0
        },
        {
            "name": "TR¢PIX",
            "contracts": 3,
            "avgMargin": 6.67,
            "avgMarginSoller": 13.33,
            "totalValue": 36900.0
        },
        {
            "name": "TWO",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 12500.0
        },
        {
            "name": "VERO",
            "contracts": 2,
            "avgMargin": 21.93,
            "avgMarginSoller": 10.56,
            "totalValue": 65000.0
        },
        {
            "name": "VIBEZZ",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 12.0,
            "totalValue": 49000.0
        },
        {
            "name": "VOZ DIGITAL",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 18.0,
            "totalValue": 40000.0
        },
        {
            "name": "VP AGENCIAMENTO",
            "contracts": 3,
            "avgMargin": 9.87,
            "avgMarginSoller": 9.87,
            "totalValue": 28500.0
        },
        {
            "name": "WAKE",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 3000.0
        },
        {
            "name": "WAY STAR",
            "contracts": 1,
            "avgMargin": 16.0,
            "avgMarginSoller": 20.0,
            "totalValue": 175000.0
        },
        {
            "name": "YOGINI",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 5000.0
        },
        {
            "name": "ZERO 11",
            "contracts": 1,
            "avgMargin": 0.0,
            "avgMarginSoller": 20.0,
            "totalValue": 9000.0
        }
    ],

    // Top Performers
    topPerformers: {
        brands: [
            { name: 'AC BRAZIL', revenue: 487219 },
            { name: 'CIF', revenue: 199314 },
            { name: 'IWS', revenue: 194176 },
            { name: 'SUPERCOFFEE', revenue: 170000 },
            { name: 'GARDEN', revenue: 150000 }
        ],
        influencers: [
            { name: 'Aline Marquez', works: 144, revenue: 485000 },
            { name: 'Marcia Fernandes', works: 133, revenue: 442000 },
            { name: 'Gaby Santos', works: 85, revenue: 380000 },
            { name: 'Fabiana Xavier', works: 77, revenue: 295000 },
            { name: 'Luisa Mell', works: 72, revenue: 280000 }
        ]
    },

    // Nichos e Segmentos
    niches: {
  quarterly: {
    quarters: [
      'Q1 2023','Q2 2023','Q3 2023','Q4 2023',
      'Q1 2024','Q2 2024','Q3 2024','Q4 2024',
      'Q1 2025','Q2 2025'
    ],
    data: {
      moda : [2280, 123360, 94000, 115437.28, 67899.998, 151109.7875, 129560, 145745.5268, 52790.4, 253489.52],
      saude :    [5800, 18580, 82476, 57128, 41256.096, 51450, 62644, 82600, 128246, 88388],
      beleza :    [7000, 94678.4, 40000, 109756, 48400, 19596.6, 77950, 44700, 67300, 4600],
      acessorios :      [0, 0, 0, 0, 0, 0, 1800, 146865.25, 167575.534, 128230],
      alimentacao :   [45600, 22400, 70000, 72000, 0, 0, 49600, 39000, 15000, 36000]
    },
    data1: {
      moda : [2280, 123360, 94000, 115437.28, 67899.998, 151109.7875, 129560, 145745.5268, 52790.4, 253489.52],
      saude :    [0, 0, 0, 0, 0, 0, 1800, 146865.25, 167575.534, 128230],
      beleza :    [5800, 18580, 82476, 57128, 41256.096, 51450, 62644, 82600, 128246, 88388],
      acessorios :      [0, 0, 0, 0, 0, 0, 0, 13100, 32200, 125480],
      alimentacao :   [0, 0, 0, 0, 0, 0, 3000, 11300, 29200, 95980.01]
    },
    data2: {
      moda : [2280, 123360, 94000, 115437.28, 67899.998, 151109.7875, 129560, 145745.5268, 52790.4, 253489.52],
      saude :    [5800, 18580, 82476, 57128, 41256.096, 51450, 62644, 82600, 128246, 88388],
      beleza :    [7000, 94678.4, 40000, 109756, 48400, 19596.6, 77950, 44700, 67300, 4600],
      acessorios :      [0, 0, 0, 0, 0, 0, 1800, 146865.25, 167575.534, 128230],
      alimentacao :   [16417.74, 129000, 40600, 2800, 98428, 4428, 2952, 13028, 4676, 1600]
    },
    data3: {
      moda : [2280, 123360, 94000, 115437.28, 67899.998, 151109.7875, 129560, 145745.5268, 52790.4, 253489.52],
      saude :    [7000, 94678.4, 40000, 109756, 48400, 19596.6, 77950, 44700, 67300, 4600],
      beleza :    [45600, 22400, 70000, 72000, 0, 0, 49600, 39000, 15000, 36000],
      acessorios :      [16417.74, 129000, 40600, 2800, 98428, 4428, 2952, 13028, 4676, 1600],
      alimentacao :   [5800, 18580, 82476, 57128, 41256.096, 51450, 62644, 82600, 128246, 88388]
    },
    data4: {
      moda : [0, 0, 0, 0, 0, 0, 1800, 146865.25, 167575.534, 128230],
      saude :    [0, 0, 0, 0, 0, 0, 0, 13100, 32200, 125480],
      beleza :    [0, 0, 0, 0, 0, 0, 3000, 11300, 29200, 95980.01],
      acessorios :      [0, 0, 0, 0, 0, 0, 0, 1500, 47790.00198, 75178.046],
      alimentacao :   [5800, 18580, 82476, 57128, 41256.096, 51450, 62644, 82600, 128246, 88388]
    },
    data5: {
      moda : [0, 0, 0, 0, 0, 0, 0, 1500, 47790.00198, 75178.046],
      saude :    [0, 0, 0, 0, 0, 0, 700, 0, 0, 33600],
      beleza :    [0, 500, 0, 500, 0, 0, 0, 3600, 8700, 8250],
      acessorios :   [0, 0, 0, 0, 0, 0, 0, 13100, 32200, 125480],
      alimentacao :   [0, 0, 0, 0, 0, 0, 3000, 11300, 29200, 95980.01]
    },
    data6: {
      moda : [16417.74, 129000, 40600, 2800, 98428, 4428, 2952, 13028, 4676, 1600],
      saude :    [500, 11686, 15940, 13063, 12470, 11382, 8840, 2700, 0, 0],
      beleza :    [7000, 94678.4, 40000, 109756, 48400, 19596.6, 77950, 44700, 67300, 4600],
      acessorios :   [9000, 500, 22700, 16900, 15000, 15000, 7000, 8700, 350, 0],
      alimentacao :   [6300, 53600, 31960, 39720, 14500, 31923.44, 0, 0, 0, 0]
    },
    data7: {
      moda : [2333.2, 25399.98, 7566.4, 11000, 5000, 10300, 8520, 7940, 160, 280],
      saude :    [16417.74, 129000, 40600, 2800, 98428, 4428, 2952, 13028, 4676, 1600],
      beleza :    [5700, 31970, 20071, 6650, 1100, 27670, 12034, 900, 2750, 2500],
      acessorios :   [0, 0, 0, 0, 16800, 2550, 3000, 0, 0, 1800],
      alimentacao :   [12400, 8720, 6109.954, 5420, 26666.4, 2360, 0, 6400, 3000, 0]
    },
    data9: {
  casting_soller: [
    252580.132, 836257.38, 918005.91, 779710.38,
    546350.486, 559045.958, 691284, 858506.8068,
    852279.62, 1265856.669
  ],
  casting_total: [
    1122715.96, 4713867.96, 4176104.12, 3565767.23,
    2578633.49, 3079777.28, 3742230.65, 4621299.92,
    4202675.13, 6367969.568
  ],
  mailing_soller: [
    64656.636, 69719, 100262.454, 118563.854,
    110199, 361024.6, 255391.6012, 336879.2,
    441539.998, 236526.571
  ],
  mailing_total: [
    510316.28, 456500, 609587.27, 808266.87,
    734005, 1771775, 1265690.02, 1760866,
    2672949.99, 1529433.27
  ],
  mentoria_soller: [
    23250, 32615, 44385, 22100,
    48300, 86875, 199342.3, 15592.5,
    229369.64, 266631.59
  ],
  mentoria_total: [
    23250, 33415, 44385, 22100,
    48300, 89575, 199342.3, 15592.5,
    229369.64, 294331.59
  ]
}
  },
  top5: [
    { name: 'Moda', value: 1348346 },
    { name: 'Saúde', value: 868387 },
    { name: 'Beleza', value: 619117 },
    { name: 'Acessórios', value: 547730 },
    { name: 'Alimentação', value: 407563 }
  ]
},

    // Ciclo de Vendas
    salesCycle: {
        bySize: {
            small: {
                average: 24.6,
                median: 10,
                samples: 125,
                outliers: [
                    { company: 'Murau', days: 448 },
                    { company: 'Ponto Natural', days: 186 }
                ]
            },
            medium: {
                average: 37.3,
                median: 8,
                samples: 89,
                outliers: [
                    { company: 'Americanas', days: 247 },
                    { company: 'Centauro', days: 189 }
                ]
            },
            large: {
                average: 28.0,
                median: 13,
                samples: 45,
                outliers: [
                    { company: 'Discovery', days: 282 },
                    { company: 'Unilever', days: 156 }
                ]
            }
        },
        target: 15
    },

    // War Room Metrics
    warRoom: {
        initiatives: [
            {
                id: 'init_001',
                title: 'Virar a chave RD Station CRM - 100% operacional',
                description: 'Migração completa das assessoras para o CRM até final do mês',
                status: 'in-progress',
                priority: 'critical',
                category: 'tech',
                impact: 10,
                effort: 3,
                progress: 45,
                owner: 'Tech Team',
                phase: 'immediate'
            },
            {
                id: 'init_002',
                title: 'Integração RD Station ↔ Monday.com ↔ Omie',
                description: 'Pipeline completo: CRM → Gestão de Contratos → ERP Financeiro',
                status: 'not-started',
                priority: 'high',
                category: 'tech',
                impact: 9,
                effort: 4,
                progress: 0,
                owner: 'Tech + Finance',
                phase: 'immediate'
            },
            {
                id: 'init_003',
                title: 'Implementar D4Sign para contratos digitais',
                description: 'Automatizar assinatura de contratos com influencers e brands',
                status: 'not-started',
                priority: 'high',
                category: 'process',
                impact: 8,
                effort: 2,
                progress: 0,
                owner: 'Legal + Tech',
                phase: 'immediate'
            },
            {
                id: 'init_004',
                title: 'Programa Anti-Churn Intensivo',
                description: 'Reduzir churn de 75% para <50% em 6 meses através de CS dedicado',
                status: 'in-progress',
                priority: 'critical',
                category: 'cs',
                impact: 10,
                effort: 7,
                progress: 20,
                owner: 'CS Team',
                phase: 'immediate'
            },
            {
                id: 'init_005',
                title: 'WhatsApp Business API + Templates',
                description: 'Escalar comunicação 10x com templates aprovados',
                status: 'not-started',
                priority: 'high',
                category: 'tech',
                impact: 7,
                effort: 4,
                progress: 0,
                owner: 'Tech Team',
                phase: 'short'
            },
            {
                id: 'init_006',
                title: 'Portal Self-Service v2.0',
                description: 'MVP do portal para influenciadores com dashboard e métricas',
                status: 'not-started',
                priority: 'medium',
                category: 'product',
                impact: 8,
                effort: 6,
                progress: 0,
                owner: 'Product Team',
                phase: 'medium'
            },
            {
                id: 'init_007',
                title: 'Cadências de Vendas Automatizadas',
                description: 'Implementar sequências de follow-up e nutrição no RD Station',
                status: 'not-started',
                priority: 'high',
                category: 'process',
                impact: 8,
                effort: 3,
                progress: 0,
                owner: 'Sales Team',
                phase: 'immediate'
            },
            {
                id: 'init_008',
                title: 'Dashboard BI Real-time',
                description: 'Conectar todas as fontes de dados em dashboard unificado',
                status: 'in-progress',
                priority: 'high',
                category: 'data',
                impact: 9,
                effort: 5,
                progress: 30,
                owner: 'Data Team',
                phase: 'short'
            },
            {
                id: 'init_009',
                title: 'Programa Micro-Influencers',
                description: 'Diversificar portfólio para reduzir concentração de receita',
                status: 'not-started',
                priority: 'medium',
                category: 'strategic',
                impact: 7,
                effort: 6,
                progress: 0,
                owner: 'Marketing',
                phase: 'medium'
            },
            {
                id: 'init_010',
                title: 'Marketplace MVP',
                description: 'Primeira versão do marketplace de influenciadores',
                status: 'not-started',
                priority: 'high',
                category: 'product',
                impact: 10,
                effort: 9,
                progress: 0,
                owner: 'Product Team',
                phase: 'long'
            }
        ],
        metrics: {
            automation_rate: { current: 15, target: 70, unit: '%' },
            crm_adoption: { current: 45, target: 100, unit: '%' },
            data_quality: { current: 62, target: 95, unit: '%' },
            sales_cycle: { current: 26, target: 15, unit: 'dias' },
            retention_rate: { current: 25.1, target: 75, unit: '%' }
        }
    },

    // Tech Stack
    techStack: {
        current: [
            { name: 'Excel', status: 'manual', adoption: 100, category: 'Analytics' },
            { name: 'RD Station', status: 'implementing', category: 'CRM' },
            { name: 'Monday.com', status: 'implementing', adoption: 100, category: 'Project Management' },
            { name: 'D4Sign', status: 'active', adoption: 100, category: 'Communication', risk: '' },
            { name: 'Omie ERP', status: 'active', adoption: 100, category: 'Financial' }
        ],
        future: [
            { name: 'Azure Synapse', status: 'planned', quarter: 'Q3 2025', category: 'Data Lake' },
            { name: 'WhatsApp Business API', status: 'planned', quarter: 'Q3 2025', category: 'Communication' },
            { name: 'D4Sign', status: 'planned', quarter: 'Q3 2025', category: 'Legal' },
            { name: 'Twilio', status: 'planned', quarter: 'Q4 2025', category: 'Communication' },
            { name: 'Marketplace Platform', status: 'planned', quarter: 'Q1 2026', category: 'Product' }
        ]
    },

    // Projeções
    projections: {
        gmv: {
            // Projeções conservadoras-otimistas para o resto de 2025
            '2025-08': { value: 740000, trades: 43, ticket: 17209, projected: true },
            '2025-09': { value: 780000, trades: 45, ticket: 17333, projected: true },
            '2025-10': { value: 820000, trades: 47, ticket: 17447, projected: true },
            '2025-11': { value: 850000, trades: 49, ticket: 17347, projected: true },
            '2025-12': { value: 880000, trades: 51, ticket: 17255, projected: true }
        },
        contracts: {
            '2025-08': 90,
            '2025-09': 95,
            '2025-10': 100,
            '2025-11': 105,
            '2025-12': 110
        }
    }
};

// Função para gerar dados para gráficos
function prepareChartData() {
    const gmvMonths = [];
    const gmvValues = [];
    const ticketValues = [];
    
    // Preparar dados GMV - usar diretamente os arrays já preparados
    SollerData.gmv.labels.forEach((label, index) => {
        gmvMonths.push(label);
        gmvValues.push(SollerData.gmv.values[index]);
    });

    return {
        gmv: {
            labels: gmvMonths,
            values: gmvValues,
            tickets: ticketValues
        },
        contracts: {
            labels: SollerData.contracts.labels,
            data: SollerData.contracts.data
        }
    };
}

// Exportar dados globalmente - APENAS UMA VEZ no final do arquivo
window.SollerData = SollerData;
window.prepareChartData = prepareChartData;