(function() {
    'use strict';

    const VoidSentinel = {
        stats: { neutralized: 0, logs: [] },

        // --- 1. LOGGING & THREAT DETECTION ---
        logThreat: function(msg) {
            this.stats.neutralized++;
            const logDisplay = document.getElementById('term-log');
            if (logDisplay) {
                const entry = document.createElement('div');
                entry.innerHTML = `<span style="color:#ff0055;">[NEUTRALIZED]</span> ${msg.toUpperCase()}`;
                logDisplay.prepend(entry);
            }
            const countEl = document.getElementById('bot-count');
            if (countEl) countEl.innerText = this.stats.neutralized;
        },

        
        autoExorcist: function() {
            const frame = document.getElementById('view');
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                const adSelectors = ['iframe[id*="google"]', 'ins.adsbygoogle', 'div[class*="ad-"]', 'div[id*="popup"]', '.modal-backdrop'];
                adSelectors.forEach(sel => {
                    const found = doc.querySelectorAll(sel);
                    if (found.length > 0) {
                        found.forEach(el => el.remove());
                        this.logThreat(`Vaporized ${found.length} ad elements`);
                    }
                });
            } catch (e) { /* Cross-origin restriction handling */ }
        },

        // --- 2. CSS FILTER LOGIC ---
        
        applyCustomCSS: function() {
            const cssCode = document.getElementById('css-filter-input').value;
            const frame = document.getElementById('view');
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                let styleTag = doc.getElementById('sentinel-custom-css');
                if (!styleTag) {
                    styleTag = doc.createElement('style');
                    styleTag.id = 'sentinel-custom-css';
                    doc.head.appendChild(styleTag);
                }
                styleTag.textContent = cssCode;
                this.logThreat("Custom CSS Filter Applied");
                
                
                localStorage.setItem('sentinel_saved_css', cssCode);
            } catch (e) {
                this.logThreat("CSS Error: Cannot access Frame");
            }
        },

        
        init: function() {
            document.documentElement.innerHTML = `
            <style>
                body { margin:0; background:#050505; color:#00FF41; font-family:'Consolas', monospace; display:flex; flex-direction:column; height:100vh; overflow:hidden; }
                #header { background:#000; border-bottom:2px solid #00FF41; padding:10px 20px; display:flex; align-items:center; gap:15px; }
                .logo { font-weight:bold; font-size:18px; letter-spacing:2px; text-shadow: 0 0 10px #00FF41; }
                
                #main { display:flex; flex-grow:1; overflow:hidden; }
                #sidebar { width:300px; background:#020202; border-right:1px solid #1a1a1a; display:flex; flex-direction:column; padding:15px; gap:10px; }
                
                #bot-status-card { background:#0a0a0a; border:1px solid #00FF41; padding:15px; border-radius:8px; position:relative; }
                .bot-anim { font-size:30px; animation: pulse 1.5s infinite; }
                #bot-count { position:absolute; top:10px; right:10px; background:#ff0055; color:#fff; padding:2px 8px; border-radius:10px; font-size:12px; }

                /* CSS Filter Section */
                .filter-section { border:1px solid #333; padding:10px; border-radius:5px; background:#080808; }
                .filter-title { font-size:11px; color:#00FF41; margin-bottom:5px; display:block; text-transform:uppercase; }
                #css-filter-input { width:100%; height:80px; background:#000; border:1px solid #444; color:#00ff88; font-family:monospace; font-size:11px; resize:none; outline:none; box-sizing:border-box; }
                .btn-apply { width:100%; background:#00FF41; border:none; color:#000; padding:5px; cursor:pointer; font-weight:bold; margin-top:5px; }
                
                #term-log { flex-grow:1; font-size:10px; overflow-y:auto; color:#888; border:1px solid #111; padding:5px; background:#000; }
                #viewport { flex-grow:1; background:#111; padding:10px; }
                iframe { width:100%; height:100%; border:1px solid #222; background:#fff; border-radius:5px; }
                
                .input-group { display:flex; gap:5px; flex-grow:1; }
                input { background:#000; border:1px solid #444; color:#00FF41; padding:8px; font-family:inherit; outline:none; }
                #btn-load { background:#00FF41; border:none; color:#000; padding:8px 15px; cursor:pointer; font-weight:bold; }
                
                @keyframes pulse { 0% { opacity:1; } 50% { opacity:0.5; } 100% { opacity:1; } }
            </style>

            <div id="header">
                <div class="logo">SENTINEL_V12</div>
                <div class="input-group">
                    <input type="text" id="url-bar" style="flex-grow:1;" placeholder="ENTER_SECURE_URL...">
                    <button id="btn-load">INITIALIZE</button>
                </div>
            </div>

            <div id="main">
                <div id="sidebar">
                    <div id="bot-status-card">
                        <div id="bot-count">0</div>
                        <div class="bot-anim">🤖</div>
                        <div style="font-size:14px; font-weight:bold;">GUARD_BOT ACTIVE</div>
                        <div style="font-size:9px; color:#444;">MODE: AGGRESSIVE_PURGE</div>
                    </div>

                    <div class="filter-section">
                        <span class="filter-title">Manual CSS Filters</span>
                        <textarea id="css-filter-input" placeholder=".ad-class { display:none; }"></textarea>
                        <button class="btn-apply" id="btn-apply-css">APPLY FILTERS</button>
                    </div>

                    <div style="font-size:10px; color:#00FF41;">[THREAT_SCANNER_LOG]</div>
                    <div id="term-log"></div>
                </div>

                <div id="viewport">
                    <iframe id="view" sandbox="allow-scripts allow-forms allow-same-origin" allow="autoplay; fullscreen"></iframe>
                </div>
            </div>
            `;

            this.setupEvents();
            this.startHeartbeat();
            
           
            const saved = localStorage.getItem('sentinel_saved_css');
            if(saved) document.getElementById('css-filter-input').value = saved;
        },

        setupEvents: function() {

document.getElementById('view').onload = () => {
    this.applyCustomCSS();
    this.logThreat("Page Reloaded: Filters Re-applied");
};

            
            document.getElementById('btn-load').onclick = () => {
                let url = document.getElementById('url-bar').value;
                if(!url) return;
                if(!url.startsWith('http')) url = 'https://' + url;
                document.getElementById('view').src = url;
                this.logThreat(`Scanning: ${new URL(url).hostname}`);
            };

            
            document.getElementById('btn-apply-css').onclick = () => {
                this.applyCustomCSS();
            };
        },

        startHeartbeat: function() {
            setInterval(() => {
                this.autoExorcist();
            }, 2000);
        }
    };

    VoidSentinel.init();
})();
