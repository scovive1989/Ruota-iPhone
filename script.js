const livelli = [
    { id: 1, categoria: "LIGABUE", frase: "IN UN SUO DISCO URLA CONTRO IL CIELO"},
    { id: 2, categoria: "TRECCE", frase: "IN UN DISCO VENGONO SCIOLTE AI CAVALLI" },
    { id: 3, categoria: "IN UFFICIO", frase: "IN PAUSA CAFFÈ SI SPETTEGOLA TRA COLLEGHI" },
    { id: 4, categoria: "LA SCIMMIA", frase: "IN MOTO INDOSSA IL CASCO DI BANANE" },
    { id: 5, categoria: "METE TURISTICHE", frase: "IN ANDALUSIA CORDOBA E SIVIGLIA" },
    { id: 201, categoria: "1969 - NEW YORK", frase: "SBARCO SULLA LUNA DI NEIL ARMSTRONG" },
    { id: 202, categoria: "1989 - BERLINO", frase: "CADUTA DEL MURO E RIUNIFICAZIONE" },
    { id: 203, categoria: "1492 - PALOS", frase: "CRISTOFORO COLOMBO SCOPRE L'AMERICA" }
];

const rowCaps = [12, 14, 14, 12];

function init() {
    renderLevels(livelli);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toUpperCase();
            const filtered = livelli.filter(l => l.categoria.includes(term));
            renderLevels(filtered);
        });
    }
}

function renderLevels(dataArray) {
    const list = document.getElementById('levels-list');
    if (!list) return;
    list.innerHTML = '';
    dataArray.forEach((liv) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.innerText = `LIV. ${liv.id}: ${liv.categoria}`;
        btn.onclick = () => startGame(livelli.findIndex(l => l.id === liv.id));
        list.appendChild(btn);
    });
}

function startGame(idx) {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    const data = livelli[idx];
    document.getElementById('categoryDisplay').innerText = data.categoria;
    setupBoard(data.frase);
    setupKeyboard();
}

function setupBoard(frase) {
    const words = frase.split(' ');
    let rowsData = [[], [], [], []];
    let testRow = 0;

    words.forEach(w => {
        let currentText = rowsData[testRow].join(' ');
        let space = currentText.length > 0 ? 1 : 0;
        if (currentText.length + space + w.length > rowCaps[testRow]) {
            if (testRow < 3) testRow++;
        }
        rowsData[testRow].push(w);
    });

    for (let i = 0; i < 4; i++) {
        const tr = document.getElementById(`row-${i+1}`);
        tr.innerHTML = '';
        const txt = rowsData[i].join(' ');
        const pad = Math.floor((rowCaps[i] - txt.length) / 2);
        
        for (let j = 0; j < 14; j++) {
            const td = document.createElement('td');
            if ((i === 0 || i === 3) && (j === 0 || j === 13)) {
                td.className = 'tile offset-tile';
            } else {
                td.className = 'tile';
                const charIndex = (i === 0 || i === 3) ? (j - 1 - pad) : (j - pad);
                const char = txt[charIndex];
                if (char && char !== ' ') {
                    td.classList.add('active');
                    td.dataset.letter = char;
                    if (["'", "’", ",", ".", "-", "!", "?"].includes(char)) {
                        td.classList.add('revealed');
                        td.innerText = char;
                    }
                }
            }
            tr.appendChild(td);
        }
    }
}

function setupKeyboard() {
    const kb = document.getElementById('keyboard');
    kb.innerHTML = '';
    "ABCDEFGHILMNOPQRSTUVZ".split('').forEach(l => {
        const b = document.createElement('button');
        b.className = 'key';
        b.innerText = l;
        b.onclick = () => {
            b.disabled = true;
            revealLetter(l);
        };
        kb.appendChild(b);
    });
}

function revealLetter(l) {
    const mapping = {'A':['A','À','Á'],'E':['E','È','É'],'I':['I','Ì','Í'],'O':['O','Ò','Ó'],'U':['U','Ù','Ú']};
    const targets = mapping[l] || [l];
    let found = false;
    document.querySelectorAll('.tile.active').forEach(t => {
        if (targets.includes(t.dataset.letter.toUpperCase())) {
            t.classList.add('revealed');
            t.innerText = t.dataset.letter;
            found = true;
        }
    });
    if (found && navigator.vibrate) navigator.vibrate(50); // Vibrazione iPhone/Android
    if (found) checkWin();
}

function checkWin() {
    const hidden = document.querySelectorAll('.tile.active:not(.revealed)');
    if (hidden.length === 0) setTimeout(() => alert("BRAVO! HAI VINTO!"), 500);
}

function revealSolution() {
    if(!confirm("Vedi soluzione?")) return;
    document.querySelectorAll('.tile.active').forEach(t => {
        t.classList.add('revealed');
        t.innerText = t.dataset.letter;
    });
}

window.onload = init;
