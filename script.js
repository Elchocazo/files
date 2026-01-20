// ESTADO
const state = {
    xp: 0,
    unlockedSteps: 1,
    tutorialInputs: 0,
    game2Score: 0,
    game3Timer: null,
    game3Time: 30,
    currentModule: 1
};

const filesData = [
    { name: 'Mi_Dibujo_de_Perrito', ext: '.jpg', clan: 'imagen', icon: 'image' },
    { name: 'Tarea_de_Historia', ext: '.doc', clan: 'texto', icon: 'description' },
    { name: 'Cancion_Favorita', ext: '.mp3', clan: 'audio', icon: 'audio_file' },
    { name: 'Video_de_Cumpleaños', ext: '.mp4', clan: 'video', icon: 'movie' },
    { name: 'Nota_de_Voz', ext: '.wav', clan: 'audio', icon: 'mic' },
    { name: 'Lista_de_Compras', ext: '.txt', clan: 'texto', icon: 'notes' },
    { name: 'Foto_de_Perú', ext: '.png', clan: 'imagen', icon: 'photo_library' },
    { name: 'Pelicula_Nueva', ext: '.avi', clan: 'video', icon: 'videocam' },
    { name: 'Libro_Divertido', ext: '.pdf', clan: 'texto', icon: 'menu_book' },
    { name: 'Meme_Gracioso', ext: '.gif', clan: 'imagen', icon: 'gif' }
];

// SONIDO
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
function playSfx(type) {
    if(type === 'correct') synth.triggerAttackRelease(["C4", "E4", "G4"], "8n");
    else if(type === 'wrong') synth.triggerAttackRelease(["C3", "Db3"], "4n");
    else if(type === 'win') synth.triggerAttackRelease(["F4", "A4", "C5", "E5"], "4n");
}

// NAVEGACIÓN
function loadModule(num) {
    if(num > state.unlockedSteps) return;
    
    state.currentModule = num;
    document.querySelectorAll('section > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(`module-${num}`).classList.remove('hidden');
    
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('nav-item-active'));
    document.getElementById(`nav-${num}`).classList.add('nav-item-active');

    if(num === 2) initModule2();
    if(num === 3) initModule3();
}

// MODULO 1: TUTORIAL
const tutNeeded = 9;
function checkTutorialInput(input, correct) {
    if(input.value.toLowerCase() === correct) {
        input.classList.remove('border-blue-300', 'border-pink-300', 'border-yellow-300', 'border-emerald-300');
        input.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
        input.disabled = true;
        state.tutorialInputs++;
        playSfx('correct');
        
        if(state.tutorialInputs >= tutNeeded) {
            const btn = document.getElementById('btn-tutorial-finish') || document.getElementById('btn-tutorial-next');
            btn.disabled = false;
            btn.classList.remove('bg-sky-200', 'text-sky-400', 'cursor-not-allowed');
            btn.classList.add('bg-sky-500', 'text-white', 'hover:bg-sky-600', 'shadow-lg');
            btn.onclick = () => {
                addXp(100);
                state.unlockedSteps = 2;
                loadModule(2);
            };
        }
    }
}

// MODULO 2: JUEGO ARRASTRAR
function initModule2() {
    state.game2Score = 0;
    updateScore2();
    nextItem2();
}

let currentItem2 = null;
function nextItem2() {
    currentItem2 = filesData[Math.floor(Math.random() * filesData.length)];
    document.getElementById('game-item-icon').innerText = currentItem2.icon;
    document.getElementById('game-item-name').innerText = currentItem2.name + currentItem2.ext;
    
    // Colores aleatorios para el icono para dinamismo
    const colors = ['text-blue-500', 'text-pink-500', 'text-yellow-500', 'text-emerald-500'];
    document.getElementById('game-item-icon').className = `material-symbols-outlined text-8xl ${colors[Math.floor(Math.random()*colors.length)]}`;
}

// Lógica Drag & Drop (Versión simplificada por clicks para accesibilidad en web)
document.querySelectorAll('.bucket').forEach(bucket => {
    bucket.onclick = () => {
        const clan = bucket.getAttribute('data-clan');
        if(clan === currentItem2.clan) {
            state.game2Score++;
            playSfx('correct');
            updateScore2();
            if(state.game2Score >= 10) {
                addXp(200);
                state.unlockedSteps = 3;
                alert("¡Excelente! Has clasificado todos los archivos.");
                loadModule(3);
            } else {
                nextItem2();
            }
        } else {
            playSfx('wrong');
            document.getElementById('game-item').classList.add('shake');
            setTimeout(() => document.getElementById('game-item').classList.remove('shake'), 500);
        }
    };
});

function updateScore2() {
    document.getElementById('game2-score').innerText = state.game2Score;
}

// MODULO 3: CARRERA
function initModule3() {
    state.game3Time = 30;
    document.getElementById('timer-box').innerText = "00:30";
    if(state.game3Timer) clearInterval(state.game3Timer);
    
    state.game3Timer = setInterval(() => {
        state.game3Time--;
        document.getElementById('timer-box').innerText = `00:${state.game3Time < 10 ? '0' : ''}${state.game3Time}`;
        if(state.game3Time <= 0) {
            clearInterval(state.game3Timer);
            alert("¡Tiempo terminado! ¡Lo hiciste muy bien!");
            location.reload();
        }
    }, 1000);
    
    nextItem3();
}

function nextItem3() {
    const item = filesData[Math.floor(Math.random() * filesData.length)];
    document.getElementById('quick-file-name').innerText = item.name;
    
    const optionsDiv = document.getElementById('quick-options');
    optionsDiv.innerHTML = '';
    
    // Crear opciones incluyendo la correcta
    const options = [item.ext];
    while(options.length < 4) {
        const randomExt = filesData[Math.floor(Math.random()*filesData.length)].ext;
        if(!options.includes(randomExt)) options.push(randomExt);
    }
    
    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-3xl font-black text-sky-700 hover:bg-sky-50";
        btn.innerText = opt;
        btn.onclick = () => {
            if(opt === item.ext) {
                playSfx('correct');
                addXp(10);
                nextItem3();
            } else {
                playSfx('wrong');
            }
        };
        optionsDiv.appendChild(btn);
    });
}

function addXp(val) {
    state.xp += val;
    document.getElementById('xp-val').innerText = `${state.xp} XP`;
    const prog = Math.min((state.xp / 500) * 100, 100);
    document.getElementById('xp-bar').style.width = prog + "%";
    
    if(state.xp > 200) document.getElementById('rank-name').innerText = "Nivel 2: Detective Digital";
    if(state.xp > 400) document.getElementById('rank-name').innerText = "Nivel 3: Maestro de Archivos";
}

function downloadApp() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'MundoArchivo_Full.html';
    a.click();
}
