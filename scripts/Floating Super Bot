(function() {
    'use strict';

    // --- 1. MEMORY & TELEMETRY SETUP ---
    const STORAGE_KEY = 'pure_guard_stats';
    let count = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
    const saveStats = () => localStorage.setItem(STORAGE_KEY, count);
    let threatLogs = []; // Advanced logs array

    // --- 2. INVISIBLE SHIELD (Shadow DOM) ---
    const host = document.createElement('div');
    host.id = 'pure-guard-root';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'closed'});

    // --- 3. UI CONSTRUCTION (Original Cyberpunk Look) ---
    const botContainer = document.createElement('div');
    botContainer.id = 'guard-bot';
    botContainer.innerHTML = `
        <div id="bot-head" title="Double Click to see Log">
            <span id="bot-icon">🤖</span>
            <div id="bot-status">
                <small>♝♚♛♜♞</small>
                <div id="bot-label">GUARD BOT v5.0</div>
            </div>
            <div id="bot-count">${count}</div>
        </div>
        <div id="bot-body" style="display:none;">
            <div class="log-header">🛡️ DEFENSE RADAR LOG</div>
            <ul id="log-list"></ul>
            <button id="btn-report" style="width: 100%; background: #111; color: #00FF41; border: 1px solid #00FF41; padding: 6px; margin-top: 8px; cursor: pointer; font-size: 10px; font-weight: bold;">DOWNLOAD REPORT</button>
            <button id="btn-clear">PURGE MEMORY</button>
        </div>
    `;

    // --- 4. CSS STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        #guard-bot {
            position: fixed; bottom: 30px; left: 30px; z-index: 2147483647;
            background: rgba(5, 5, 5, 0.95); border: 2px solid #00FF41;
            border-radius: 12px; color: #00FF41; font-family: 'Courier New', monospace;
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.4); width: 220px;
            user-select: none; transition: border-color 0.3s;
        }
        #bot-head { padding: 12px; display: flex; align-items: center; gap: 10px; cursor: move; }
        #bot-icon { font-size: 26px; animation: pulse 2s infinite; }
        #bot-status { flex-grow: 1; pointer-events: none; }
        #bot-label { font-weight: bold; font-size: 14px; letter-spacing: 1px; }
        #bot-count { background: #ff0055; color: white; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
        #bot-body { padding: 10px; border-top: 1px solid #333; max-height: 200px; overflow-y: auto; background: #000; border-radius: 0 0 12px 12px; }
        .log-header { font-size: 10px; color: #888; margin-bottom: 5px; font-weight: bold; }
        #log-list { list-style: none; padding: 0; margin: 0; font-size: 10px; }
        #log-list li { padding: 4px; border-bottom: 1px solid #222; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        #log-list li::before { content: '>'; color: #ff0055; margin-right: 5px; }
        #btn-clear { width: 100%; background: #222; color: #ff0055; border: 1px solid #ff0055; padding: 6px; margin-top: 8px; cursor: pointer; font-size: 10px; font-weight: bold; }
        #btn-clear:hover { background: #ff0055; color: white; }
        #bot-body::-webkit-scrollbar { width: 5px; }
        #bot-body::-webkit-scrollbar-thumb { background: #00FF41; border-radius: 5px; }
        @keyframes pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 2px #00FF41); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 8px #00FF41); }
            100% { transform: scale(1); filter: drop-shadow(0 0 2px #00FF41); }
        }
    `;
    shadow.appendChild(style);
    shadow.appendChild(botContainer);

    // --- 5. DRAG LOGIC ---
    let isDragging = false, startX, startY, initLeft, initTop;
    const head = botContainer.querySelector('#bot-head');
    head.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = botContainer.getBoundingClientRect();
        initLeft = rect.left; initTop = rect.top;
        head.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        botContainer.style.left = (initLeft + (e.clientX - startX)) + 'px';
        botContainer.style.top = (initTop + (e.clientY - startY)) + 'px';
        botContainer.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => { isDragging = false; head.style.cursor = 'move'; });

    // --- 6. ADVANCED DEFENSE ENGINE ---
    const logThreat = (msg, detail = "") => {
        const time = new Date().toLocaleTimeString();
        const fullMsg = detail ? `${msg} | Detail: ${detail}` : msg;
        threatLogs.push(`[${time}] ${fullMsg}`); 
        
        count++;
        saveStats();
        shadow.getElementById('bot-count').innerText = count;
        const li = document.createElement('li');
        li.innerText = msg; // UI එකේ පේන්නේ කෙටි මැසේජ් එක විතරයි
        shadow.getElementById('log-list').prepend(li);
        botContainer.style.borderColor = '#ff0055';
        setTimeout(() => botContainer.style.borderColor = '#00FF41', 500);
    };

    // A. WINDOW OPEN BLOCKER
    window.open = function(url) {
        logThreat("Blocked Popup", url || "Unknown Script");
        return null;
    };

    // B. ENHANCED CLICK-RADAR
    let lastClickTime = 0;
    document.addEventListener('mousedown', (e) => {
        const currentTime = Date.now();
        const path = e.composedPath();
        const isClickOnVideo = path.some(el => el.tagName === 'VIDEO' || (el.className && typeof el.className === 'string' && el.className.includes('player')));

        if (currentTime - lastClickTime < 150) {
            e.stopImmediatePropagation();
            e.preventDefault();
            logThreat("Blocked Ad-Burst", "Rapid clicking detected");
            return false;
        }
        lastClickTime = currentTime;

        for (let el of path) {
            if (el.tagName === 'A' || el.hasAttribute('onclick')) {
                const href = el.href || "Inline Script";
                if (isClickOnVideo && !href.includes(window.location.hostname)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    logThreat("Defended Video Interaction", `Redirect blocked: ${href}`);
                }
            }
        }
    }, true);

    // C. ANTI-CLOSE
    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = 'Guard Bot Protected';
    });

    // D. DYNAMIC OVERLAY CLEANER
    setInterval(() => {
        const overlays = document.querySelectorAll('div, section, span, ins');
        const videos = document.querySelectorAll('video');

        overlays.forEach(el => {
            const style = window.getComputedStyle(el);
            const zIndex = parseInt(style.zIndex);
            
            if (zIndex > 100 && style.position === 'fixed' && (style.opacity === '0' || style.backgroundColor.includes('rgba(0, 0, 0, 0)'))) {
                const idInfo = el.id ? `#${el.id}` : el.className;
                el.remove();
                logThreat("Dissolved Click-Trap", `Element: ${idInfo}`);
            }

            videos.forEach(v => {
                const vRect = v.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                if (el !== v && elRect.top >= vRect.top && elRect.left >= vRect.left && elRect.width >= vRect.width * 0.8 && zIndex > 0) {
                    if (!el.className.includes('native') && !el.className.includes('control')) {
                        el.remove();
                        logThreat("Cleaned Video Overlay", `Covered area: ${Math.round(elRect.width)}px`);
                    }
                }
            });
        });
    }, 1500);

    // E. MUTATION OBSERVER
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
            const isAd = (n) => {
                if (!n || !n.tagName) return false;
                const id = n.id || "";
                const cls = n.className || "";
                return n.tagName === 'IFRAME' || id.includes('ads') || (typeof cls === 'string' && cls.includes('ad'));
            };
            if (isAd(node)) {
                logThreat("Ad Frame Vaporized", `Tag: ${node.tagName} | Info: ${node.id || node.className}`);
                node.remove();
            }
        }));
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // --- 7. INTERACTIONS ---
    shadow.getElementById('btn-report').addEventListener('click', () => {
        if (threatLogs.length === 0) return alert("No logs yet!");
        const reportHeader = `GUARD BOT ADVANCED REPORT\nTarget: ${window.location.href}\nTotal Neutralized: ${count}\nGenerated: ${new Date().toLocaleString()}\n----------------------------------------\n`;
        const reportContent = reportHeader + threatLogs.join('\n');
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Guard_Report_${window.location.hostname}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    head.addEventListener('dblclick', () => {
        const body = shadow.getElementById('bot-body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    shadow.getElementById('btn-clear').addEventListener('click', () => {
        count = 0; saveStats();
        threatLogs = [];
        shadow.getElementById('bot-count').innerText = '0';
        shadow.getElementById('log-list').innerHTML = '';
    });

})();
