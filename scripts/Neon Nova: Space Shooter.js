(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #nova-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 10000; background: radial-gradient(circle, #000510 0%, #000 100%);
            font-family: 'Courier New', monospace; color: #00f2ff; overflow: hidden;
        }
        .hud { position: absolute; top: 20px; left: 20px; pointer-events: none; }
        .hud b { font-size: 24px; color: #fff; text-shadow: 0 0 10px #00f2ff; }
        .exit-btn {
            position: absolute; top: 20px; right: 20px; padding: 10px 20px;
            background: rgba(255,0,0,0.2); color: #ff4444; border: 1px solid #ff4444;
            cursor: pointer; z-index: 10001; font-weight: bold;
        }
        .exit-btn:hover { background: #ff4444; color: #fff; }
        canvas { display: block; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'nova-container';
    container.innerHTML = `
        <div class="hud">
            SCORE: <b id="n-score">0</b><br>
            LEVEL: <b id="n-lvl">1</b>
        </div>
        <button id="n-exit" class="exit-btn">TERMINATE MISSION</button>
        <canvas id="nova-canvas"></canvas>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('nova-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let score = 0, level = 1, gameActive = true;
    let player = { x: canvas.width/2, y: canvas.height - 100, size: 20 };
    let bullets = [], enemies = [], particles = [];

    // Mouse control
    window.onmousemove = (e) => {
        player.x = e.clientX;
        player.y = e.clientY;
    };

    function spawnEnemy() {
        if(Math.random() < 0.05 + (level * 0.01)) {
            enemies.push({
                x: Math.random() * canvas.width,
                y: -50,
                speed: 2 + (level * 0.5),
                hp: Math.ceil(level / 2),
                size: 15 + Math.random() * 20
            });
        }
    }

    function createExplosion(x, y, color) {
        for(let i=0; i<10; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0, color: color
            });
        }
    }

    function update() {
        if(!gameActive) return;

        // Bullets
        if(Date.now() % 10 < 2) {
            bullets.push({ x: player.x, y: player.y - 20, speed: 10 });
        }

        bullets.forEach((b, i) => {
            b.y -= b.speed;
            if(b.y < 0) bullets.splice(i, 1);
        });

        // Enemies
        enemies.forEach((e, ei) => {
            e.y += e.speed;
            if(e.y > canvas.height) {
                enemies.splice(ei, 1);
                score = Math.max(0, score - 5); // Penalty for missing
            }

            // Bullet collision
            bullets.forEach((b, bi) => {
                let dist = Math.hypot(e.x - b.x, e.y - b.y);
                if(dist < e.size) {
                    e.hp--;
                    bullets.splice(bi, 1);
                    if(e.hp <= 0) {
                        createExplosion(e.x, e.y, "#ff4444");
                        enemies.splice(ei, 1);
                        score += 10;
                        if(score % 100 === 0) level++;
                    }
                }
            });

            // Player collision
            if(Math.hypot(e.x - player.x, e.y - player.y) < player.size + e.size) {
                gameActive = false;
                alert("SYSTEM OVERRIDE: SHIP DESTROYED\nFinal Score: " + score);
                location.reload();
            }
        });

        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            if(p.life <= 0) particles.splice(i, 1);
        });

        document.getElementById('n-score').innerText = score;
        document.getElementById('n-lvl').innerText = level;
    }

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Motion blur effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Player (Neon Triangle)
        ctx.shadowBlur = 15; ctx.shadowColor = "#00f2ff";
        ctx.strokeStyle = "#00f2ff"; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 20);
        ctx.lineTo(player.x - 15, player.y + 15);
        ctx.lineTo(player.x + 15, player.y + 15);
        ctx.closePath(); ctx.stroke();

        // Bullets
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 10;
        bullets.forEach(b => ctx.fillRect(b.x-2, b.y, 4, 15));

        // Enemies
        enemies.forEach(e => {
            ctx.strokeStyle = "#ff4444"; ctx.shadowColor = "#ff4444";
            ctx.strokeRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size);
        });

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 2, 2);
        });
        ctx.globalAlpha = 1.0;

        update();
        spawnEnemy();
        if(gameActive) requestAnimationFrame(draw);
    }

    draw();
    document.getElementById('n-exit').onclick = () => {
        gameActive = false;
        container.remove();
        style.remove();
    };
})();
