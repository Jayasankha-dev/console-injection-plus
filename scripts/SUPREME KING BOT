(function() {
    'use strict';

    // 0. --- 🔊 MASTER AUDIO ENGINE (Skill 12: SFX Engine) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSfx(freq, type, duration, vol = 0.1) {
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    // 1. --- 🎨 THE SUPREME KING UI (Skill 15, 16, 17: UI & Animations) ---
    const kingRoot = document.createElement('div');
    kingRoot.id = "king-universal-nexus";
    kingRoot.innerHTML = `
    <style>
        #king-container { position: fixed; z-index: 2147483647; width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); user-select: none; pointer-events: auto; }
        .king-icon { font-size: 110px; color: #FFD700; cursor: crosshair; filter: drop-shadow(0 0 30px #FF0000); animation: godFloat 2s infinite alternate; }
        .fire-vortex { position: absolute; width: 130px; height: 130px; background: radial-gradient(circle, #ff4500 20%, transparent 70%); filter: blur(20px); animation: spin 0.4s infinite linear; }
        @keyframes godFloat { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-25px) rotate(5deg); } }
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        .fake-error { position: fixed; padding: 12px; background: #d32f2f; color: white; font-weight: bold; border-radius: 4px; z-index: 2147483640; pointer-events: none; animation: pop 0.3s ease; }
        @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
        .stolen { position: fixed !important; z-index: 2147483645 !important; transition: 1s ease-in-out !important; pointer-events: none !important; }
        .army-unit { position: fixed; font-size: 45px; color: gold; text-shadow: 0 0 10px red; z-index: 2147483630; transition: 2s; pointer-events: none; }
        .inverted-world { filter: invert(1) hue-rotate(180deg) !important; }
        .scattered { transform: translate(50px, 50px) rotate(15deg) !important; }
        .ghost-trail { position: fixed; pointer-events: none; z-index: 2147483646; opacity: 0.5; transition: 0.1s; }
    </style>
    <div id="king-container"><div class="fire-vortex"></div><div class="king-icon">♚</div></div>`;
    document.body.appendChild(kingRoot);

    const king = document.getElementById('king-container');
    let isBerserk = false;

    // --- 🛠️ FUNCTIONAL SKILLS ---

    // [Skill 1] Input Hijacker
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if ((active.tagName === "INPUT" || active.tagName === "TEXTAREA") && Math.random() > 0.6) {
            e.preventDefault();
            const msg = " KING_RULES_YOU ";
            active.value += msg[active.value.length % msg.length];
            playSfx(400, 'square', 0.1, 0.05);
        }
    });

    // [Skill 2] Image Stealing
    function stealImage() {
        const imgs = Array.from(document.querySelectorAll('img')).filter(i => i.width > 40);
        if (imgs.length > 0) {
            const target = imgs[Math.floor(Math.random() * imgs.length)];
            target.classList.add('stolen');
            setTimeout(() => target.classList.remove('stolen'), 3000);
        }
    }

    // [Skill 3] Summon Army
    function summonArmy() {
        const icons = ["♛", "♞", "♜", "♝"];
        for(let i=0; i<5; i++) {
            const s = document.createElement('div');
            s.className = 'army-unit';
            s.innerText = icons[Math.floor(Math.random()*icons.length)];
            s.style.left = (Math.random() * window.innerWidth) + "px";
            s.style.top = "-60px";
            document.body.appendChild(s);
            setTimeout(() => { s.style.top = window.innerHeight + "px"; }, 100);
            setTimeout(() => s.remove(), 4000);
        }
    }

    // [Skill 4] Scroll Troll & [Skill 5] Inverted World
    function scrollTroll() {
        window.scrollTo(0, 0);
        document.body.classList.add('inverted-world');
        setTimeout(() => document.body.classList.remove('inverted-world'), 2000);
    }

    // [Skill 6] Fake Error Spammer
    function spawnError() {
        const div = document.createElement('div');
        div.className = 'fake-error';
        div.innerText = "CRITICAL ERROR: KING OVERRIDE";
        div.style.left = Math.random() * 80 + "%"; div.style.top = Math.random() * 80 + "%";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2000);
    }

    // [Skill 7] Element Scattering
    function scatter() {
        document.querySelectorAll('button, a').forEach(el => {
            if(Math.random() > 0.8) el.classList.add('scattered');
        });
    }

    // [Skill 11, 8, 9, 10, 14] Dynamic Ghost Cursor with Trail & Rainbow
    document.body.style.cursor = "none";
    const ghost = document.createElement('div');
    ghost.style = "position:fixed; font-size:35px; pointer-events:none; z-index:2147483647; transition: 0.1s;";
    document.body.appendChild(ghost);

    const cursorIcons = ["♚", "💀", "❌", "🔥", "👑", "⚡"];
    const cursorColors = ["gold", "red", "#ff00ff", "cyan", "#00ff00"];

    document.addEventListener('mousemove', (e) => {
        ghost.style.left = e.clientX + "px";
        ghost.style.top = e.clientY + "px";
        
        // Trail Effect
        const trail = document.createElement('div');
        trail.className = 'ghost-trail';
        trail.innerText = ghost.innerText;
        trail.style.color = ghost.style.color;
        trail.style.left = e.clientX + "px";
        trail.style.top = e.clientY + "px";
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 300);

        // [Skill 11] Catch Me If You Can
        const rect = king.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + 75), e.clientY - (rect.top + 75));
        if (dist < 160 && !isBerserk) {
            king.style.left = Math.random() * (window.innerWidth - 150) + "px";
            king.style.top = Math.random() * (window.innerHeight - 150) + "px";
            playSfx(800, 'sine', 0.1);
        }
    });

    setInterval(() => {
        ghost.innerText = cursorIcons[Math.floor(Math.random() * cursorIcons.length)];
        ghost.style.color = cursorColors[Math.floor(Math.random() * cursorColors.length)];
        ghost.style.textShadow = `0 0 15px ${ghost.style.color}`;
        ghost.style.fontSize = (Math.random() * 15 + 25) + "px";
    }, 500);

    // [Skill 12] Link Jumbler
    document.addEventListener('mouseover', (e) => {
        if(e.target.tagName === 'A' && Math.random() > 0.5) e.target.href = "https://google.com/search?q=KING";
    });

    // [Skill 13] Blackout
    function blackout() {
        const cover = document.createElement('div');
        cover.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:black;z-index:999999;";
        document.body.appendChild(cover);
        setTimeout(() => cover.remove(), 600);
    }

    // [Skill 14] Sticky/Moving Buttons
    document.addEventListener('mouseover', (e) => {
        if(e.target.tagName === 'BUTTON' && Math.random() > 0.5) {
            e.target.style.transform = `translate(${Math.random()*100}px, ${Math.random()*100}px)`;
        }
    });

    // [Skill 18] Context Menu Block
    document.oncontextmenu = (e) => { e.preventDefault(); spawnError(); };

    // [Skill 19] Random Audio Scare
    function randomNoise() { playSfx(Math.random()*2000, 'sawtooth', 0.3); }

    // [Skill 20] Final Punishment
    king.onclick = () => {
        isBerserk = true;
        playSfx(50, 'sawtooth', 2);
        document.body.innerHTML = `<div style="background:black;color:gold;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:serif;"><h1>REALM CONQUERED</h1><span style="font-size:100px;">♚</span></div>`;
        setTimeout(() => location.reload(), 3000);
    };

    // --- 🤖 CHAOS ENGINE (Skills 4, 5, 6, 7, 13, 19, 20) ---
    setInterval(() => {
        if(isBerserk) return;
        const dice = Math.random();
        if (dice > 0.9) scrollTroll();
        else if (dice > 0.8) blackout();
        else if (dice > 0.7) summonArmy();
        else if (dice > 0.6) stealImage();
        else if (dice > 0.5) spawnError();
        else if (dice > 0.4) randomNoise();
        else if (dice > 0.3) scatter();
    }, 4000);

    king.style.left = "50px"; king.style.top = "50px";
})();
