document.addEventListener('DOMContentLoaded', function() {
    const recommendationContainer = document.querySelector('.recommendations-list');

    if (!recommendationContainer) {
        console.error('Container de recomendações não encontrado.');
        return;
    }

    const newRecommendation = document.createElement('div');
    newRecommendation.className = 'recommendation';

    // Estilo e conteúdo do novo container
    newRecommendation.innerHTML = `
        <div class="rec-number">6</div>
        <div class="rec-content" style="display: flex; flex-direction: column; width: 100%;">
            <h4>Transição para Product-Led Growth</h4>
            <p>
                Começar desenvolvimento do <a href="https://grupo-soller.github.io/marketplace-mvp/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">
                    Marketplace</a> em um MVP unidirecional focado em casting, pequenos influenciadores ou empresas.
                <a href="https://influencermarketinghub.com/micro-influencer-platform/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">
                    Matéria</a>
                e
                <a href="https://mis-app.com/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">Exemplo 1</a>,

                <a href="https://influency.me/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">2</a>,

                <a href="https://www.aspire.io/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">3</a>,
                <a href="https://wake.tech/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">4</a> e
                <a href="https://www.viralnation.com/" target="_blank" rel="noopener" style="color: #a78bfa; text-decoration: none;">5</a>.
            </p>
            <div id="marketplace-container" style="width: 100%; height: 800px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-top: 20px;">
                <iframe 
                    src="initiatives/marketplace/index.html" 
                    frameborder="0" 
                    style="width: 100%; height: 100%; display: block;"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;

    recommendationContainer.appendChild(newRecommendation);

    // Ajuste o margin-bottom do último item para evitar espaço em excesso
    const lastRec = recommendationContainer.querySelector('.recommendation:last-child');
    if (lastRec) {
         lastRec.style.marginBottom = '-12px';
    }
});
