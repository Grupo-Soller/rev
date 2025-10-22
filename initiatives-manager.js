/**
 * Initiatives Manager - Gerenciador de Iniciativas Estratégicas
 * Controla o carregamento e exibição das iniciativas em um container isolado usando iframes.
 */

document.addEventListener('DOMContentLoaded', function() {
    const initiatives = [
        { name: 'Banco Digital', file: 'initiatives/digital-bank.html' },
        { name: 'Calculadora ROI Real Time', file: 'initiatives/company-data-lab.html' },
        { name: 'Fanverse', file: 'initiatives/fanverse.html' },
        { name: 'Netflix dos Influencers', file: 'initiatives/influencer-netflix.html' },
        { name: 'SaaS para Agências', file: 'initiatives/agency-saas.html' },
        { name: 'Shopping Omnichannel', file: 'initiatives/influ-shop.html' },
        { name: 'Validador de Seguidores', file: 'initiatives/trust-followers-blockchain.html' }
    ];

    // Encontra a seção de estratégia para injetar a estrutura da recomendação 7
    const strategySection = document.getElementById('strategy');
    if (!strategySection) {
        console.error('Seção de estratégia não encontrada.');
        return;
    }

    const newDiv = document.createElement('div');
    newDiv.className = 'recommendation';
    newDiv.innerHTML = `
        <div class="rec-number">7</div>
        <div class="rec-content">
            <h4>Outros Potenciais Produtos Digitais</h4>
            <div id="niches-toggle-container" class="niches-toggle-container">
                </div>
            <div id="initiative-content" class="initiative-content">
                </div>
        </div>
    `;

    strategySection.appendChild(newDiv);

    const toggleContainer = newDiv.querySelector('#niches-toggle-container');
    const contentContainer = newDiv.querySelector('#initiative-content');

    function loadInitiative(file) {
        // Limpa o conteúdo anterior e cria um novo iframe
        contentContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', file);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'auto'); // Permite a barra de rolagem interna
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        contentContainer.appendChild(iframe);
    }

    // Cria e adiciona os botões das iniciativas
    initiatives.forEach(initiative => {
        const button = document.createElement('button');
        button.className = 'niches-toggle-btn';
        button.textContent = initiative.name;
        button.addEventListener('click', function() {
            toggleContainer.querySelectorAll('.niches-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            loadInitiative(initiative.file);
        });
        toggleContainer.appendChild(button);
    });

    // Carrega a primeira iniciativa por padrão
    if (initiatives.length > 0) {
        const firstButton = toggleContainer.querySelector('.niches-toggle-btn');
        if (firstButton) {
            firstButton.classList.add('active');
            loadInitiative(initiatives[0].file);
        }
    }
}); 