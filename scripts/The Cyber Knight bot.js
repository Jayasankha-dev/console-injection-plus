(function() {
    'use strict';

    // --- 1. INTELLIGENCE DATABASE ---
    const INTEL_KEY = 'knight_intel_stats';
    let sessionData = {
        linksFound: [],
        buttonsTriggered: 0,
        threatsNeutralized: parseInt(localStorage.getItem(INTEL_KEY)) || 0
    };

    const saveIntel = () => localStorage.setItem(INTEL_KEY, sessionData.threatsNeutralized);

    // --- 2. THE KNIGHT'S ARMOR (Shadow DOM UI) ---
    const host = document.createElement('div');
    host.id = 'knight-bot-root';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'closed'});

    const knightContainer = document.createElement('div');
    knightContainer.id = 'knight-bot';
    knightContainer.innerHTML = `
        <div id="knight-head">
            <span id="knight-icon">♞</span>
            <div id="knight-status">
                <small>TACTICAL SCANNER</small>
                <div id="knight-label">CYBER KNIGHT v6.0</div>
            </div>
            <div id="intel-count">0</div>
        </div>
        <div id="knight-body" style="display:none;">
            <div class="intel-section">📡 LIVE FEED (CONSOLE)</div>
            <ul id="intel-log"></ul>
            <div class="action-bar">
                <button id="btn-scan">MANUAL SCAN</button>
                <button id="btn-purge">PURGE ADS</button>
            </div>
        </div>
    `;

    // --- 3. THE KNIGHT'S STYLE (Neon Chess Theme) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #knight-bot {
            position: fixed; bottom: 40px; right: 40px; z-index: 2147483647;
            background: rgba(10, 10, 15, 0.98); border: 2px solid #00E5FF;
            border-radius: 8px; color: #00E5FF; font-family: 'Segoe UI', Tahoma, sans-serif;
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.3); width: 250px;
            user-select: none; border-left: 5px solid #00E5FF;
        }
        #knight-head { padding: 15px; display: flex; align-items: center; gap: 12px; cursor: move; }
        #knight-icon { font-size: 30px; color: #fff; filter: drop-shadow(0 0 5px #00E5FF); }
        #knight-status { flex-grow: 1; }
        #knight-label { font-weight: 800; font-size: 13px; text-transform: uppercase; }
        #intel-count { background: #00E5FF; color: #000; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        #knight-body { padding: 12px; border-top: 1px solid #1a1a1a; background: #050505; }
        .intel-section { font-size: 10px; color: #555; margin-bottom: 8px; font-weight: bold; letter-spacing: 1px; }
        #intel-log { list-style: none; padding: 0; margin: 0; max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 11px; }
        #intel-log li { padding: 5px; border-bottom: 1px solid #111; color: #00FF41; }
        .action-bar { display: flex; gap: 5px; margin-top: 10px; }
        button { flex: 1; background: #111; border: 1px solid #00E5FF; color: #00E5FF; padding: 5px; cursor: pointer; font-size: 10px; font-weight: bold; transition: 0.2s; }
        button:hover { background: #00E5FF; color: #000; }
        #intel-log::-webkit-scrollbar { width: 4px; }
        #intel-log::-webkit-scrollbar-thumb { background: #00E5FF; }
    `;
    shadow.appendChild(style);
    shadow.appendChild(knightContainer);

    // --- 4. NAVIGATION & DRAG ---
    let isDragging = false, startX, startY, initLeft, initTop;
    const head = knightContainer.querySelector('#knight-head');
    head.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = knightContainer.getBoundingClientRect();
        initLeft = rect.left; initTop = rect.top;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        knightContainer.style.left = (initLeft + (e.clientX - startX)) + 'px';
        knightContainer.style.top = (initTop + (e.clientY - startY)) + 'px';
        knightContainer.style.bottom = 'auto'; knightContainer.style.right = 'auto';
    });
    window.addEventListener('mouseup', () => isDragging = false);

    // --- 5. THE SCANNING ENGINE (Console Master) ---
    
    const logIntel = (msg, type = 'info') => {
        const li = document.createElement('li');
        li.innerText = `[${type.toUpperCase()}] ${msg}`;
        shadow.getElementById('intel-log').prepend(li);
        console.log(`%c[KNIGHT-INTEL] %c${msg}`, "color: #00E5FF; font-weight: bold", "color: #fff");
    };

    const scanForPayloads = () => {
        // A. Extract Video Links from onclick and attributes
        const links = [];
        document.querySelectorAll('*').forEach(el => {
            const attr = el.getAttribute('onclick') || "";
            const href = el.href || "";
            
            // Regex to find links inside code strings
            const linkMatch = attr.match(/https?:\/\/[^\s'"]+/);
            if (linkMatch) links.push(linkMatch[0]);
            if (href.includes('video') || href.includes('watch')) links.push(href);
        });

        // B. Detect Media Items
        if (typeof mediaItems !== 'undefined') {
            mediaItems.forEach(item => links.push(item.src));
        }

        const uniqueLinks = [...new Set(links)];
        if (uniqueLinks.length > sessionData.linksFound.length) {
            logIntel(`Captured ${uniqueLinks.length} potential sources!`, 'scan');
            sessionData.linksFound = uniqueLinks;
            shadow.getElementById('intel-count').innerText = uniqueLinks.length;
        }

        // C. Auto-Unblur everything
        document.querySelectorAll('.sw-video-card, .media-item, [class*="blurred"]').forEach(el => {
            el.style.filter = 'none';
            el.style.opacity = '1';
        });
    };

    const autoInteract = () => {
        // Auto-Click "Watch" or "Play" buttons to trigger loaders
        const targets = document.querySelectorAll('.watch-btn, .play-trigger, button[id*="play"]');
        targets.forEach(btn => {
            if (!btn.dataset.handled) {
                btn.click();
                btn.dataset.handled = "true";
                logIntel("Auto-Triggered Interaction Button", "action");
                sessionData.buttonsTriggered++;
                // Optionally remove it after clicking to clean UI
                setTimeout(() => btn.remove(), 500);
            }
        });
    };

    // --- 6. DEFENSE & CLEANING ---
    const purgeAds = () => {
        const garbage = document.querySelectorAll('.global-ad-layer, .modal, .overlay, iframe[src*="ads"]');
        garbage.forEach(g => {
            g.remove();
            sessionData.threatsNeutralized++;
            saveIntel();
        });
        logIntel("Purged all known ad overlays", "secure");
    };

    // --- 7. AUTOMATION LOOPS ---
    setInterval(scanForPayloads, 2000); // Scan for links every 2s
    setInterval(autoInteract, 3000);   // Interact with buttons every 3s
    setInterval(purgeAds, 1000);       // Clean ads every 1s

    // --- 8. UI INTERACTIONS ---
    head.addEventListener('dblclick', () => {
        const body = shadow.getElementById('knight-body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    shadow.getElementById('btn-scan').addEventListener('click', scanForPayloads);
    shadow.getElementById('btn-purge').addEventListener('click', purgeAds);

})();
