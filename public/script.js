/**
 * ============================================================================
 * ROLETA DA SORTE - JAVASCRIPT
 * Arquivo: script.js
 * ============================================================================
 */

// ============================================================================
// VARIÁVEIS GLOBAIS
// ============================================================================
let tentativas = 0;
let countdownTime = 159; // 2:39 em segundos
let countdownInterval;

// ============================================================================
// FUNÇÕES DA ROLETA
// ============================================================================

/**
 * Função principal para girar a roleta
 */
function girarRoleta() {
    const roleta = document.getElementById('roleta');
    const som = document.getElementById('roletaSom');
    let anguloFinal = 0;
    let tempoGiro = 0;
    
    tentativas++;

    // Define ângulo e tempo baseado na tentativa
    if (tentativas === 1) {
        anguloFinal = 285 + 16 * 360;
        tempoGiro = 9;
    } else if (tentativas === 2) {
        anguloFinal = 320 + 24 * 360;
        tempoGiro = 8;
    } else {
        // Caso exceda as tentativas, retorna
        return;
    }

    // Reproduz o som
    playRoletaSound(som);
    
    // Aplica a rotação
    applyRotation(roleta, anguloFinal, tempoGiro);
    
    // Desabilita o botão durante o giro
    toggleGirarButton(true);
    
    // Controla o fade do som
    fadeOutSound(som, tempoGiro);
    
    // Mostra o popup após o giro
    setTimeout(() => {
        som.pause();
        setTimeout(showPopUp, 500);
    }, tempoGiro * 1000);
}

/**
 * Reproduz o som da roleta
 * @param {HTMLAudioElement} som - Elemento de áudio
 */
function playRoletaSound(som) {
    som.currentTime = 0;
    som.volume = 1;
    som.play().catch(error => {
        console.log('Erro ao reproduzir som:', error);
    });
}

/**
 * Aplica a rotação na roleta
 * @param {HTMLElement} roleta - Elemento da roleta
 * @param {number} angulo - Ângulo final
 * @param {number} tempo - Tempo de duração
 */
function applyRotation(roleta, angulo, tempo) {
    roleta.style.transition = `transform ${tempo}s cubic-bezier(0.1, 0.8, 0.3, 1)`;
    roleta.style.transform = `rotate(${angulo}deg)`;
}

/**
 * Controla o fade out do som
 * @param {HTMLAudioElement} som - Elemento de áudio
 * @param {number} tempoGiro - Tempo total do giro
 */
function fadeOutSound(som, tempoGiro) {
    let steps = 40;
    let delay = (tempoGiro * 1000) / steps;
    let stepCount = 0;

    const volumeFade = setInterval(() => {
        if (stepCount >= steps) {
            clearInterval(volumeFade);
        } else {
            som.volume = Math.max(0, 1 - stepCount / steps);
            stepCount++;
        }
    }, delay);
}

/**
 * Habilita/desabilita o botão girar
 * @param {boolean} disabled - Estado do botão
 */
function toggleGirarButton(disabled) {
    const botao = document.getElementById('girarBtn');
    botao.disabled = disabled;
}

// ============================================================================
// FUNÇÕES DO POPUP
// ============================================================================

/**
 * Mostra o popup com o resultado
 */
function showPopUp() {
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popupText');
    const botaoGirar = document.getElementById('girarNovamente');
    const botaoRegistro = document.getElementById('popupButton');
    
    let texto = "";

    if (tentativas === 1) {
        // Primeira tentativa - não ganhou
        texto = generateFirstAttemptText();
        botaoGirar.style.display = "inline-block";
        botaoRegistro.style.display = "none";
    } else if (tentativas === 2) {
        // Segunda tentativa - ganhou
        texto = generateSecondAttemptText();
        botaoGirar.style.display = "none";
        botaoRegistro.style.display = "inline-block";
        
        // Toca som de vitória e confetes
        playVictoryEffects();
    }

    popupText.innerHTML = texto;
    popup.style.display = 'block';
    
    // Adiciona animação de entrada
    setTimeout(() => {
        popup.style.opacity = '1';
    }, 10);
}

/**
 * Gera texto para primeira tentativa
 * @returns {string} Texto do popup
 */
function generateFirstAttemptText() {
    return `
        ❌ Não foi dessa vez!<br>
        Você tem mais 1 chance.<br>
        Clique no botão abaixo e gire novamente!
    `;
}

/**
 * Gera texto para segunda tentativa
 * @returns {string} Texto do popup
 */
function generateSecondAttemptText() {
    return "🤙 Parabéns! Você ganhou <b>5.000 Meticais</b>!<br><br>"
        + "Para receber, registre-se na plataforma clicando no botão abaixo e <b>deposite 20 ou 50 Meticais</b> para que possamos confirmar seu número e enviar o valor.<br><br>"
        + "⚠️ <b>O prêmio só será entregue para quem criar uma nova conta na plataforma.</b><br>"
        + "Se já possui uma conta, é necessário criar uma nova para receber o valor na sua carteira móvel!";
}


/**
 * Reproduz efeitos de vitória
 */
function playVictoryEffects() {
    // Som de vitória
    const victory = document.getElementById('victorySom');
    victory.currentTime = 0;
    victory.play().catch(error => {
        console.log('Erro ao reproduzir som de vitória:', error);
    });

    // Confetes
    startConfetti();
}

/**
 * Fecha o popup e gira novamente
 */
function fecharPopUpEGirar() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    toggleGirarButton(false);
    girarRoleta();
}

// ============================================================================
// FUNÇÕES DE EFEITOS VISUAIS
// ============================================================================

/**
 * Inicia animação de confetes
 */
function startConfetti() {
    if (typeof confetti === 'undefined') {
        console.log('Biblioteca de confetes não carregada');
        return;
    }

    const duration = 3 * 1000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({ 
            particleCount: 5, 
            angle: 60, 
            spread: 55, 
            origin: { x: 0 } 
        });
        confetti({ 
            particleCount: 5, 
            angle: 120, 
            spread: 55, 
            origin: { x: 1 } 
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// ============================================================================
// FUNÇÕES DO COUNTDOWN
// ============================================================================

/**
 * Atualiza o countdown timer
 */
function updateCountdown() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (minutesElement && secondsElement) {
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    if (countdownTime > 0) {
        countdownTime--;
    } else {
        // Reinicia o countdown
        countdownTime = 159;
    }
}

/**
 * Inicia o countdown timer
 */
function initCountdown() {
    // Atualiza imediatamente
    updateCountdown();
    
    // Atualiza a cada segundo
    countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Para o countdown timer
 */
function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// ============================================================================
// FUNÇÕES DE COMPARTILHAMENTO
// ============================================================================

/**
 * Copia texto para área de transferência
 */
function copyText() {
    const copyText = document.getElementById("shareText");
    
    if (!copyText) {
        console.error('Elemento shareText não encontrado');
        return;
    }
    
    try {
        copyText.select();
        copyText.setSelectionRange(0, 99999); // Para dispositivos móveis
        
        // Tenta usar a API moderna primeiro
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(copyText.value).then(() => {
                showCopySuccess();
            }).catch(() => {
                // Fallback para método antigo
                fallbackCopyText(copyText);
            });
        } else {
            // Fallback para método antigo
            fallbackCopyText(copyText);
        }
    } catch (error) {
        console.error('Erro ao copiar texto:', error);
        alert("Erro ao copiar texto. Tente selecionar e copiar manualmente.");
    }
}

/**
 * Método fallback para copiar texto
 * @param {HTMLInputElement} element - Elemento de input
 */
function fallbackCopyText(element) {
    try {
        document.execCommand("copy");
        showCopySuccess();
    } catch (error) {
        console.error('Fallback copy failed:', error);
        alert("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    }
}

/**
 * Mostra mensagem de sucesso ao copiar
 */
function showCopySuccess() {
    alert("Mensagem copiada! Agora cole no WhatsApp ou SMS.");
}

// ============================================================================
// SISTEMA DE PROTEÇÃO
// ============================================================================

/**
 * Bloqueia menu de contexto (botão direito)
 */
function blockContextMenu() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
}

/**
 * Bloqueia teclas de atalho
 */
function blockKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Lista de combinações bloqueadas
        const blockedKeys = [
            // Ctrl + C, U, S, A
            (e.ctrlKey && ['c', 'u', 's', 'a'].includes(e.key.toLowerCase())),
            // F12
            (e.key === 'F12'),
            // Ctrl + Shift + I
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i'),
            // Ctrl + Shift + J
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j'),
            // Ctrl + Shift + K
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')
        ];

        if (blockedKeys.some(condition => condition)) {
            e.preventDefault();
            alert("Ação bloqueada!");
            return false;
        }
    });
}

/**
 * Inicializa sistema de proteção
 */
function initProtection() {
    blockContextMenu();
    blockKeyboardShortcuts();
}

// ============================================================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================================================

/**
 * Inicializa todos os componentes quando o DOM estiver carregado
 */
function initializeApp() {
    console.log('Inicializando aplicação...');
    
    // Inicia countdown
    initCountdown();
    
    // Inicia sistema de proteção
    initProtection();
    
    // Verifica se elementos existem
    checkRequiredElements();
    
    console.log('Aplicação inicializada com sucesso!');
}

/**
 * Verifica se elementos obrigatórios existem
 */
function checkRequiredElements() {
    const requiredElements = [
        'roleta',
        'girarBtn',
        'popup',
        'popupText',
        'roletaSom'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Elementos não encontrados:', missingElements);
    }
}

/**
 * Função de limpeza quando a página for fechada
 */
function cleanup() {
    stopCountdown();
    
    // Para todos os áudios
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Inicializa quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeApp);

// Limpeza quando página for fechada
window.addEventListener('beforeunload', cleanup);

// Listener para visibilidade da página
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Página ficou oculta - para áudios
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => audio.pause());
    }
});

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Formata número com separador de milhares
 * @param {number} num - Número para formatar
 * @returns {string} Número formatado
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Gera número aleatório entre min e max
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatório
 */
 
 (function() {
    // URL real em Base64
    const urlCodificada = "aHR0cHM6Ly9yb2xldGEuYXZpYW16LmNvbS9wbGF5LnBocA=="; 
    
    // Decodifica Base64 → URL real
    const urlReal = atob(urlCodificada);

    // Verifica se a URL atual é igual à URL real
    if (window.location.href !== urlReal) {
        document.body.innerHTML = "<h2 style='color:red; text-align:center; margin-top:20%;'>fale com DLSM hacker</h2>";
        throw new Error("Estas fudido");
    }
})();
 
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debounce para funções
 * @param {Function} func - Função para debounce
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
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