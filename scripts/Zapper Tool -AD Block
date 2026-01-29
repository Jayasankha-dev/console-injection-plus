(function() {
    'use strict';

    const currentDomain = window.location.hostname;
    const STORAGE_KEY = `shield_v19_filters_${currentDomain}`;
    let savedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    let zapMode = false;

    // 1. PROTECTION & ANTI-CLOSURE
    const shieldTab = () => {
        window.addEventListener('beforeunload', (e) => e.stopImmediatePropagation(), true);
        window.close = () => console.warn("🛡️ SHIELD: Closure blocked.");
        history.pushState(null, null, location.href);
        window.onpopstate = () => history.go(1);
    };

    // 2. CSS SELECTOR GENERATOR
    const generateSelector = (el) => {
        if (el.id) return `#${CSS.escape(el.id)}`;
        let path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.className) {
                const cleanClasses = Array.from(el.classList)
                    .filter(c => !['zapper-highlight'].includes(c))
                    .map(c => `.${CSS.escape(c)}`).join('');
                selector += cleanClasses;
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) { if (sib.nodeName.toLowerCase() == selector) nth++; }
                if (nth != 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode;
            if (!el || el.nodeName === 'BODY' || el.nodeName === 'HTML') break;
        }
        return path.join(' > ');
    };

    // 3. UI & STYLES
    const injectUI = () => {
        if (document.getElementById('shield-container')) return;
        const style = document.createElement('style');
        style.innerHTML = `
            #shield-container {
                position: fixed; bottom: 20px; left: 20px; z-index: 2147483647 !important;
                background: #0d1117; color: #58a6ff; padding: 12px; border-radius: 10px;
                border: 1px solid #30363d; font-family: sans-serif; width: 195px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            }
            .shield-btn {
                width: 100%; margin: 4px 0; padding: 8px; border-radius: 6px; border: 1px solid #30363d;
                background: #21262d; color: #c9d1d9; cursor: pointer; font-size: 11px; font-weight: bold;
            }
            .shield-btn:hover { background: #30363d; }
            .shield-btn.active { background: #238636; color: white; border-color: #3fb950; }
            .zapper-highlight { outline: 3px solid #f85149 !important; outline-offset: -3px; background: rgba(248,81,73,0.1) !important; cursor: crosshair !important; }
            ${savedFilters.length > 0 ? `${savedFilters.join(', ')} { display: none !important; }` : ''}
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'shield-container';
        container.innerHTML = `
            <div style="text-align:center; font-size:10px; opacity:0.7; margin-bottom:8px;">🛡️ SHIELD V19</div>
            <button id="btn-zap" class="shield-btn">⚡ ZAPPER (ALT+X)</button>
            <button id="btn-export-css" class="shield-btn" style="color:#00ff88">🔗 COPY CSS FILTERS</button>
            <button id="btn-export-file" class="shield-btn">💾 EXPORT SHIELD SCRIPT</button>
            <button id="btn-import-file" class="shield-btn">📂 IMPORT FILTERS</button>
            <button id="btn-res" class="shield-btn" style="color:#f85149">RESET (${savedFilters.length})</button>
            <input type="file" id="shield-file-input" style="display:none" accept=".js,.json">
        `;
        document.body.appendChild(container);
    };

    // 4. MAIN LOGIC
    const startShield = () => {
        const zapBtn = document.getElementById('btn-zap');
        let lastEl = null;

        const toggleZap = (state) => {
            zapMode = (state !== undefined) ? state : !zapMode;
            zapBtn.classList.toggle('active', zapMode);
            zapBtn.innerText = zapMode ? "🎯 SELECT ELEMENT" : "⚡ ZAPPER (ALT+X)";
            if (!zapMode && lastEl) lastEl.classList.remove('zapper-highlight');
        };

        window.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'x') { e.preventDefault(); toggleZap(); }
            if (e.key === 'Escape') toggleZap(false);
        }, true);

        document.addEventListener('mouseover', (e) => {
            if (!zapMode || e.target.closest('#shield-container')) return;
            if (lastEl) lastEl.classList.remove('zapper-highlight');
            lastEl = e.target; lastEl.classList.add('zapper-highlight');
        }, true);

        document.addEventListener('click', (e) => {
            if (!zapMode || e.target.closest('#shield-container')) return;
            e.preventDefault(); e.stopImmediatePropagation();
            const selector = generateSelector(e.target);
            if (selector && !savedFilters.includes(selector)) {
                savedFilters.push(selector);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
                e.target.style.setProperty('display', 'none', 'important');
                document.getElementById('btn-res').innerText = `RESET (${savedFilters.length})`;
            }
        }, true);

        // --- EXPORT AS FULL JS SCRIPT ---
        document.getElementById('btn-export-file').onclick = () => {
            if (savedFilters.length === 0) return alert("No elements zapped yet!");
            
            
            const scriptTemplate = `(function() {
    'use strict';
    console.log("🛡️ Shield Active on ${currentDomain}");

    // --- 1. CONFIGURATION (Auto-Generated) ---
    const blockedSelectors = ${JSON.stringify(savedFilters, null, 8)};
    const adPatterns = /ad|popup|popunder|shorthub/i;

    // --- 2. KILL FUNCTION ---
    const killElement = (el) => {
        if (!el) return;
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.innerHTML = '';
        if(el.parentNode) el.remove();
    };

    const cleanPage = () => {
        blockedSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(killElement);
        });
        // Generic Cleanup
        document.querySelectorAll('[data-izone], .E5IaTEu, [class*="ad-"], [id*="ad-"]').forEach(killElement);
    };

    // --- 3. POPUP BLOCKER ---
    try {
        const originalOpen = window.open;
        window.open = function(url, name, specs) {
            console.warn("🛡️ Shield Blocked Popup:", url);
            return { close: () => {}, focus: () => {}, closed: true };
        };
    } catch(e) {}

    // --- 4. MUTATION WATCHDOG ---
    const observer = new MutationObserver(() => {
        cleanPage();
        if (document.body.style.overflow === 'hidden') document.body.style.overflow = 'auto !important';
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // --- 5. INITIAL RUN ---
    cleanPage();
    setInterval(cleanPage, 2000);
})();`;

            const blob = new Blob([scriptTemplate], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Shield_${currentDomain.replace(/\./g, '_')}.js`;
            a.click();
            URL.revokeObjectURL(url);
        };

        // --- IMPORT FILTERS ---
        const fileInput = document.getElementById('shield-file-input');
        document.getElementById('btn-import-file').onclick = () => fileInput.click();

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const content = ev.target.result;
                    let selectors;
                   
                    if (content.includes('const blockedSelectors =')) {
                        const match = content.match(/const blockedSelectors = (\[.*?\]);/s);
                        selectors = JSON.parse(match[1]);
                    } else {
                        selectors = JSON.parse(content);
                    }

                    if (Array.isArray(selectors)) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectors));
                        alert("Shield Updated Successfully!");
                        location.reload();
                    }
                } catch (err) { alert("Error: Unsupported file format!"); }
            };
            reader.readAsText(file);
        };

        document.getElementById('btn-res').onclick = () => {
            if (confirm("Reset and restore site?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); }
        };
    };

    shieldTab();
    injectUI();
    startShield();
document.getElementById('btn-export-css').onclick = () => {
    if (savedFilters.length === 0) return alert("No elements zapped yet!");
    
    
    const cssContent = savedFilters.join(', \n') + ' { display: none !important; }';
    
    
    navigator.clipboard.writeText(cssContent).then(() => {
        const btn = document.getElementById('btn-export-css');
        const originalText = btn.innerText;
        btn.innerText = "✅ COPIED!";
        setTimeout(() => { btn.innerText = originalText; }, 2000);
    }).catch(err => {
        alert("Error copying to clipboard: " + err);
    });
};
    
    setInterval(() => {
        savedFilters.forEach(s => {
            document.querySelectorAll(s).forEach(el => {
                if (el.style.display !== 'none') el.style.setProperty('display', 'none', 'important');
            });
        });
    }, 1000);
})();
