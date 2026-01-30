(function() {
    // 1. Load Saved Game Data
    let savedData = JSON.parse(localStorage.getItem('snake_save_game')) || null;
    let highScore = localStorage.getItem('snake_high_score') || 0;
    
    const padding = 100;
    let canvasSize = Math.min(window.innerWidth - padding, window.innerHeight - (padding + 150));
    canvasSize = Math.floor(canvasSize / 20) * 20;

    // 2. CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #snake-pro-container {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; padding: 20px; background: rgba(0, 0, 0, 0.95);
            border: 3px solid #00f2ff; border-radius: 15px; box-shadow: 0 0 50px #000;
            font-family: 'Segoe UI', sans-serif; text-align: center; color: #fff;
        }
        .hud { display: flex; justify-content: space-around; margin-bottom: 10px; background: #111; padding: 10px; border-radius: 8px; border: 1px solid #333; }
        .hud b { color: #00f2ff; font-size: 20px; }
        #game-canvas { background: #050505; border: 2px solid #222; }
        .overlay { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: none; flex-direction: column;
            justify-content: center; align-items: center; border-radius: 15px;
        }
        .btn { 
            margin: 10px; padding: 10px 25px; border: none; border-radius: 5px; 
            cursor: pointer; font-weight: bold; transition: 0.3s;
        }
        .btn-restart { background: #00f2ff; color: #000; }
        .btn-exit { background: #ff4444; color: #fff; }
        .controls-hint { font-size: 11px; color: #666; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // 3. UI Structure
    const container = document.createElement('div');
    container.id = 'snake-pro-container';
    container.innerHTML = `
        <div class="hud">
            <div>LVL <b id="snake-lvl">1</b></div>
            <div>SCORE <b id="snake-score">0</b></div>
            <div>BEST <b id="snake-high">${highScore}</b></div>
        </div>
        <div style="position:relative;">
            <canvas id="game-canvas" width="${canvasSize}" height="${canvasSize}"></canvas>
            <div id="game-overlay" class="overlay">
                <h1 id="status-text" style="color:#ff4444;">GAME OVER</h1>
                <button class="btn btn-restart" id="btn-restart">RESTART (R)</button>
                <button class="btn btn-exit" id="btn-exit">EXIT</button>
            </div>
        </div>
        <div class="controls-hint">P: Pause & Save | R: Restart | Arrows: Move</div>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    const levelSkins = ["#00f2ff", "#ff00ff", "#ffff00", "#00ff00", "#ff4500", "#ffffff", "#8a2be2", "#00ced1", "#ff1493", "#adff2f"];

    let score, level, speed, d, snake, food, obstacles, gameLoop, isPaused = false;

    // 4. Initialization 
    function init(isResume = false) {
        if (isResume && savedData) {
            score = savedData.score;
            level = savedData.level;
            snake = savedData.snake;
            d = savedData.d;
            food = savedData.food;
            obstacles = savedData.obstacles;
            savedData = null; 
        } else {
            score = 0; level = 1; d = "RIGHT";
            snake = [{x: 5 * box, y: 5 * box}];
            food = getRandomPos();
            obstacles = [];
        }
        
        speed = Math.max(30, 110 - (level * 8));
        document.getElementById('snake-score').innerText = score;
        document.getElementById('snake-lvl').innerText = level;
        document.getElementById('game-overlay').style.display = 'none';
        
        if(gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, speed);
        isPaused = false;
    }

    function getRandomPos() {
        return {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    }

    function createObstacles() {
        obstacles = [];
        for (let i = 0; i < level * 2; i++) {
            let p = getRandomPos();
            if (p.x !== snake[0].x) obstacles.push(p);
        }
    }

    // 5. Controls
    document.onkeydown = (e) => {
        if (e.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
        else if (e.key === "ArrowUp" && d !== "DOWN") d = "UP";
        else if (e.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
        else if (e.key === "ArrowDown" && d !== "UP") d = "DOWN";
        else if (e.key.toLowerCase() === "p") togglePause();
        else if (e.key.toLowerCase() === "r") init();
        
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    };

    function togglePause() {
        if (isPaused) {
            gameLoop = setInterval(draw, speed);
            document.getElementById('game-overlay').style.display = 'none';
            isPaused = false;
        } else {
            clearInterval(gameLoop);
            isPaused = true;
            // Save current state
            const state = { score, level, snake, d, food, obstacles };
            localStorage.setItem('snake_save_game', JSON.stringify(state));
            
            document.getElementById('status-text').innerText = "GAME PAUSED & SAVED";
            document.getElementById('status-text').style.color = "#00f2ff";
            document.getElementById('game-overlay').style.display = 'flex';
        }
    }

    function draw() {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        obstacles.forEach(o => { ctx.fillStyle = "#333"; ctx.fillRect(o.x, o.y, box-1, box-1); });

        snake.forEach((p, i) => {
            ctx.fillStyle = (i === 0) ? "#fff" : levelSkins[level-1];
            ctx.shadowBlur = (i === 0) ? 15 : 5;
            ctx.shadowColor = levelSkins[level-1];
            ctx.fillRect(p.x, p.y, box-1, box-1);
        });

        ctx.fillStyle = "#ff0000";
        ctx.shadowBlur = 15;
        ctx.fillRect(food.x, food.y, box-1, box-1);

        let hX = snake[0].x, hY = snake[0].y;
        if (d === "LEFT") hX -= box; if (d === "UP") hY -= box;
        if (d === "RIGHT") hX += box; if (d === "DOWN") hY += box;

        if (hX === food.x && hY === food.y) {
            score++;
            document.getElementById('snake-score').innerText = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snake_high_score', highScore);
                document.getElementById('snake-high').innerText = highScore;
            }
            if (score % 5 === 0 && level < 10) {
                level++;
                document.getElementById('snake-lvl').innerText = level;
                speed = Math.max(30, 110 - (level * 8));
                clearInterval(gameLoop);
                gameLoop = setInterval(draw, speed);
                createObstacles();
            }
            food = getRandomPos();
        } else {
            snake.pop();
        }

        let newH = {x: hX, y: hY};
        if (hX < 0 || hX >= canvas.width || hY < 0 || hY >= canvas.height || 
            snake.some(s => s.x === hX && s.y === hY) || 
            obstacles.some(o => o.x === hX && o.y === hY)) {
            gameOver();
        }
        snake.unshift(newH);
    }

    function gameOver() {
        clearInterval(gameLoop);
        localStorage.removeItem('snake_save_game'); 
        document.getElementById('status-text').innerText = "GAME OVER";
        document.getElementById('status-text').style.color = "#ff4444";
        document.getElementById('game-overlay').style.display = 'flex';
    }

    document.getElementById('btn-restart').onclick = () => init();
    document.getElementById('btn-exit').onclick = () => { clearInterval(gameLoop); container.remove(); };

    // Start Game - Check if there is a save
    if (savedData) {
        if (confirm("You have a saved game! Do you want to resume?")) {
            init(true);
        } else {
            localStorage.removeItem('snake_save_game');
            init();
        }
    } else {
        init();
    }
})();
