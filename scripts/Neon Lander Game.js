(function() {
    let highScore = localStorage.getItem('lander_v2_high') || 0;
    const padding = 50;
    let canvasW = Math.min(window.innerWidth - padding, 900);
    let canvasH = Math.min(window.innerHeight - 250, 600);
    
    const style = document.createElement('style');
    style.innerHTML = `
        #nebula-container {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; padding: 20px; background: #050505;
            border: 2px solid #39ff14; border-radius: 10px; box-shadow: 0 0 30px rgba(57, 255, 20, 0.2);
            font-family: 'Courier New', monospace; color: #39ff14;
        }
        .hud-v2 { display: flex; justify-content: space-around; margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 10px; }
        .stat-val { color: #fff; font-weight: bold; }
        #lander-canvas { background: #000; display: block; border: 1px solid #111; }
        .msg-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.95); padding: 25px; border: 2px solid #39ff14; display: none; text-align: center; z-index: 10001; min-width: 200px; }
        .game-btn { margin: 10px; padding: 8px 15px; cursor: pointer; background: transparent; color: #39ff14; border: 1px solid #39ff14; font-family: inherit; font-weight: bold; transition: 0.3s; }
        .game-btn:hover { background: #39ff14; color: #000; }
        .exit-btn { border-color: #ff4444; color: #ff4444; }
        .exit-btn:hover { background: #ff4444; color: #fff; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'nebula-container';
    container.innerHTML = `
        <div class="hud-v2">
            <div>FUEL: <span id="l-fuel" class="stat-val">100</span>%</div>
            <div>SPEED: <span id="l-speed" class="stat-val">0</span></div>
            <div>ALTITUDE: <span id="l-alt" class="stat-val">0</span></div>
        </div>
        <div style="position:relative;">
            <canvas id="lander-canvas" width="${canvasW}" height="${canvasH}"></canvas>
            <div id="game-msg" class="msg-overlay">
                <h2 id="msg-title"></h2>
                <p id="msg-body"></p>
                <button id="btn-retry" class="game-btn">RETRY (R)</button>
                <button id="btn-exit-inner" class="game-btn exit-btn">EXIT</button>
            </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <div style="font-size:11px; color:#666;">ARROWS: Fly | R: Restart</div>
            <button id="btn-abort" class="game-btn exit-btn" style="margin:0; padding:4px 10px; font-size:11px;">ABORT MISSION</button>
        </div>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('lander-canvas');
    const ctx = canvas.getContext('2d');

    let ship, terrain, landingPad, keys = {}, gameActive = false, animationId;

    function init() {
        ship = { x: 50, y: 50, vx: 1.2, vy: 0, angle: 0, fuel: 1000, alive: true };
        keys = {};
        generateTerrain();
        document.getElementById('game-msg').style.display = 'none';
        gameActive = true;
        if(animationId) cancelAnimationFrame(animationId);
        loop();
    }

    function generateTerrain() {
        terrain = [];
        let segments = 25;
        let step = canvasW / segments;
        for(let i=0; i<=segments; i++) {
            terrain.push({ x: i * step, y: canvasH - (Math.random() * 120 + 30) });
        }
        let padIdx = Math.floor(Math.random() * (segments - 4)) + 2;
        landingPad = { x: terrain[padIdx].x, y: terrain[padIdx].y, w: 70 };
        terrain[padIdx+1].y = landingPad.y; 
    }

    window.onkeydown = (e) => { 
        keys[e.code] = true; 
        if(e.code === 'KeyR' && gameActive) init();
        if(e.code.includes('Arrow')) e.preventDefault();
    };
    window.onkeyup = (e) => keys[e.code] = false;

    function showMessage(title, body) {
        gameActive = false;
        document.getElementById('msg-title').innerText = title;
        document.getElementById('msg-body').innerText = body;
        document.getElementById('game-msg').style.display = 'block';
    }

    function exitGame() {
        gameActive = false;
        if(animationId) cancelAnimationFrame(animationId);
        container.remove();
        style.remove();
    }

    function loop() {
        if(!gameActive) return;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Terrain
        ctx.strokeStyle = "#39ff14";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        terrain.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(canvasW, canvasH);
        ctx.stroke();

        // Pad
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.strokeRect(landingPad.x, landingPad.y, landingPad.w, 1);

        // Physics
        if(keys['ArrowUp'] && ship.fuel > 0) {
            ship.vx += Math.cos(ship.angle - Math.PI/2) * 0.1;
            ship.vy += Math.sin(ship.angle - Math.PI/2) * 0.1;
            ship.fuel -= 2;
            ctx.fillStyle = "#ff4400";
            ctx.beginPath();
            ctx.arc(ship.x - Math.cos(ship.angle - Math.PI/2)*10, ship.y - Math.sin(ship.angle - Math.PI/2)*10, 3, 0, Math.PI*2);
            ctx.fill();
        }
        if(keys['ArrowLeft']) ship.angle -= 0.07;
        if(keys['ArrowRight']) ship.angle += 0.07;

        ship.vy += 0.04;
        ship.x += ship.vx;
        ship.y += ship.vy;

        // UI
        let speed = Math.sqrt(ship.vx**2 + ship.vy**2);
        document.getElementById('l-speed').innerText = speed.toFixed(1);
        document.getElementById('l-fuel').innerText = Math.max(0, Math.floor(ship.fuel/10));
        document.getElementById('l-alt').innerText = Math.floor(canvasH - ship.y);

        // Draw Ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(-8, -8, 16, 16);
        ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, -12); ctx.stroke(); // Nose
        ctx.restore();

        // Boundaries
        if(ship.x < 0 || ship.x > canvasW || ship.y < -50) {
            showMessage("OUT OF RANGE", "Mission failed.");
        }

        // Collision
        for(let i=0; i<terrain.length-1; i++) {
            if(ship.x >= terrain[i].x && ship.x <= terrain[i+1].x) {
                if(ship.y + 8 >= terrain[i].y) {
                    if(ship.x >= landingPad.x && ship.x <= landingPad.x + landingPad.w && speed < 1.5 && Math.abs(ship.angle) < 0.3) {
                        showMessage("SUCCESS", "Soft landing! Fuel: " + Math.floor(ship.fuel/10) + "%");
                    } else {
                        showMessage("CRASHED", "Impact velocity too high!");
                    }
                }
            }
        }

        animationId = requestAnimationFrame(loop);
    }

    // Event Listeners for buttons
    document.getElementById('btn-retry').onclick = init;
    document.getElementById('btn-exit-inner').onclick = exitGame;
    document.getElementById('btn-abort').onclick = exitGame;

    init();
})();
