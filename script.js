const chars$$ = document.querySelector('[data-function="characters"]');
const arena$$ = document.querySelector('[data-function="arena"]');
const fight$$ = document.createElement('button');
const select$$ = document.createElement('h2');
select$$.textContent = 'Choose your fighters!';
arena$$.appendChild(select$$);
fight$$.addEventListener('click', () => startFight(characters, rival1, rival2));
fight$$.textContent = 'FIGHT!!';
let characters = [];
let vitalities = [];
let selectedChars = 0;
let turn = 0;
let rival1 = '';
let rival2 = '';
let firstTurn = true;
let firstAttacked = false;
let gameOver = false;

const getCharacters = async () => {
    try {
        const res = await fetch('https://my-json-server.typicode.com/krst221/role-game/characters');
        characters = await res.json();
        printCharacters(characters);
    } catch (error) {
        console.log(error);
    }
}

const printCharacters = (characters) => {
    for(const character of characters) {
        const {avatar, critic, damage, defense, vitality, name} = character;
        vitalities.push(vitality);
        const chardiv$$ = document.createElement('div');
        chardiv$$.addEventListener('click', () => charSelected(characters, name, chardiv$$));
        chardiv$$.classList.add('c-characters__item');
        const name$$ = document.createElement('h2');
        name$$.textContent = name;
        const img$$ = document.createElement('img');
        img$$.src = avatar;
        chardiv$$.appendChild(img$$);
        chardiv$$.appendChild(name$$);
        printStats(character, chardiv$$);
        chars$$.appendChild(chardiv$$);
    }
}

const printStats = (character, div) => {
    const {damage, defense, vitality} = character;
    const dmgf = damage;
    const dmg$$ = document.createElement('p');
    const avg$$ = document.createElement('p');
    const def$$ = document.createElement('p');
    const vit$$ = document.createElement('p');
    let dmgt = 0;
    let avgt = 0;
    let avg = 0;
    for (let i = 0 ; i < dmgf.length ; i++) {
        const dpos = dmgf[i].indexOf('d');
        const mult = dmgf[i].substring(0 ,dpos);
        const dmg = dmgf[i].substring(dpos + 1, dmgf[i].length);
        avg = dmg/2 + 0.5;
        dmgt += mult*dmg;
        avgt += mult*avg;
    }
    avgt = avgt.toFixed(0);
    dmg$$.textContent = 'Daño maximo: ' + dmgt;
    avg$$.textContent = 'Daño medio: ' + avgt;
    def$$.textContent = 'Defensa: ' + defense;
    vit$$.textContent = 'Vitalidad: ' + vitality;
    div.appendChild(dmg$$);
    div.appendChild(avg$$);
    div.appendChild(def$$);
    div.appendChild(vit$$);
}

const charSelected = (characters, name, div) => {
    if(rival1 === '') {
        div.classList.add('selected');
        rival1 = name;
        select$$.textContent = ('You choose ' + name + ' as your first fighter! Please pick the second one!');
        selectedChars++;
    }
    else if(rival1 === name) {
        select$$.textContent = ('You choose ' + name + ' again! Please pick a different fighter!');
        for(let i = 0 ; i < characters.length; i++) {
            if(characters[i].name !== name) {
                const char = chars$$.childNodes[i];
                char.classList.remove('selected');
            }
        }
    }   
    else {
        if(rival2 !== '') {
            for(let i = 0 ; i < characters.length; i++) {
                if(characters[i].name !== name && characters[i].name !== rival1) {
                    const char = chars$$.childNodes[i];
                    char.classList.remove('selected');
                }
            }
        }
        div.classList.add('selected');
        rival2 = name;
        select$$.textContent = ('You choose ' + name + '! The fight between ' + rival1 + ' and ' + rival2 + ' is about to begin!');
        selectedChars++;
    }
    if(selectedChars === 2) arena$$.appendChild(fight$$);
}

const startFight = (characters, rival1, rival2) => {
    firstTurn = true;
    let r1i = -1;
    let r2i = -1;
    for (let i = 0 ; i < characters.length ; i++) {
        if(characters[i].name == rival1) r1i = i;
        else if(characters[i].name == rival2) r2i = i;
    }
    setInterval(calcTurn(characters, r1i, r2i), 1000);
}

const calcTurn = (characters, r1i, r2i) => {
    if(!gameOver) {
        if(firstTurn) {
            turn = 1;
            const turn$$ = document.createElement('h2');
            while (arena$$.firstChild) arena$$.removeChild(arena$$.lastChild);
            turn$$.textContent = 'Turno ' + turn;
            arena$$.appendChild(turn$$);
            let first = Math.floor(Math.random() * 2);
            if(first === 0) {
                const atk$$ = document.createElement('p');
                atk$$.textContent = characters[r1i].name + ' va a atacar a ' + characters[r2i].name + '!';
                const vida$$ = document.createElement('p');
                vida$$.textContent = 'A ' + characters[r2i].name + ' le quedan ' + characters[r2i].vitality + ' puntos de vida!';
                setTimeout(() => {arena$$.appendChild(atk$$)}, 300);
                setTimeout(() => {arena$$.appendChild(vida$$)}, 1000);
                setTimeout(() => {makeDamage(characters, r1i, r2i)}, 1000); 
                firstAttacked = true;
            }
            else {
                const atk$$ = document.createElement('p');
                atk$$.textContent = characters[r2i].name + ' va a atacar a ' + characters[r1i].name + '!';
                const vida$$ = document.createElement('p');
                vida$$.textContent = 'A ' + characters[r1i].name + ' le quedan ' + characters[r1i].vitality + ' puntos de vida!';
                setTimeout(() => {arena$$.appendChild(atk$$)}, 300);
                setTimeout(() => {arena$$.appendChild(vida$$)}, 1000);
                setTimeout(() => {makeDamage(characters, r2i, r1i)}, 1000); 
                firstAttacked = false;
            }
            firstTurn = false;
            turn++;
        }
        else {
            const turn$$ = document.createElement('h2');
            turn$$.textContent = 'Turno ' + turn;
            arena$$.appendChild(turn$$);
            if(!firstAttacked) {
                const atk$$ = document.createElement('p');
                atk$$.textContent = characters[r1i].name + ' va a atacar a ' + characters[r2i].name + '!';
                const vida$$ = document.createElement('p');
                vida$$.textContent = 'A ' + characters[r2i].name + ' le quedan ' + characters[r2i].vitality + ' puntos de vida!';
                setTimeout(() => {arena$$.appendChild(atk$$)}, 300);
                setTimeout(() => {arena$$.appendChild(vida$$)}, 1000);
                setTimeout(() => {makeDamage(characters, r1i, r2i)}, 1000); 
                firstAttacked = true; 
            }   
            else {
                const atk$$ = document.createElement('p');
                atk$$.textContent = characters[r2i].name + ' va a atacar a ' + characters[r1i].name + '!';
                const vida$$ = document.createElement('p');
                vida$$.textContent = 'A ' + characters[r1i].name + ' le quedan ' + characters[r1i].vitality + ' puntos de vida!';
                setTimeout(() => {arena$$.appendChild(atk$$)}, 300);
                setTimeout(() => {arena$$.appendChild(vida$$)}, 1000);
                setTimeout(() => {makeDamage(characters, r2i, r1i)}, 1000); 
                firstAttacked = false;
            }
            turn++;
        }
        setTimeout(() => {while (arena$$.firstChild) {arena$$.removeChild(arena$$.lastChild);}}, 6000);
        setTimeout(() => {calcTurn(characters, r1i, r2i)}, 6000);
    }
    else drawTheWinner(characters, r1i, r2i);
}

const makeDamage = (characters, atk, def) => {
    const damage$$ = document.createElement('p');
    let damage = 0;
    setTimeout(() => {damage = calculateDamage(characters, atk) - characters[def].defense; 
        if(damage < 0) damage = 0;}, 500); 
    setTimeout(() => {characters[def].vitality = characters[def].vitality - damage;
        if(characters[def].vitality > 0) damage$$.textContent = characters[atk].name + ' acaba de quitar ' + damage + ' puntos de vida a ' + characters[def].name + '! A ' + characters[def].name + ' le quedan ' + characters[def].vitality + ' puntos de vida!';
        else {damage$$.textContent = characters[atk].name + ' acaba de quitar ' + damage + ' puntos de vida a ' + characters[def].name + '! A ' + characters[def].name + ' no le quedan puntos de vida!'; gameOver = true;}}, 1800);
    setTimeout(() => {arena$$.appendChild(damage$$)}, 2500);
}

const calculateDamage = (characters, atk) => {
    const dmgf = characters[atk].damage;
    let damage = 0;
    let dpos = 0;
    let mult = 0
    let dmg = 0;
    for (let i = 0 ; i < dmgf.length ; i++) {
        const dmg$$ = document.createElement('p');
        dpos = dmgf[i].indexOf('d');
        mult = dmgf[i].substring(0 ,dpos);
        dmg = dmgf[i].substring(dpos + 1, dmgf[i].length);
        dmg = throwDice(dmg) * mult;
        if(characters[atk].critic === dmg) {
            dmg = dmg * 2;
            dmg$$.textContent = 'GOLPE CRITICO!! ' + dmg + ' de daño!';
        }
        else {
            dmg$$.textContent = dmg + ' de daño!';
        }
        setTimeout(() => {arena$$.appendChild(dmg$$)}, 300*(i+1));
        damage += dmg;
    }
    return damage;
}

const throwDice = (value) => Math.floor(Math.random() * value) + 1;

const drawTheWinner = (characters, r1i, r2i) => {
    const winner$$ = document.createElement('h2');
    const reset$$ = document.createElement('button');
    reset$$.textContent = 'NEW GAME';
    reset$$.addEventListener('click', resetGame);
    if(characters[r1i].vitality > 0) winner$$.textContent = characters[r2i].name + ' ha caído derrotado! ' + characters[r1i].name + ' es el vencedor!!';
    else winner$$.textContent = characters[r1i].name + ' ha caído derrotado! ' + characters[r2i].name + ' es el vencedor!!';
    arena$$.appendChild(winner$$);
    arena$$.appendChild(reset$$);
}

const resetGame = () => {
    selectedChars = 0;
    turn = 0;
    rival1 = '';
    rival2 = '';
    firstTurn = true;
    firstAttacked = false;
    gameOver = false;
    for(let i = 0 ; i < characters.length ; i++) {
        characters[i].vitality = vitalities[i];
        const char = chars$$.childNodes[i];
        char.classList.remove('selected');
    }
    while (arena$$.firstChild) arena$$.removeChild(arena$$.lastChild);
    select$$.textContent = 'Choose your fighters!';
    arena$$.appendChild(select$$);
}

getCharacters();
