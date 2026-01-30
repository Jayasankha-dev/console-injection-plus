(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #coding-game-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 10000; background: #050505; font-family: 'Consolas', monospace; color: #00ff88;
        }
        .header { padding: 20px; border-bottom: 2px solid #00ff88; display: flex; justify-content: space-between; background: rgba(0,255,136,0.1); }
        .game-area { display: flex; height: calc(100vh - 80px); }
        .visual-side { flex: 1; position: relative; border-right: 1px solid #333; overflow: hidden; }
        .coding-side { flex: 1; padding: 40px; background: #0a0a0a; display: flex; flex-direction: column; justify-content: center; }
        
        .code-input-area { background: #000; padding: 30px; border: 1px solid #00ff88; border-radius: 8px; box-shadow: 0 0 20px rgba(0,255,136,0.2); }
        .question { margin-bottom: 20px; font-size: 18px; color: #fff; }
        #code-display { font-size: 20px; margin-bottom: 20px; line-height: 1.5; }
        input#user-answer { 
            background: transparent; border: none; border-bottom: 2px solid #00ff88; 
            color: #ff00ff; font-family: inherit; font-size: 20px; width: 150px; outline: none;
        }
        .hp-bar-wrap { width: 250px; height: 15px; background: #222; border: 1px solid #00ff88; margin-top: 5px; }
        #hp-player { height: 100%; background: #00ff88; width: 100%; transition: 0.5s; }
        #hp-enemy { height: 100%; background: #ff4444; width: 100%; transition: 0.5s; }
        
        .feedback { margin-top: 20px; font-weight: bold; height: 20px; }
        .exit-btn { background: none; border: 1px solid #ff4444; color: #ff4444; cursor: pointer; padding: 5px 15px; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'coding-game-container';
    container.innerHTML = `
        <div class="header">
            <div>CONSOLE_LEARNER v1.0</div>
            <div style="text-align:center">LEVEL: <span id="lvl-num">1</span></div>
            <button class="exit-btn" id="quit-game">QUIT</button>
        </div>
        <div class="game-area">
            <div class="visual-side">
                <div style="position:absolute; top:20px; left:20px;">
                    PLAYER_HP <div class="hp-bar-wrap"><div id="hp-player"></div></div>
                </div>
                <div style="position:absolute; top:20px; right:20px;">
                    BUG_HP <div class="hp-bar-wrap"><div id="hp-enemy"></div></div>
                </div>
                <canvas id="gameCanvas"></canvas>
            </div>
            <div class="coding-side">
                <div class="code-input-area">
                    <div class="question" id="q-text">Complete the code to attack:</div>
                    <div id="code-display"></div>
                    <div class="feedback" id="feedback-text"></div>
                    <p style="font-size:12px; color:#555; margin-top:30px;">Type the missing part and press ENTER</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight - 80;

    // --- Game Data ---
    const challenges = [
        { q: "Create a variable named 'power':", code: "let <input id='user-answer' type='text'> = 100;", ans: "power" },
        { q: "Call the function to attack:", code: "player.<input id='user-answer' type='text'>();", ans: "attack" },
        { q: "Access the first element of the array:", code: "weapons[<input id='user-answer' type='text'>];", ans: "0" },
        { q: "Complete the IF statement:", code: "if (hp <input id='user-answer' type='text'> 0) { die(); }", ans: "<" },
        { q: "Define a function:", code: "<input id='user-answer' type='text'> start() { }", ans: "function" },
        { q: "Add to the score:", code: "score <input id='user-answer' type='text'> 1;", ans: "+=" }
    ];

    let currentLvl = 0;
    let playerHp = 100;
    let enemyHp = 100;

    function loadChallenge() {
        const chall = challenges[currentLvl % challenges.length];
        document.getElementById('q-text').innerText = chall.q;
        document.getElementById('code-display').innerHTML = chall.code;
        document.getElementById('lvl-num').innerText = currentLvl + 1;
        document.getElementById('user-answer').focus();

        // Handle Input
        document.getElementById('user-answer').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                checkAnswer(this.value, chall.ans);
            }
        });
    }

    function checkAnswer(userVal, correctVal) {
        const feedback = document.getElementById('feedback-text');
        if (userVal.trim() === correctVal) {
            feedback.style.color = "#00ff88";
            feedback.innerText = "✓ CODE_VALIDATED: ATTACKING...";
            enemyHp -= 25;
            triggerEffect("attack");
            setTimeout(nextLevel, 1000);
        } else {
            feedback.style.color = "#ff4444";
            feedback.innerText = "✗ SYNTAX_ERROR: BUG COUNTER-ATTACKED!";
            playerHp -= 15;
            triggerEffect("damage");
        }
        updateUI();
    }

    function nextLevel() {
        if (enemyHp <= 0) {
            alert("BUG TERMINATED! Leveling up...");
            enemyHp = 100;
            currentLvl++;
        }
        document.getElementById('feedback-text').innerText = "";
        loadChallenge();
    }

    function updateUI() {
        document.getElementById('hp-player').style.width = playerHp + "%";
        document.getElementById('hp-enemy').style.width = enemyHp + "%";
        if (playerHp <= 0) {
            alert("SYSTEM CRASHED! Try again.");
            location.reload();
        }
    }

    // --- Simple Visuals ---
    function triggerEffect(type) {
        ctx.fillStyle = type === "attack" ? "#00ff88" : "#ff4444";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCharacters();
        }, 100);
    }

    function drawCharacters() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Player
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(100, canvas.height - 150, 50, 100);
        // Enemy (Bug)
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(canvas.width - 150, canvas.height - 100, 40, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCharacters();
    loadChallenge();

    document.getElementById('quit-game').onclick = () => container.remove();
})();
