// TEXTO QUE SERÁ REPRODUZIDO - MODIFIQUE AQUI!
const textoParaReproduzir = `
    Olá! Este é um exemplo de texto que será reproduzido automaticamente pelo navegador. 
    Você pode modificar este texto aqui no código JavaScript. A tecnologia de síntese de voz 
    permite que o computador leia qualquer texto em voz alta. É muito útil para 
    acessibilidade e para criar experiências interativas na web.
`;

// Elementos do DOM
const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnStop = document.getElementById('btnStop');
const status = document.getElementById('status');
const velocidadeInput = document.getElementById('velocidade');
const tomInput = document.getElementById('tom');
const volumeInput = document.getElementById('volume');
const vozSelect = document.getElementById('vozSelect');
const textoElemento = document.getElementById('textoParaReproduzir');

// Atualizar o texto no HTML
textoElemento.textContent = textoParaReproduzir;

// Criar objeto de síntese de voz
const synth = window.speechSynthesis;
let utterance = null;
let vozes = [];

// Carregar vozes disponíveis
function carregarVozes() {
    vozes = synth.getVoices();
    vozSelect.innerHTML = '';

    // Filtrar vozes em português primeiro
    const vozesPortugues = vozes.filter(voz => voz.lang.startsWith('pt'));
    const outrasVozes = vozes.filter(voz => !voz.lang.startsWith('pt'));

    // Adicionar vozes em português
    if (vozesPortugues.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'Português';
        vozesPortugues.forEach((voz, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voz.name} (${voz.lang})`;
            optgroup.appendChild(option);
        });
        vozSelect.appendChild(optgroup);
    }

    // Adicionar outras vozes
    if (outrasVozes.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'Outros idiomas';
        outrasVozes.forEach((voz, index) => {
            const option = document.createElement('option');
            option.value = vozes.indexOf(voz);
            option.textContent = `${voz.name} (${voz.lang})`;
            optgroup.appendChild(option);
        });
        vozSelect.appendChild(optgroup);
    }
}

// Carregar vozes quando estiverem disponíveis
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = carregarVozes;
}
carregarVozes();

// Função para reproduzir o texto
function reproduzir() {
    // Cancelar qualquer reprodução anterior
    synth.cancel();

    // Criar nova instância de utterance
    utterance = new SpeechSynthesisUtterance(textoParaReproduzir);

    // Configurar parâmetros
    utterance.rate = parseFloat(velocidadeInput.value);
    utterance.pitch = parseFloat(tomInput.value);
    utterance.volume = parseFloat(volumeInput.value);

    // Definir voz selecionada
    if (vozes.length > 0) {
        utterance.voice = vozes[vozSelect.value];
    }

    // Event listeners
    utterance.onstart = function() {
        status.textContent = '🔊 Reproduzindo...';
        btnPlay.disabled = true;
        btnPause.disabled = false;
        btnStop.disabled = false;
    };

    utterance.onend = function() {
        status.textContent = '✅ Reprodução concluída';
        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = true;
    };

    utterance.onerror = function(event) {
        status.textContent = '❌ Erro na reprodução';
        console.error('Erro:', event);
        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = true;
    };

    // Iniciar reprodução
    synth.speak(utterance);
}

// Função para pausar
function pausar() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        status.textContent = '⏸️ Pausado';
        btnPause.textContent = '▶️ Continuar';
    } else if (synth.paused) {
        synth.resume();
        status.textContent = '🔊 Reproduzindo...';
        btnPause.textContent = '⏸️ Pausar';
    }
}

// Função para parar
function parar() {
    synth.cancel();
    status.textContent = '⏹️ Parado';
    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;
    btnPause.textContent = '⏸️ Pausar';
}

// Event listeners dos botões
btnPlay.addEventListener('click', reproduzir);
btnPause.addEventListener('click', pausar);
btnStop.addEventListener('click', parar);

// Atualizar displays dos valores
velocidadeInput.addEventListener('input', function() {
    document.getElementById('velocidadeValue').textContent = this.value + 'x';
});

tomInput.addEventListener('input', function() {
    document.getElementById('tomValue').textContent = this.value;
});

volumeInput.addEventListener('input', function() {
    document.getElementById('volumeValue').textContent = Math.round(this.value * 100) + '%';
});
