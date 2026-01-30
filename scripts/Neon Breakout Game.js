(function() {
    // 1. Setup & High Score
    let highScore = localStorage.getItem('breakout_high_score') || 0;
    const padding = 100;
    let canvasW = Math.min(window.innerWidth - padding, 800);
    let canvasH = Math.min(window.innerHeight - (padding + 150), 600);

    const style = document.createElement('style');
    style.innerHTML = `
        #breakout-container {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; padding: 20px; background: rgba(5, 5, 10, 0.95);
            border: 3px solid #ff00ff; border-radius: 15px; box-shadow: 0 0 40px #ff00ff;
            font-family: 'Orbitron', sans-serif; text-align: center; color: #fff;
        }
        .hud { display: flex; justify-content: space-around; margin-bottom: 15px; font-weight: bold; color: #00f2ff; }
        #breakout-canvas { background: #000; border: 1px solid #333; cursor: none; }
        .controls { font-size: 12px; color: #666; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'breakout-container';
    container.innerHTML = `
        <div class="hud">
            <div>SCORE: <span id="b-score">0</span></div>
            <div>BEST: <span>${highScore}</span></div>
            <div>LEVEL: <span id="b-lvl">1</span></div>
        </div>
        <canvas id="breakout-canvas" width="${canvasW}" height="${canvasH}"></canvas>
        <div class="controls">Move: Mouse / Arrows | P: Pause | R: Reset</div>
        <button id="close-b" style="margin-top:10px; background:#ff4444; border:none; color:white; padding:5px 10px; cursor:pointer; border-radius:5px;">EXIT</button>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('breakout-canvas');
    const ctx = canvas.getContext('2d');

    // Game Objects
    let ball = { x: canvasW/2, y: canvasH-30, dx: 4, dy: -4, radius: 8 };
    let paddle = { h: 10, w: 100, x: (canvasW-100)/2 };
    let brickRowCount = 5, brickColumnCount = 8;
    let brickW = (canvasW - 60) / brickColumnCount, brickH = 25, brickPadding = 5, brickOffsetTop = 30, brickOffsetLeft = 30;
    let bricks = [], score = 0, level = 1, paused = false;

    function createBricks() {
        bricks = [];
        for(let c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(let r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1, color: `hsl(${(r * 40) + 200}, 100%, 50%)` };
            }
        }
    }

    // Input
    document.addEventListener("mousemove", (e) => {
        let relativeX = e.clientX - canvas.getBoundingClientRect().left;
        if(relativeX > 0 && relativeX < canvasW) paddle.x = relativeX - paddle.w/2;
    });

    document.addEventListener("keydown", (e) => {
        if(e.key === "p" || e.key === "P") paused = !paused;
        if(e.key === "r" || e.key === "R") location.reload();
    });

    function collisionDetection() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(ball.x > b.x && ball.x < b.x+brickW && ball.y > b.y && ball.y < b.y+brickH) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        document.getElementById('b-score').innerText = score;
                        if(score == brickRowCount * brickColumnCount) {
                            level++;
                            document.getElementById('b-lvl').innerText = level;
                            ball.dx += 1; ball.dy = -(Math.abs(ball.dy)+1);
                            createBricks();
                            ball.x = canvasW/2; ball.y = canvasH-30;
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = "#00f2ff";
        ctx.shadowBlur = 10; ctx.shadowColor = "#00f2ff";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, canvasH-paddle.h-10, paddle.w, paddle.h);
        ctx.fillStyle = "#ff00ff";
        ctx.shadowBlur = 15; ctx.shadowColor = "#ff00ff";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (c*(brickW+brickPadding))+brickOffsetLeft;
                    let brickY = (r*(brickH+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickW, brickH);
                    ctx.fillStyle = bricks[c][r].color;
                    ctx.shadowBlur = 5; ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        if(paused) return requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvasW, canvasH);
        drawBricks(); drawBall(); drawPaddle();
        collisionDetection();

        if(ball.x + ball.dx > canvasW-ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
        if(ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
        else if(ball.y + ball.dy > canvasH-ball.radius-10) {
            if(ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
                ball.dy = -ball.dy;
                // Add spin
                ball.dx = 8 * ((ball.x - (paddle.x + paddle.w / 2)) / paddle.w);
            } else {
                alert("GAME OVER! Score: " + score);
                if(score > highScore) localStorage.setItem('breakout_high_score', score);
                score = 0; level = 1; ball.dx = 4; ball.dy = -4;
                createBricks();
                ball.x = canvasW/2; ball.y = canvasH-30;
            }
        }

        ball.x += ball.dx; ball.y += ball.dy;
        requestAnimationFrame(draw);
    }

    createBricks();
    draw();

    document.getElementById('close-b').onclick = () => container.remove();
})();
