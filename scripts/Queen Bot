(function() {
    'use strict';

    // --- 1. INTELLIGENCE ENGINE (The Hive Mind) ---
    const queenIntel = {
        categories: {
            "Media/Video": [],
            "API/Data Sources": [],
            "Internal Links": [],
            "External/Ads": []
        },
        stats: { wallsBroken: 0, itemsScanned: 0 },
        rawLinks: new Set()
    };

    // --- 2. ROYAL UI (The Command Center) ---
    const host = document.createElement('div');
    host.id = 'queen-root';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'closed'});

    const queenUI = document.createElement('div');
    queenUI.id = 'queen-frame';
    queenUI.innerHTML = `
        <div id="queen-header">
            <span id="queen-icon">♛</span>
            <div id="status-box">
                <div id="queen-title">QUEEN INTELLIGENCE</div>
                <small id="queen-state">MAPPING DOM...</small>
            </div>
            <div id="item-counter">0</div>
        </div>
        <div id="queen-dashboard" style="display:none;">
            <div class="report-grid">
                <div class="stat-card">Walls: <span id="wall-count">0</span></div>
                <div class="stat-card">Items: <span id="item-count">0</span></div>
            </div>
            <div id="report-view">
                <p style="color:#888; font-size:10px;">Deep Scan in progress...</p>
            </div>
            <div class="control-room">
                <button id="btn-deep-scan">DEEP SCAN</button>
                <button id="btn-export">EXPORT REPORT</button>
            </div>
        </div>
    `;

    // --- 3. ROYAL AESTHETICS (Purple & Silver Neon) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #queen-frame {
            position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
            background: linear-gradient(135deg, #1a0033 0%, #000 100%);
            border: 2px solid #bc13fe; border-radius: 12px; color: #fff;
            font-family: 'Segoe UI', sans-serif; width: 320px;
            box-shadow: 0 0 25px rgba(188, 19, 254, 0.4); overflow: hidden;
        }
        #queen-header { padding: 15px; display: flex; align-items: center; gap: 12px; cursor: move; background: rgba(188, 19, 254, 0.1); }
        #queen-icon { font-size: 32px; color: #bc13fe; filter: drop-shadow(0 0 8px #bc13fe); }
        #queen-title { font-weight: 900; letter-spacing: 1px; font-size: 14px; color: #bc13fe; }
        #item-counter { background: #fff; color: #1a0033; padding: 2px 10px; border-radius: 5px; font-weight: bold; font-size: 12px; }
        #queen-dashboard { padding: 15px; border-top: 1px solid #bc13fe; }
        .report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .stat-card { background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; font-size: 11px; text-align: center; border: 1px solid #333; }
        #report-view { 
            max-height: 250px; overflow-y: auto; background: rgba(0,0,0,0.3); 
            border-radius: 4px; padding: 10px; font-size: 11px; font-family: monospace;
        }
        .cat-title { color: #bc13fe; font-weight: bold; margin-top: 10px; border-bottom: 1px solid #333; }
        .link-item { color: #00E5FF; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 4px 0; cursor: pointer; }
        .control-room { display: flex; gap: 10px; margin-top: 15px; }
        button { flex: 1; padding: 8px; background: #bc13fe; border: none; color: #fff; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 11px; }
        button:hover { background: #d05cfe; }
        #report-view::-webkit-scrollbar { width: 4px; }
        #report-view::-webkit-scrollbar-thumb { background: #bc13fe; }
    `;
    shadow.appendChild(style);
    shadow.appendChild(queenUI);

    // --- 4. THE SUPREME SCANNER LOGIC ---
    
    const categorizeLink = (url) => {
        if (url.match(/\.(mp4|m3u8|webm|mov|avi)/i) || url.includes('video') || url.includes('stream')) return "Media/Video";
        if (url.includes('api') || url.includes('json') || url.includes('v1/')) return "API/Data Sources";
        if (url.includes(window.location.hostname)) return "Internal Links";
        return "External/Ads";
    };

    const runDeepScan = () => {
        shadow.getElementById('queen-state').innerText = "SCANNING DEEP...";
        
        // A. Inspect every attribute of every element (Recursive)
        document.querySelectorAll('*').forEach(el => {
            queenIntel.stats.itemsScanned++;
            
            // Check all attributes for URLs
            Array.from(el.attributes).forEach(attr => {
                const value = attr.value;
                const urlMatch = value.match(/https?:\/\/[^\s'"]+/g);
                if (urlMatch) {
                    urlMatch.forEach(link => {
                        if (!queenIntel.rawLinks.has(link)) {
                            queenIntel.rawLinks.add(link);
                            queenIntel.categories[categorizeLink(link)].push(link);
                        }
                    });
                }
            });
        });

        // B. Data Mining - Extract JSON from Script Tags
        document.querySelectorAll('script').forEach(script => {
            const content = script.innerHTML;
            const linkMatch = content.match(/https?:\/\/[^\s'"]+/g);
            if (linkMatch) {
                linkMatch.forEach(link => {
                    if (!queenIntel.rawLinks.has(link)) {
                        queenIntel.rawLinks.add(link);
                        queenIntel.categories[categorizeLink(link)].push(link);
                    }
                });
            }
        });

        updateReport();
        shadow.getElementById('queen-state').innerText = "SCAN COMPLETE";
    };

    const updateReport = () => {
        const view = shadow.getElementById('report-view');
        view.innerHTML = "";
        
        for (const [cat, links] of Object.entries(queenIntel.categories)) {
            if (links.length > 0) {
                const div = document.createElement('div');
                div.innerHTML = `<div class="cat-title">${cat} (${links.length})</div>`;
                links.slice(0, 15).forEach(link => { // Show first 15 for performance
                    div.innerHTML += `<span class="link-item" title="${link}">${link}</span>`;
                });
                view.appendChild(div);
            }
        }
        shadow.getElementById('item-count').innerText = queenIntel.rawLinks.size;
        shadow.getElementById('item-counter').innerText = queenIntel.rawLinks.size;
    };

    // --- 5. WALL BREAKER (Investing.com & Paywall Nuke) ---
    const nukeWalls = () => {
        const triggers = ['.paywall', '.reg-gate', '.modal-overlay', '.signup-prompt', '[class*="Overlay"]'];
        triggers.forEach(t => {
            document.querySelectorAll(t).forEach(el => {
                el.remove();
                queenIntel.stats.wallsBroken++;
            });
        });
        
        // Unmasking hidden content hidden by height/blur
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.filter.includes('blur') || style.maxHeight === '0px' || style.display === 'none') {
                if (el.innerText.length > 50) { // Only unmask if it looks like actual content
                    el.style.setProperty('filter', 'none', 'important');
                    el.style.setProperty('display', 'block', 'important');
                    el.style.setProperty('max-height', 'none', 'important');
                    el.style.setProperty('visibility', 'visible', 'important');
                }
            }
        });
        shadow.getElementById('wall-count').innerText = queenIntel.stats.wallsBroken;
    };

    // --- 6. DRAG & INTERACTIONS ---
    let isDragging = false, startX, startY, initLeft, initTop;
    queenUI.onmousedown = (e) => {
        if(e.target.id === 'queen-header' || e.target.parentElement.id === 'queen-header') {
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = queenUI.getBoundingClientRect();
            initLeft = rect.left; initTop = rect.top;
        }
    };
    window.onmousemove = (e) => {
        if (!isDragging) return;
        queenUI.style.left = (initLeft + (e.clientX - startX)) + 'px';
        queenUI.style.top = (initTop + (e.clientY - startY)) + 'px';
        queenUI.style.bottom = 'auto'; queenUI.style.right = 'auto';
    };
    window.onmouseup = () => isDragging = false;

    queenUI.ondblclick = () => {
        const dash = shadow.getElementById('queen-dashboard');
        dash.style.display = dash.style.display === 'none' ? 'block' : 'none';
    };

    shadow.getElementById('btn-deep-scan').onclick = runDeepScan;
    shadow.getElementById('btn-export').onclick = () => {
        console.log("♛ QUEEN REPORT ♛", queenIntel.categories);
        alert("Report exported to Browser Console (F12)");
    };

    // Continuous Guarding
    setInterval(nukeWalls, 1500);
    setInterval(runDeepScan, 5000);

})();
