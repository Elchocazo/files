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
    activeSkin: 'skin-bot',
    userName: '',
    userGrade: '1',
    lastLogin: Date.now(),
    achievements: []
};

const SESSION_TIMEOUT = 1000 * 60 * 60 * 48; // 48 horas en milisegundos

function resetProgressIfInactive() {
    const data = localStorage.getItem('mundoArchivoData');
    if (data) {
        const parsed = JSON.parse(data);
        if (parsed.lastLogin && (Date.now() - parsed.lastLogin > SESSION_TIMEOUT)) {
            localStorage.removeItem('mundoArchivoData');
            console.log("Progreso reiniciado por inactividad prolongada.");
            return true;
        }
    }
    return false;
}

function saveGame() {
    state.lastLogin = Date.now();
    localStorage.setItem('mundoArchivoData', JSON.stringify({
        xp: state.xp,
        coins: state.coins,
        unlockedSteps: state.unlockedSteps,
        inventory: state.inventory,
        activeSkin: state.activeSkin,
        userName: state.userName,
        userGrade: state.userGrade,
        lastLogin: state.lastLogin,
        achievements: state.achievements
    }));
}

function loadGame() {
    if (resetProgressIfInactive()) {
        showLoginModal();
        return;
    }

    const data = localStorage.getItem('mundoArchivoData');
    if (data) {
        const parsed = JSON.parse(data);
        state.xp = parsed.xp || 0;
        state.coins = parsed.coins || 0;
        state.unlockedSteps = parsed.unlockedSteps || 1;
        state.inventory = parsed.inventory || ['skin-bot'];
        state.activeSkin = parsed.activeSkin || 'skin-bot';
        state.userName = parsed.userName || '';
        state.userGrade = parsed.userGrade || '1';
        state.achievements = parsed.achievements || [];

        if (state.userName) {
            hideLoginModal();
            updateUserInfoUI();
        } else {
            showLoginModal();
        }

        updateXpUI();
        updateCoinsUI();
        updateMascotUI();
        loadModule(state.unlockedSteps);
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function updateUserInfoUI() {
    if (state.userName) {
        document.getElementById('rank-name').innerHTML = `<span class="text-sky-600">${state.userName}</span> - Grado: ${state.userGrade}°`;
    }
}

function submitLogin() {
    const nameInput = document.getElementById('user-name-input').value.trim();
    const gradeInput = document.getElementById('user-grade-input').value;

    if (!nameInput) {
        alert("¡Por favor ingresa tu nombre para empezar!");
        return;
    }

    state.userGrade = gradeInput;
    hideLoginModal();
    updateUserInfoUI();
    addAchievement('first_login');
    saveGame();
    loadModule(1);
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

// ACTUALIZACIONES DE UI
function updateXpUI() {
    document.getElementById('xp-val').innerText = `${state.xp} XP`;
    const prog = Math.min((state.xp / 10000) * 100, 100);
    document.getElementById('xp-bar').style.width = prog + "%";

    if (state.xp > 200) document.getElementById('rank-name').innerText = "Nivel 2: Detective Digital";
    if (state.xp > 400) document.getElementById('rank-name').innerText = "Nivel 3: Maestro de Archivos";
    if (state.xp > 700) document.getElementById('rank-name').innerText = "Nivel 4: Guardián de Datos";
    if (state.xp > 900) document.getElementById('rank-name').innerText = "Nivel 5: Sabio del Sistema";
    if (state.xp > 1500) document.getElementById('rank-name').innerText = "Nivel 6: Arquivero de Élite";
    if (state.xp > 2500) document.getElementById('rank-name').innerText = "Nivel 7: Cripto-Clasificador";
    if (state.xp > 4000) document.getElementById('rank-name').innerText = "Nivel 8: Comandante de Datos";
    if (state.xp > 6000) document.getElementById('rank-name').innerText = "Nivel 9: Oráculo Binario";
    if (state.xp > 10000) document.getElementById('rank-name').innerText = "Nivel 10: LEYENDA DIGITAL";
}

function updateCoinsUI() {
    document.querySelectorAll('.coin-val').forEach(el => el.innerText = state.coins);
}

const skins = {
    'skin-bot': { icon: 'smart_toy', name: 'Bit Normal' },
    'skin-rocket': { icon: 'rocket_launch', name: 'Bit Cohete' },
    'skin-robot': { icon: 'robot_2', name: 'Premium Bot' },
    'skin-star': { icon: 'star', name: 'Súper Bit' },
    'skin-galaxy': { icon: 'auto_awesome', name: 'Bit Galáctico' },
    'skin-gold': { icon: 'workspace_premium', name: 'Bit Dorado' }
};

function updateMascotUI() {
    const skin = skins[state.activeSkin] || skins['skin-bot'];
    document.getElementById('mascot-icon').innerText = skin.icon;
}

function addXp(amount) {
    state.xp += amount;
    state.coins += Math.floor(amount / 2);
    updateXpUI();
    updateCoinsUI();
    saveGame();

    if (state.coins >= 500) addAchievement('rich');
}

const moduleInstructions = {
    1: "¡Bienvenido recluta! En este clan, debes escribir las extensiones que faltan para completar cada grupo. Recuerda: .doc es para texto, .jpg para imágenes, .mp3 para audio y .mp4 para video.",
    2: "¡A clasificar! Haz clic en la cubeta correcta para enviar el archivo central. ¡No te equivoques o el sistema se agitará!",
    3: "¡Rápido! El tiempo vuela. Adivina la extensión correcta antes de que el reloj llegue a cero. ¡Cada acierto te da XP!",
    4: "¡Alerta de intrusos! Hay una extensión que no pertenece al clan mostrado. Encuéntrala y elimínala.",
    5: "¡Reparación forense! El archivo ha perdido su extensión. Mira de qué clan es y elige la extensión correcta para repararlo.",
    6: "¡Detective visual! Reconoce el tipo de archivo solo por su icono. ¿Eres capaz de identificarlos todos?",
    7: "¡Lluvia masiva! Haz clic en cada archivo y escribe a qué clan pertenece para despejar la pantalla.",
    8: "¡Ojo clínico! Revisa si la extensión del archivo coincide con su nombre. ¿Es real o es un engaño?",
    9: "¡Superviviencia extrema! Resuelve los acertijos lo más rápido posible. Los aciertos te dan tiempo extra, los fallos te lo quitan.",
    10: "¡Examen Final! Demuestra todo lo que has aprendido. Tienes 3 vidas para superar los desafíos del Gran Maestro.",
    99: "¡Bienvenido a la Tienda! Aquí puedes canjear tus Archicoins por nuevos aspectos para Bit y temas para el sistema."
};

function showInstructions(num) {
    const modal = document.getElementById('instructions-modal');
    if (modal) {
        document.getElementById('inst-title').innerText = num === 99 ? "La Tienda" : `Misión ${num}`;
        document.getElementById('inst-content').innerText = moduleInstructions[num] || "¡Mucha suerte en esta misión!";
        modal.classList.remove('hidden');
    }
}

function closeInstructions() {
    document.getElementById('instructions-modal').classList.add('hidden');
}

// LOGROS
const achievementsData = [
    { id: 'first_login', name: 'Primeros Pasos', desc: 'Identifícate por primera vez', xp: 50 },
    { id: 'module_1', name: 'Aprendiz de Clan', desc: 'Completa el primer módulo', xp: 100 },
    { id: 'rich', name: 'Ahorrador', desc: 'Consigue 500 monedas', xp: 200 },
    { id: 'fast_fingers', name: 'Dedos Rápidos', desc: 'Gana 100 XP en Carrera Rápida', xp: 150 }
];

function addAchievement(id) {
    if (state.achievements.includes(id)) return;
    const ach = achievementsData.find(a => a.id === id);
    if (ach) {
        state.achievements.push(id);
        addXp(ach.xp);
        showAchievementToast(ach);
        saveGame();
    }
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-10 right-10 bg-white border-4 border-yellow-400 p-6 rounded-3xl shadow-2xl z-[100] flex items-center gap-4 animate-bounce";
    toast.innerHTML = `
        <div class="bg-yellow-100 p-3 rounded-2xl"><span class="material-symbols-outlined text-yellow-600 text-4xl">emoji_events</span></div>
        <div>
            <div class="font-black text-yellow-700 text-xl">¡LOGRO DESBLOQUEADO!</div>
            <div class="font-bold text-slate-600">${ach.name}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
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
    if (num !== 99) {
        const navBtn = document.getElementById(`nav-${num}`);
        if (navBtn) navBtn.classList.add('nav-item-active');
    } else {
        const shopBtn = document.getElementById('nav-shop');
        if (shopBtn) shopBtn.classList.add('nav-item-active');
    }

    showInstructions(num);

    // Actualizar visual de botones bloqueados
    for (let i = 1; i <= 10; i++) {
        const btn = document.getElementById(`nav-${i}`);
        if (btn) {
            if (i <= state.unlockedSteps) {
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    if (num === 2) initModule2();
    if (num === 3) initModule3();
    if (num === 4) initModule4();
    if (num === 5) initModule5();
    if (num === 6) initModule6();
    if (num === 7) initModule7();
    if (num === 8) initModule8();
    if (num === 9) initModule9();
    if (num === 10) initModule10();
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

        if (state.tutorialInputs >= tutNeeded) {
            const btn = document.getElementById('btn-tutorial-finish') || document.getElementById('btn-tutorial-next');
            btn.disabled = false;
            btn.classList.remove('bg-sky-200', 'text-sky-400', 'cursor-not-allowed');
            btn.classList.add('bg-sky-500', 'text-white', 'hover:bg-sky-600', 'shadow-lg');
            btn.onclick = () => {
                addXp(100);
                state.unlockedSteps = 2;
                addAchievement('module_1');
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
                addXp(10);
                nextItem3();
            } else {
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
                updateScore5();
                if (state.game5Score >= 5) {
                    addXp(200);
                    alert("¡FELICIDADES! Te has graduado del Mundo Archivo. ¡Eres un Maestro!");
                    location.reload();
                } else {
                    nextItem5();
                }
            } else {
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
    { id: 'skin-galaxy', name: 'Bit Galáctico', price: 1000, icon: 'auto_awesome', type: 'skin' },
    { id: 'skin-gold', name: 'Bit Dorado', price: 2500, icon: 'workspace_premium', type: 'skin' },
    { id: 'theme-green', name: 'Tema Esmeralda', price: 150, icon: 'palette', type: 'theme' },
    { id: 'theme-pink', name: 'Tema Rosado', price: 150, icon: 'palette', type: 'theme' },
    { id: 'theme-dark', name: 'Modo Hacker', price: 300, icon: 'terminal', type: 'theme' }
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
        updateCoinsUI();
        handleShopAction(id); // Auto-equipar después de comprar
    }
}

function applyTheme(themeId) {
    document.body.classList.remove('theme-green', 'theme-pink');
    if (themeId !== 'default') document.body.classList.add(themeId);
}

// MODULO 6: DETECTIVE VISUAL
function initModule6() {
    const icons = {
        'texto': 'description',
        'imagen': 'image',
        'audio': 'audiotrack',
        'video': 'movie'
    };
    const clanKeys = Object.keys(icons);
    const targetClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];

    document.getElementById('m6-icon').innerText = icons[targetClan];
    const optionsDiv = document.getElementById('m6-options');
    optionsDiv.innerHTML = '';

    clanKeys.forEach(clan => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-2xl font-bold text-cyan-700 hover:bg-cyan-50 uppercase";
        btn.innerText = clan;
        btn.onclick = () => {
            if (clan === targetClan) {
                addXp(20);
                initModule6();
            } else {
                btn.classList.add('shake');
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        };
        optionsDiv.appendChild(btn);
    });
}

// MODULO 7: ORDEN MASIVO
function initModule7() {
    const queue = document.getElementById('m7-queue');
    queue.innerHTML = '';
    state.m7Items = [];

    for (let i = 0; i < 8; i++) {
        const item = filesData[Math.floor(Math.random() * filesData.length)];
        const el = document.createElement('div');
        el.className = "p-4 bg-white border-4 border-indigo-100 rounded-2xl font-bold cursor-move hover:scale-105 transition-transform flex items-center gap-2";
        el.innerHTML = `<span class="material-symbols-outlined text-indigo-400">draft</span> ${item.name}`;
        el.onclick = () => {
            const currentClan = prompt(`¿A qué clan pertenece "${item.name}"?\n(texto, imagen, audio, video)`).toLowerCase();
            if (currentClan === item.clan) {
                el.remove();
                addXp(15);
                if (queue.children.length === 0) {
                    alert("¡Lluvia despejada!");
                    state.unlockedSteps = 8;
                    loadModule(8);
                }
            } else {
            }
        };
        queue.appendChild(el);
    }
}

// MODULO 8: CAZA ERRORES
function initModule8() { nextItem8(); }
function nextItem8() {
    const isError = Math.random() > 0.5;
    let file = filesData[Math.floor(Math.random() * filesData.length)];
    let display = file.name;

    if (isError) {
        const otherClans = Object.keys(clans).filter(c => c !== file.clan);
        const wrongClan = otherClans[Math.floor(Math.random() * otherClans.length)];
        const wrongExt = clans[wrongClan][Math.floor(Math.random() * clans[wrongClan].length)];
        display = file.name.split('.')[0] + wrongExt;
    }

    document.getElementById('m8-file-view').innerText = display;
    state.m8Correct = !isError;
}

function checkM8(userVal) {
    if (userVal === state.m8Correct) {
        addXp(25);
        state.game8Score = (state.game8Score || 0) + 1;
        if (state.game8Score >= 10) {
            state.unlockedSteps = 9;
            alert("¡Ojo de halcón! Siguiente nivel.");
            loadModule(9);
        } else {
            nextItem8();
        }
    } else {
        document.getElementById('m8-card').classList.add('shake');
        setTimeout(() => document.getElementById('m8-card').classList.remove('shake'), 500);
        nextItem8();
    }
}

// MODULO 9: SUPERVIVENCIA
function initModule9() {
    state.m9Time = 15;
    if (state.m9Timer) clearInterval(state.m9Timer);
    state.m9Timer = setInterval(() => {
        state.m9Time--;
        document.getElementById('m9-timer').innerText = state.m9Time;
        if (state.m9Time <= 0) {
            clearInterval(state.m9Timer);
            alert("¡Se acabó el tiempo! Reintenta.");
            loadModule(9);
        }
    }, 1000);
    nextItem9();
}

function nextItem9() {
    const item = filesData[Math.floor(Math.random() * filesData.length)];
    document.getElementById('m9-file').innerText = item.name;
    const optionsDiv = document.getElementById('m9-options');
    optionsDiv.innerHTML = '';

    const options = [item.ext];
    while (options.length < 4) {
        const r = filesData[Math.floor(Math.random() * filesData.length)].ext;
        if (!options.includes(r)) options.push(r);
    }

    options.sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "soft-button p-6 text-2xl font-black";
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === item.ext) {
                addXp(30);
                state.m9Time += 2; // Bono de tiempo
                nextItem9();
                if (state.xp > 5000) {
                    clearInterval(state.m9Timer);
                    state.unlockedSteps = 10;
                    alert("¡Sobreviviste! El Boss te espera.");
                    loadModule(10);
                }
            } else {
                state.m9Time -= 3;
            }
        };
        optionsDiv.appendChild(btn);
    });
}

// MODULO 10: GRAN MAESTRO
function initModule10() {
    state.bossLives = 3;
    updateBossLives();
    nextBossChallenge();
}

function updateBossLives() {
    document.getElementById('boss-lives').innerText = "❤".repeat(state.bossLives);
    if (state.bossLives <= 0) {
        alert("¡Derrotado por el sistema! Reintenta el examen.");
        loadModule(10);
    }
}

function nextBossChallenge() {
    const arena = document.getElementById('boss-arena');
    arena.innerHTML = '';
    const task = document.getElementById('boss-task');

    const types = ['sort', 'detect', 'expert'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'sort') {
        task.innerText = "¡Clasifica esta ráfaga de archivos!";
        // Mini versión de clasificación masiva
    } else {
        task.innerText = "¡Encuentra el error fatal!";
        // Versión ultra rápida de detector
    }

    // Simplificado para el boss final: Pregunta de opción múltiple difícil
    const q = { q: "¿Qué extensión NO pertenece a este clan?", clan: "Imagen", opts: [".jpg", ".png", ".gif", ".exe"], a: ".exe" };
    arena.innerHTML = `
        <div class="flex flex-col items-center gap-6">
            <div class="text-3xl font-bold bg-white p-8 rounded-3xl border-4 text-center border-orange-100 shadow-lg">${q.q} <b>[${q.clan}]</b></div>
            <div class="grid grid-cols-2 gap-4 w-full">
                ${q.opts.map(o => `<button class="soft-button p-8 text-2xl font-black text-orange-700 bg-white" onclick="checkBoss('${o}', '${q.a}')">${o}</button>`).join('')}
            </div>
        </div>
    `;
}

function checkBoss(val, ans) {
    if (val === ans) {
        addXp(500);
        alert("¡FELICIDADES! ERES UNA LEYENDA DIGITAL.");
        loadModule(99); // A la tienda a gastar
    } else {
        state.bossLives--;
        updateBossLives();
    }
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

