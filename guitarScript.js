// Sons disponíveis para a guitarra
const sounds = [
    'assets/audio/g1.wav', // Primeiro som
    'assets/audio/g2.wav', // Segundo som
    'assets/audio/g3.wav'  // Terceiro som
];

// Função para reproduzir um som aleatório ao clicar na guitarra
function playRandomSound() {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(randomSound);
    audio.play();
}

// Função para movimentar a guitarra com física (aceleração e desaceleração)
let guitarContainer = document.getElementById('guitar-container');
let guitar = document.getElementById('guitar');

// Posicionar a guitarra inicialmente no centro
guitarContainer.style.left = window.innerWidth / 2 - guitar.offsetWidth / 2 + 'px';
guitarContainer.style.top = window.innerHeight / 2 - guitar.offsetHeight / 2 + 'px';

let isDragging = false;
let offsetX, offsetY;
let velocityX = 0, velocityY = 0;
let angle = 0; // Para controlar a rotação da guitarra
let acceleration = 0.2;  // Aceleração
let friction = 0.95;     // Desaceleração
let angularVelocity = 0; // Velocidade angular para rotação

// Adicionando evento de mouse pressionado (início do arraste)
guitar.addEventListener('mousedown', (e) => {
    isDragging = true;
    // Calculando a posição inicial do clique em relação à guitarra
    offsetX = e.clientX - guitarContainer.offsetLeft;
    offsetY = e.clientY - guitarContainer.offsetTop;

    // Função para mover a guitarra enquanto o mouse é arrastado
    function onMouseMove(event) {
        if (isDragging) {
            // Atualizando a posição da guitarra com o movimento do mouse
            let dx = event.clientX - guitarContainer.offsetLeft;
            let dy = event.clientY - guitarContainer.offsetTop;

            // Calcular o ângulo da guitarra em relação ao ponto de clique
            angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Atualizando a posição da guitarra
            guitarContainer.style.left = (event.clientX - offsetX) + 'px';
            guitarContainer.style.top = (event.clientY - offsetY) + 'px';

            // Rotacionando a guitarra de acordo com a direção do mouse
            guitarContainer.style.transform = `rotate(${angle}deg)`;
        }
    }

    // Função para parar o movimento de arraste quando o mouse é solto
    function onMouseUp(event) {
        isDragging = false;
        // Calculando a velocidade da guitarra quando é solta
        velocityX = (event.clientX - guitarContainer.offsetLeft) * 0.1;
        velocityY = (event.clientY - guitarContainer.offsetTop) * 0.1;

        // Calculando a velocidade angular quando soltar a guitarra
        angularVelocity = (event.clientX - guitarContainer.offsetLeft) * 0.1;

        // Remover os eventos de mousemove e mouseup
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Adicionando eventos de mousemove e mouseup
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Adicionando evento de clique para tocar som aleatório
guitar.addEventListener('click', playRandomSound);

// Função de física para mover a guitarra com aceleração, desaceleração e rotação
function applyPhysics() {
    if (!isDragging) {
        // Se a guitarra não estiver sendo arrastada, aplicar aceleração e desaceleração
        velocityX *= friction;
        velocityY *= friction;
        angularVelocity *= friction;

        // Atualizando a posição da guitarra com base na velocidade
        let newLeft = parseFloat(guitarContainer.style.left) + velocityX;
        let newTop = parseFloat(guitarContainer.style.top) + velocityY;

        // Limitar a posição para dentro dos limites da tela
        newLeft = Math.max(0, Math.min(window.innerWidth - guitar.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - guitar.offsetHeight, newTop));

        guitarContainer.style.left = newLeft + 'px';
        guitarContainer.style.top = newTop + 'px';

        // Atualizando a rotação com base na velocidade angular
        angle += angularVelocity;
        guitarContainer.style.transform = `rotate(${angle}deg)`;

        // Simulando a aceleração ao soltar o mouse
        velocityX += (Math.random() - 0.5) * acceleration;
        velocityY += (Math.random() - 0.5) * acceleration;
    }

    // Verificando se a guitarra saiu das bordas da tela e aplicando a física para "pingar" nas bordas
    if (parseFloat(guitarContainer.style.left) <= 0 || parseFloat(guitarContainer.style.left) + guitar.offsetWidth >= window.innerWidth) {
        velocityX *= -1; // Revertendo a direção
    }
    if (parseFloat(guitarContainer.style.top) <= 0 || parseFloat(guitarContainer.style.top) + guitar.offsetHeight >= window.innerHeight) {
        velocityY *= -1; // Revertendo a direção
    }

    // Continuar aplicando a física
    requestAnimationFrame(applyPhysics);
}

// Iniciar a física quando a página for carregada
applyPhysics();