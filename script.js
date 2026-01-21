// ESTADO
const state = {
    xp: 0,
    unlockedSteps: 1,
    tutorialInputs: 0,
    game2Score: 0,
    game3Timer: null,
    game3Time: 30,
    game4Score: 0,
    game5Score: 0,
    currentModule: 1
};

const clans = {
    'texto': ['.doc', '.pdf', '.txt'],
    'imagen': ['.jpg', '.png', '.gif'],
    'audio': ['.mp3', '.wav'],
    'video': ['.mp4', '.avi', '.wmv']
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
    if (type === 'correct') synth.triggerAttackRelease(["C4", "E4", "G4"], "8n");
    else if (type === 'wrong') synth.triggerAttackRelease(["C3", "Db3"], "4n");
    else if (type === 'win') synth.triggerAttackRelease(["F4", "A4", "C5", "E5"], "4n");
}

// NAVEGACIÓN
function loadModule(num) {
    if (num > state.unlockedSteps) return;

    state.currentModule = num;
    document.querySelectorAll('section > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(`module-${num}`).classList.remove('hidden');

    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('nav-item-active'));
    document.getElementById(`nav-${num}`).classList.add('nav-item-active');

    // Actualizar visual de botones bloqueados
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`nav-${i}`);
        if (i <= state.unlockedSteps) {
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    if (num === 2) initModule2();
    if (num === 3) initModule3();
    if (num === 4) initModule4();
    if (num === 5) initModule5();
}

// MODULO 1: TUTORIAL
const tutNeeded = 9;
function checkTutorialInput(input, correct) {
    if (input.value.toLowerCase() === correct) {
        input.classList.remove('border-blue-300', 'border-pink-300', 'border-yellow-300', 'border-emerald-300');
        input.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
        input.disabled = true;
        state.tutorialInputs++;
        playSfx('correct');

        if (state.tutorialInputs >= tutNeeded) {
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
    document.getElementById('game-item-icon').className = `material-symbols-outlined text-8xl ${colors[Math.floor(Math.random() * colors.length)]}`;
}

// Lógica Drag & Drop (Versión simplificada por clicks para accesibilidad en web)
document.querySelectorAll('.bucket').forEach(bucket => {
    bucket.onclick = () => {
        const clan = bucket.getAttribute('data-clan');
        if (clan === currentItem2.clan) {
            state.game2Score++;
            playSfx('correct');
            updateScore2();
            if (state.game2Score >= 10) {
                addXp(100);
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
    if (state.game3Timer) clearInterval(state.game3Timer);

    state.game3Timer = setInterval(() => {
        state.game3Time--;
        document.getElementById('timer-box').innerText = `00:${state.game3Time < 10 ? '0' : ''}${state.game3Time}`;
        if (state.game3Time <= 0) {
            clearInterval(state.game3Timer);
            if (state.xp >= 300) {
                state.unlockedSteps = 4;
                alert("¡Tiempo terminado! Nivel 4 desbloqueado.");
                loadModule(4);
            } else {
                alert("¡Tiempo terminado! Necesitas más XP para el siguiente nivel.");
                loadModule(3);
            }
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
    while (options.length < 4) {
        const randomExt = filesData[Math.floor(Math.random() * filesData.length)].ext;
        if (!options.includes(randomExt)) options.push(randomExt);
    }

    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-3xl font-black text-sky-700 hover:bg-sky-50";
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === item.ext) {
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

// MODULO 4: EL INTRUSO
function initModule4() {
    state.game4Score = 0;
    updateScore4();
    nextItem4();
}

function nextItem4() {
    const clanKeys = Object.keys(clans);
    const targetClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];
    document.getElementById('intruder-clan-name').innerText = `CLAN ${targetClan.toUpperCase()}`;

    const optionsDiv = document.getElementById('intruder-options');
    optionsDiv.innerHTML = '';

    // Una incorrecta (el intruso) y tres correctas
    const correctExts = [...clans[targetClan]];
    const others = clanKeys.filter(c => c !== targetClan);
    const intruderClan = others[Math.floor(Math.random() * others.length)];
    const intruderExt = clans[intruderClan][Math.floor(Math.random() * clans[intruderClan].length)];

    let options = [{ ext: intruderExt, correct: false }];

    // Tomar 3 correctas aleatorias (si hay suficientes) o repetir
    while (options.length < 4) {
        const ext = correctExts[Math.floor(Math.random() * correctExts.length)];
        if (!options.find(o => o.ext === ext)) {
            options.push({ ext: ext, correct: true });
        }
    }

    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-8 text-4xl font-black text-rose-700 hover:bg-rose-50";
        btn.innerText = opt.ext;
        btn.onclick = () => {
            if (!opt.correct) {
                state.game4Score++;
                playSfx('correct');
                updateScore4();
                if (state.game4Score >= 10) {
                    addXp(150);
                    state.unlockedSteps = 5;
                    alert("¡Impresionante! Detectas intrusos como un profesional.");
                    loadModule(5);
                } else {
                    nextItem4();
                }
            } else {
                playSfx('wrong');
                btn.classList.add('shake');
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        };
        optionsDiv.appendChild(btn);
    });
}

function updateScore4() {
    document.getElementById('game4-score').innerText = state.game4Score;
}

// MODULO 5: EL EXPERTO
function initModule5() {
    state.game5Score = 0;
    updateScore5();
    nextItem5();
}

function nextItem5() {
    const item = filesData[Math.floor(Math.random() * filesData.length)];
    const container = document.getElementById('security-game');
    container.innerHTML = `
        <div class="bg-white p-10 rounded-[3rem] border-8 border-emerald-100 shadow-xl flex flex-col items-center">
            <div class="text-7xl mb-6">${item.name}<span class="text-rose-500" id="broken-ext">???</span></div>
            <p class="text-slate-400 font-bold mb-8 uppercase">El clan de este archivo es: <span class="text-emerald-600">${item.clan.toUpperCase()}</span></p>
            <div class="grid grid-cols-2 gap-4 w-full" id="expert-options"></div>
        </div>
    `;

    const optsCont = document.getElementById('expert-options');
    const options = [item.ext];
    while (options.length < 4) {
        const randomExt = filesData[Math.floor(Math.random() * filesData.length)].ext;
        if (!options.includes(randomExt)) options.push(randomExt);
    }

    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-3xl font-black text-emerald-700 hover:bg-emerald-50";
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === item.ext) {
                state.game5Score++;
                playSfx('correct');
                updateScore5();
                if (state.game5Score >= 5) {
                    addXp(200);
                    playSfx('win');
                    alert("¡FELICIDADES! Te has graduado del Mundo Archivo. ¡Eres un Maestro!");
                    location.reload();
                } else {
                    nextItem5();
                }
            } else {
                playSfx('wrong');
            }
        };
        optsCont.appendChild(btn);
    });
}

function updateScore5() {
    const prog = (state.game5Score / 5) * 100;
    document.getElementById('game5-progress').style.width = prog + "%";
}

function addXp(val) {
    state.xp += val;
    document.getElementById('xp-val').innerText = `${state.xp} XP`;
    const prog = Math.min((state.xp / 1000) * 100, 100);
    document.getElementById('xp-bar').style.width = prog + "%";

    if (state.xp > 200) document.getElementById('rank-name').innerText = "Nivel 2: Detective Digital";
    if (state.xp > 400) document.getElementById('rank-name').innerText = "Nivel 3: Maestro de Archivos";
    if (state.xp > 700) document.getElementById('rank-name').innerText = "Nivel 4: Guardián de Datos";
    if (state.xp > 900) document.getElementById('rank-name').innerText = "Nivel 5: Sabio del Sistema";
}

function downloadApp() {
    const html = `
<!DOCTYPE html>
<html lang="es">
\${document.documentElement.innerHTML}
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'MundoArchivo_Full.html';
    a.click();
}

