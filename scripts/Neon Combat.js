(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #combat-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 10000; background: radial-gradient(circle, #1a1a2e 0%, #0a0a0c 100%); 
            font-family: 'Segoe UI', sans-serif; overflow: hidden;
        }
        .ui-overlay { position: absolute; top: 20px; width: 100%; display: flex; justify-content: space-around; pointer-events: none; }
        .stat-box { background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px; border: 2px solid #333; min-width: 200px; }
        .health-bar { width: 100%; height: 12px; border: 1px solid #444; background: #111; margin-top: 8px; border-radius: 5px; overflow: hidden; }
        .health-inner { height: 100%; width: 100%; transition: 0.3s ease-out; }
        #player-hp { background: linear-gradient(90deg, #00f2ff, #0066ff); box-shadow: 0 0 10px #00f2ff; }
        #wave-count { color: #ffd700; font-size: 28px; font-weight: 900; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        .controls-hint { position: absolute; bottom: 20px; left: 20px; color: #aaa; font-size: 13px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; }
        .exit-btn { position: absolute; top: 10px; right: 10px; padding: 8px 20px; color: #ff4444; border: 2px solid #ff4444; background: none; cursor: pointer; pointer-events: all; font-weight: bold; transition: 0.2s; }
        .exit-btn:hover { background: #ff4444; color: white; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'combat-container';
    container.innerHTML = `
        <div class="ui-overlay">
            <div class="stat-box">
                <div style="color:#00f2ff; font-weight: bold;">HERO HP</div>
                <div class="health-bar"><div id="player-hp" class="health-inner"></div></div>
            </div>
            <div id="wave-count">WAVE 1</div>
        </div>
        <div class="controls-hint"><b>A,D:</b> Move | <b>W:</b> Jump | <b>Space:</b> Sword | <b>Shift:</b> Fireball</div>
        <button id="exit-combat" class="exit-btn">EXIT</button>
        <canvas id="combat-canvas"></canvas>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('combat-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gravity = 0.7;
    const groundY = canvas.height - 60;
    let wave = 1;
    let particles = [];
    let projectiles = [];
    let enemies = [];
    let isGameOver = false;

    const platforms = [
        { x: 150, y: canvas.height - 220, w: 250, h: 15 },
        { x: canvas.width - 400, y: canvas.height - 220, w: 250, h: 15 },
        { x: canvas.width / 2 - 125, y: canvas.height - 400, w: 250, h: 15 }
    ];

    class Entity {
        constructor(x, y, color, isPlayer = false) {
            this.x = x; this.y = y; this.w = 35; this.h = 55;
            this.color = color; this.vx = 0; this.vy = 0;
            this.hp = 100; this.maxHp = 100;
            this.isJumping = false;
            this.facing = 1;
            this.isPlayer = isPlayer;
            this.invulnerable = 0; // Hit cooldown
        }

        draw() {
            ctx.save();
            if (this.invulnerable > 0 && Math.floor(Date.now() / 50) % 2 === 0) ctx.globalAlpha = 0.3;
            ctx.shadowBlur = 15; ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            
            // Eyes
            ctx.fillStyle = "white";
            let eyeX = this.facing === 1 ? this.x + 22 : this.x + 5;
            ctx.fillRect(eyeX, this.y + 12, 8, 4);
            ctx.restore();
        }

        update() {
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
            if (this.invulnerable > 0) this.invulnerable--;

            // Ground Collision
            if (this.y + this.h > groundY) {
                this.y = groundY - this.h;
                this.vy = 0;
                this.isJumping = false;
            }

            // Platform Collision (One-way)
            platforms.forEach(p => {
                if (this.vy > 0 && 
                    this.x + this.w > p.x && 
                    this.x < p.x + p.w &&
                    this.y + this.h >= p.y && 
                    this.y + this.h <= p.y + p.h + 15) {
                    this.y = p.y - this.h;
                    this.vy = 0;
                    this.isJumping = false;
                }
            });

            if (this.x < 0) this.x = 0;
            if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;
        }
    }

    const player = new Entity(100, groundY - 100, '#00f2ff', true);

    function spawnEnemies() {
        for (let i = 0; i < wave + 1; i++) {
            let type = Math.random() > 0.4 ? 'runner' : 'shooter';
            let color = type === 'runner' ? '#ff3333' : '#ff00ff';
            let spawnX = Math.random() > 0.5 ? -50 : canvas.width + 50;
            let e = new Entity(spawnX, groundY - 100, color);
            e.type = type;
            e.hp = 40 + (wave * 10);
            enemies.push(e);
        }
    }

    const keys = {};
    window.onkeydown = (e) => { 
        keys[e.code] = true;
        if (e.code === 'Space') swordAttack();
        if (e.code === 'ShiftLeft') shootFireball();
    };
    window.onkeyup = (e) => keys[e.code] = false;

    function swordAttack() {
        createParticles(player.x + (player.facing * 40), player.y + 20, '#fff');
        enemies.forEach(en => {
            let dist = Math.abs((player.x + player.w/2) - (en.x + en.w/2));
            if (dist < 90 && Math.abs(player.y - en.y) < 60) {
                en.hp -= 25;
                en.vx = player.facing * 10; // Knockback
                createParticles(en.x, en.y, en.color);
            }
        });
    }

    function shootFireball() {
        projectiles.push({
            x: player.x + (player.facing === 1 ? player.w : 0),
            y: player.y + 25,
            vx: player.facing * 12,
            owner: 'player',
            color: '#ffcc00'
        });
    }

    function createParticles(x, y, color) {
        for(let i=0; i<10; i++) {
            particles.push({ x, y, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12, life: 25, color });
        }
    }

    function gameLoop() {
        if (isGameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Environment
        ctx.fillStyle = '#111';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        ctx.fillStyle = '#334155';
        platforms.forEach(p => {
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#475569';
            ctx.fillRect(p.x, p.y, p.w, 4); // Platform top light
        });

        // Player Move
        player.vx = 0;
        if (keys['KeyA']) { player.vx = -6; player.facing = -1; }
        if (keys['KeyD']) { player.vx = 6; player.facing = 1; }
        if (keys['KeyW'] && !player.isJumping) { player.vy = -16; player.isJumping = true; }

        player.update();
        player.draw();

        // Projectiles
        projectiles.forEach((p, pi) => {
            p.x += p.vx;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10; ctx.shadowColor = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2); ctx.fill();
            
            if (p.owner === 'player') {
                enemies.forEach(en => {
                    if (p.x > en.x && p.x < en.x + en.w && p.y > en.y && p.y < en.y + en.h) {
                        en.hp -= 20;
                        createParticles(p.x, p.y, p.color);
                        projectiles.splice(pi, 1);
                    }
                });
            } else {
                if (p.x > player.x && p.x < player.x + player.w && p.y > player.y && p.y < player.y + player.h) {
                    if (player.invulnerable <= 0) {
                        player.hp -= 10;
                        player.invulnerable = 30;
                    }
                    projectiles.splice(pi, 1);
                }
            }
            if (p.x < -50 || p.x > canvas.width + 50) projectiles.splice(pi, 1);
        });

        // Enemies
        enemies.forEach((en, ei) => {
            en.update();
            en.draw();

            let distToPlayer = player.x - en.x;
            en.facing = distToPlayer > 0 ? 1 : -1;

            if (en.type === 'runner') {
                en.vx = en.facing * (2 + wave*0.2);
            } else {
                if (Math.abs(distToPlayer) > 250) en.vx = en.facing * 2;
                else en.vx = 0;
                
                if (Math.random() < 0.02) {
                    projectiles.push({ x: en.x + en.w/2, y: en.y + 25, vx: en.facing * 7, owner: 'enemy', color: '#ff00ff' });
                }
            }

            // Contact damage
            if (Math.abs(player.x - en.x) < 30 && Math.abs(player.y - en.y) < 40 && player.invulnerable <= 0) {
                player.hp -= 5;
                player.invulnerable = 40;
                player.vy = -5; // Small pop up
            }

            if (en.hp <= 0) {
                createParticles(en.x + en.w/2, en.y + en.h/2, en.color);
                enemies.splice(ei, 1);
            }
        });

        // Particles update
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life--;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 25;
            ctx.fillRect(p.x, p.y, 4, 4);
            ctx.globalAlpha = 1;
            if (p.life <= 0) particles.splice(i, 1);
        });

        // UI & Wave Control
        document.getElementById('player-hp').style.width = Math.max(0, player.hp) + '%';
        if (enemies.length === 0 && !isGameOver) {
            wave++;
            document.getElementById('wave-count').innerText = "WAVE " + wave;
            spawnEnemies();
            if(player.hp < 100) player.hp = Math.min(100, player.hp + 20); 
        }

        if (player.hp <= 0) {
            isGameOver = true;
            alert("GAME OVER! WAVE REACHED: " + wave);
            location.reload();
        }

        requestAnimationFrame(gameLoop);
    }

    spawnEnemies();
    gameLoop();
    document.getElementById('exit-combat').onclick = () => { isGameOver = true; container.remove(); };
})();
