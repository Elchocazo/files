// ESTADO
const state = {
    xp: 0,
    coins: 0,
    unlockedSteps: 1,
    tutorialInputs: 0,
    game2Score: 0,
    game3Timer: null,
    game3Time: 30,
    game4Score: 0,
    game5Score: 0,
    currentModule: 1,
    inventory: ['skin-bot'],
    activeSkin: 'skin-bot'
};

function saveGame() {
    localStorage.setItem('mundoArchivoData', JSON.stringify({
        xp: state.xp,
        coins: state.coins,
        unlockedSteps: state.unlockedSteps,
        inventory: state.inventory,
        activeSkin: state.activeSkin
    }));
}

function loadGame() {
    const data = localStorage.getItem('mundoArchivoData');
    if (data) {
        const parsed = JSON.parse(data);
        state.xp = parsed.xp || 0;
        state.coins = parsed.coins || 0;
        state.unlockedSteps = parsed.unlockedSteps || 1;
        state.inventory = parsed.inventory || ['skin-bot'];
        state.activeSkin = parsed.activeSkin || 'skin-bot';

        updateXpUI();
        updateCoinsUI();
        updateMascotUI();
        // Cargar el módulo más alto desbloqueado
        loadModule(state.unlockedSteps);
    }
}

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

// ACTUALIZACIONES DE UI
function updateXpUI() {
    document.getElementById('xp-val').innerText = `${state.xp} XP`;
    const prog = Math.min((state.xp / 1000) * 100, 100);
    document.getElementById('xp-bar').style.width = prog + "%";

    if (state.xp > 200) document.getElementById('rank-name').innerText = "Nivel 2: Detective Digital";
    if (state.xp > 400) document.getElementById('rank-name').innerText = "Nivel 3: Maestro de Archivos";
    if (state.xp > 700) document.getElementById('rank-name').innerText = "Nivel 4: Guardián de Datos";
    if (state.xp > 900) document.getElementById('rank-name').innerText = "Nivel 5: Sabio del Sistema";
}

function updateCoinsUI() {
    document.querySelectorAll('.coin-val').forEach(el => el.innerText = state.coins);
}

const skins = {
    'skin-bot': { icon: 'smart_toy', name: 'Bit Normal' },
    'skin-rocket': { icon: 'rocket_launch', name: 'Bit Cohete' },
    'skin-robot': { icon: 'robot_2', name: 'Premium Bot' },
    'skin-star': { icon: 'star', name: 'Súper Bit' }
};

function updateMascotUI() {
    const skin = skins[state.activeSkin] || skins['skin-bot'];
    document.getElementById('mascot-icon').innerText = skin.icon;
}

// NAVEGACIÓN
function loadModule(num) {
    if (num > state.unlockedSteps && num !== 99) return; // 99 para la tienda

    state.currentModule = num;
    document.querySelectorAll('section > div').forEach(div => div.classList.add('hidden'));

    if (num === 99) {
        document.getElementById('module-shop').classList.remove('hidden');
    } else {
        document.getElementById(`module-${num}`).classList.remove('hidden');
    }

    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('nav-item-active'));
    if (num !== 99) document.getElementById(`nav-${num}`).classList.add('nav-item-active');
    else document.getElementById('nav-shop').classList.add('nav-item-active');

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
    if (num === 99) initShop();
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
    const otherClans = Object.keys(clans).filter(c => c !== item.clan);

    // Tomar una extensión aleatoria de cada uno de los otros clanes (máximo 3)
    let distractorClans = [...otherClans].sort(() => Math.random() - 0.5);
    while (options.length < 4 && distractorClans.length > 0) {
        const clanName = distractorClans.pop();
        const extensions = clans[clanName];
        const randomExt = extensions[Math.floor(Math.random() * extensions.length)];
        if (!options.includes(randomExt)) options.push(randomExt);
    }

    // Si aún faltan (aunque con 4 clanes no debería), rellenar con cualquier cosa única
    while (options.length < 4) {
        const allExts = Object.values(clans).flat();
        const randomExt = allExts[Math.floor(Math.random() * allExts.length)];
        if (!options.includes(randomExt)) options.push(randomExt);
    }

    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-3xl font-black text-sky-700 hover:bg-sky-50 transition-all";
        btn.innerText = opt;
        btn.onclick = () => {
            if (btn.disabled) return;

            if (opt === item.ext) {
                playSfx('correct');
                addXp(10);
                nextItem3();
            } else {
                playSfx('wrong');
                state.game3Time = Math.max(0, state.game3Time - 3); // Penalización de 3 segundos
                document.getElementById('timer-box').innerText = `00:${state.game3Time < 10 ? '0' : ''}${state.game3Time}`;
                document.getElementById('timer-box').classList.add('text-rose-600', 'shake');

                // Bloquear todos los botones brevemente
                const allBtns = optionsDiv.querySelectorAll('button');
                allBtns.forEach(b => {
                    b.disabled = true;
                    b.classList.add('opacity-50', 'bg-rose-50');
                });

                setTimeout(() => {
                    document.getElementById('timer-box').classList.remove('text-rose-600', 'shake');
                    allBtns.forEach(b => {
                        b.disabled = false;
                        b.classList.remove('opacity-50', 'bg-rose-50');
                    });
                }, 500);
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

    // Intentar agregar correctas únicas
    let availableCorrect = [...correctExts];
    while (options.length < 4 && availableCorrect.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCorrect.length);
        const ext = availableCorrect.splice(randomIndex, 1)[0];
        options.push({ ext: ext, correct: true });
    }

    // Si aún faltan opciones (ej: clan con pocas extensiones), rellenar con otras extensiones para no romper el layout
    while (options.length < 4) {
        const randomClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];
        const randomExt = clans[randomClan][Math.floor(Math.random() * clans[randomClan].length)];
        if (!options.find(o => o.ext === randomExt)) {
            options.push({ ext: randomExt, correct: (randomClan === targetClan) });
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

// TIENDA
const shopItems = [
    { id: 'skin-rocket', name: 'Bit Cohete', price: 100, icon: 'rocket_launch', type: 'skin' },
    { id: 'skin-robot', name: 'Premium Bot', price: 250, icon: 'robot_2', type: 'skin' },
    { id: 'skin-star', name: 'Súper Bit', price: 500, icon: 'star', type: 'skin' },
    { id: 'theme-green', name: 'Tema Esmeralda', price: 150, icon: 'palette', type: 'theme' },
    { id: 'theme-pink', name: 'Tema Rosado', price: 150, icon: 'palette', type: 'theme' }
];

function initShop() {
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    shopItems.forEach(item => {
        const isOwned = state.inventory.includes(item.id);
        const isActive = state.activeSkin === item.id || (item.type === 'theme' && document.body.classList.contains(item.id));

        const card = document.createElement('div');
        card.className = `soft-card p-6 flex flex-col items-center gap-4 transition-all ${isActive ? 'border-sky-500 bg-sky-50' : ''}`;

        card.innerHTML = `
            <span class="material-symbols-outlined text-6xl ${isActive ? 'text-sky-500' : 'text-slate-400'}">${item.icon}</span>
            <div class="text-center">
                <div class="font-black text-xl text-slate-700">${item.name}</div>
                <div class="text-sm font-bold text-slate-400">${item.type === 'skin' ? 'Aspecto para Bit' : 'Color de Sistema'}</div>
            </div>
            <button onclick="handleShopAction('${item.id}')" 
                class="w-full py-3 rounded-2xl font-black text-lg transition-all ${isActive ? 'bg-sky-500 text-white cursor-default' :
                isOwned ? 'bg-slate-200 text-slate-500 hover:bg-slate-300' :
                    state.coins >= item.price ? 'bg-yellow-400 text-white hover:bg-yellow-500 shadow-md' :
                        'bg-slate-100 text-slate-300 cursor-not-allowed'
            }">
                ${isActive ? 'ACTIVO' : isOwned ? 'EQUIPAR' : `${item.price} 🪙`}
            </button>
        `;
        container.appendChild(card);
    });
}

function handleShopAction(id) {
    const item = shopItems.find(i => i.id === id);
    const isOwned = state.inventory.includes(id);

    if (isOwned) {
        if (item.type === 'skin') {
            state.activeSkin = id;
            updateMascotUI();
        } else if (item.type === 'theme') {
            applyTheme(id);
        }
        initShop();
        saveGame();
    } else if (state.coins >= item.price) {
        state.coins -= item.price;
        state.inventory.push(id);
        playSfx('win');
        updateCoinsUI();
        handleShopAction(id); // Auto-equipar después de comprar
    }
}

function applyTheme(themeId) {
    document.body.classList.remove('theme-green', 'theme-pink');
    if (themeId !== 'default') document.body.classList.add(themeId);
}

function addXp(val) {
    state.xp += val;
    state.coins += Math.floor(val / 2); // Ganar monedas proporcional al XP
    updateXpUI();
    updateCoinsUI();
    saveGame();
}

window.addEventListener('load', () => {
    loadGame();
    if (state.xp === 0) updateXpUI(); // Primera carga
});

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

