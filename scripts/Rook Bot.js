(function() {
    'use strict';

    const RookZapper = {
        lockedTarget: null,
        mode: 'IDLE',
        zappedCount: 0,
        isScanning: false
    };

    // --- UI CREATION (Shadow DOM) ---
    const host = document.createElement('div');
    host.id = 'rook-zapper-root';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'closed'});

    const ui = document.createElement('div');
    ui.id = 'rook-frame';
    ui.innerHTML = `
        <div id="rook-header">
            <span>♜ ROOK BOT</span>
            <span id="mode-tag">READY</span>
        </div>
        <div id="rook-body">
            <div id="bot-status">
                <div id="bot-face">◕‿◕</div>
                <div id="speech-bubble">Play the video and click SCAN!</div>
            </div>
            <div id="display">Zapped: <span id="z-count">0</span></div>
            <div class="btn-grid">
                <button id="btn-scan" class="prime-btn">🔍 AUTO SCAN</button>
                <button id="btn-draw">✏️ DRAW</button>
                <button id="btn-zap">⚡ ZAP</button>
                <button id="btn-nuke">💥 NUKE</button>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        #rook-frame {
            position: fixed; top: 120px; right: 20px; z-index: 2147483647;
            background: #0d1117; border: 2px solid #00FF41; border-radius: 15px;
            width: 260px; font-family: 'Segoe UI', sans-serif; color: #00FF41;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.2); overflow: hidden;
        }
        #rook-header { background: #00FF41; color: #000; padding: 10px; font-weight: bold; cursor: move; display: flex; justify-content: space-between; align-items: center; }
        #mode-tag { font-size: 10px; background: #000; color: #00FF41; padding: 2px 6px; border-radius: 4px; }
        #rook-body { padding: 15px; display: flex; flex-direction: column; gap: 12px; }
        
        /* Bot Look */
        #bot-status { display: flex; align-items: center; gap: 10px; background: #161b22; padding: 10px; border-radius: 8px; }
        #bot-face { font-size: 24px; font-weight: bold; transition: 0.3s; }
        #speech-bubble { font-size: 11px; color: #c9d1d9; line-height: 1.2; }
        
        #display { font-size: 11px; color: #8b949e; text-align: center; border-top: 1px solid #30363d; padding-top: 5px; }
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .prime-btn { grid-column: span 2; background: #00FF41 !important; color: #000 !important; }
        #btn-nuke { grid-column: span 2; background: #f85149; color: #fff; border: none; margin-top: 5px; }
        button { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 8px; cursor: pointer; font-size: 11px; font-weight: bold; border-radius: 6px; transition: 0.2s; }
        button:hover { border-color: #00FF41; color: #00FF41; }
        
        .drawing-active { cursor: crosshair !important; }
    `;
    shadow.appendChild(style);
    shadow.appendChild(ui);

    // --- CANVAS FOR DRAWING ---
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:2147483646;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    // --- BOT PERSONALITY ---
    const botTalk = (face, msg) => {
        shadow.getElementById('bot-face').innerText = face;
        shadow.getElementById('speech-bubble').innerText = msg;
    };

    // --- MOTION SENSING & AUTO SCAN ---
    const autoScan = () => {
        botTalk("⊙_⊙", "Scanning for motion...");
        RookZapper.isScanning = true;

        
        const videos = document.querySelectorAll('video');
        let bestVideo = null;

        videos.forEach(v => {
            // (Motion Detection)
            if (v.readyState >= 2 && !v.paused && v.offsetWidth > 0) {
                bestVideo = v;
            }
        });

        if (bestVideo) {
            lockTarget(bestVideo);
            botTalk("◕‿◕", "Target Locked! Ready to Nuke.");
        } else {
           
            const containers = document.querySelectorAll('[class*="player"], [id*="player"], [class*="video-container"]');
            if (containers.length > 0) {
                lockTarget(containers[0]);
                botTalk("◉_◉", "Found a container. Is this it?");
            } else {
                botTalk("✖_✖", "No motion detected. Try DRAWING.");
            }
        }
    };

    const lockTarget = (el) => {
        if (!el || el.id.includes('rook')) return;
        RookZapper.lockedTarget = el;
        el.style.transition = "outline 0.4s ease";
        el.style.outline = "4px solid #00FF41";
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // --- DRAWING LOGIC ---
    let drawing = false;
    window.addEventListener('mousedown', (e) => {
        if (RookZapper.mode !== 'DRAW') return;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
        ctx.strokeStyle = '#00FF41';
        ctx.lineWidth = 3;
    });

    window.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        let el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && (el.tagName === 'VIDEO' || el.querySelector('video'))) lockTarget(el);
    });

    window.addEventListener('mouseup', () => {
        if (!drawing) return;
        drawing = false;
        botTalk("◕‿↼", "Target captured manually.");
        setTimeout(() => {
            RookZapper.mode = 'IDLE';
            canvas.style.pointerEvents = 'none';
        }, 500);
    });

    // --- BUTTON CLICKS ---
    shadow.getElementById('btn-scan').onclick = autoScan;

    shadow.getElementById('btn-draw').onclick = () => {
        RookZapper.mode = 'DRAW';
        canvas.style.pointerEvents = 'auto';
        botTalk("◉_◉", "Draw a line over the video!");
    };

    shadow.getElementById('btn-zap').onclick = () => {
        RookZapper.mode = 'ZAP';
        botTalk("⚡_⚡", "Click anything to DESTROY it.");
    };

    window.addEventListener('click', (e) => {
        if (RookZapper.mode === 'ZAP') {
            e.preventDefault(); e.stopPropagation();
            e.target.remove();
            RookZapper.zappedCount++;
            shadow.getElementById('z-count').innerText = RookZapper.zappedCount;
        }
    }, true);

    shadow.getElementById('btn-nuke').onclick = () => {
        if (!RookZapper.lockedTarget) return botTalk("✖_✖", "Select a target first!");
        
        botTalk("💥_💥", "BYE BYE ADS!");
        const styleStrike = document.createElement('style');
        styleStrike.innerHTML = `
            body, html { background: #000 !important; overflow: hidden !important; }
            #rook-zapper-root { display: block !important; }
            .vessel { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483640 !important; object-fit: contain; background: #000 !important; }
        `;
        document.head.appendChild(styleStrike);
        RookZapper.lockedTarget.classList.add('vessel');
    };

    // Dragging Logic
    let isDragging = false, startX, startY, initLeft, initTop;
    ui.querySelector('#rook-header').onmousedown = (e) => {
        isDragging = true; startX = e.clientX; startY = e.clientY;
        const rect = ui.getBoundingClientRect();
        initLeft = rect.left; initTop = rect.top;
    };
    window.onmousemove = (e) => {
        if (!isDragging) return;
        ui.style.left = (initLeft + (e.clientX - startX)) + 'px';
        ui.style.top = (initTop + (e.clientY - startY)) + 'px';
        ui.style.right = 'auto';
    };
    window.onmouseup = () => isDragging = false;

})();
