(function() {
    'use strict';

    const Bishop = {
        streams: [],
        iframes: []
    };

    // --- 1. UI SETUP (Shadow DOM) ---
    const host = document.createElement('div');
    host.id = 'bishop-v6-root';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'closed'});

    const ui = document.createElement('div');
    ui.id = 'b-frame';
    ui.innerHTML = `
        <div id="b-header">♝ BISHOP STREAM SNIPER ULTIMATE</div>
        <div id="b-body">
            <div id="status-box">
                <div id="b-pulse"></div>
                <div id="b-msg">Sniffing Network & Elements...</div>
            </div>
            <div id="stream-list">
                <div class="empty-msg">No streams detected. Play the video!</div>
            </div>
            <hr>
            <button id="btn-force" class="prime">🔥 DOWNLOAD ALL DETECTED</button>
            <p style="font-size:9px; color:#888; margin-top:5px; text-align:center;">
                * Click item to <b>COPY LINK</b> to Clipboard.
            </p>
        </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        #b-frame { position: fixed; top: 20px; right: 20px; z-index: 2147483647; background: #0a0a0c; border: 1px solid #7d42ff; border-radius: 12px; width: 320px; font-family: monospace; color: #fff; box-shadow: 0 0 20px rgba(125, 66, 255, 0.4); }
        #b-header { background: #7d42ff; padding: 10px; font-weight: bold; cursor: move; text-align: center; font-size: 11px; border-radius: 11px 11px 0 0; }
        #b-body { padding: 15px; }
        #status-box { display: flex; align-items: center; gap: 10px; background: #111; padding: 8px; border-radius: 5px; }
        #b-pulse { width: 8px; height: 8px; background: #00ff00; border-radius: 50%; box-shadow: 0 0 8px #00ff00; animation: blink 1.5s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        #b-msg { font-size: 10px; color: #00ff00; }
        #stream-list { max-height: 250px; overflow-y: auto; margin-top: 10px; background: #000; padding: 5px; border: 1px solid #222; }
        .stream-item { font-size: 10px; padding: 10px; border-bottom: 1px solid #1a1a1a; color: #fff; cursor: pointer; transition: 0.2s; position: relative; }
        .stream-item:hover { background: #1a1a24; border-left: 3px solid #7d42ff; }
        .stream-item:active { background: #7d42ff; }
        .stream-info { color: #7d42ff; font-weight: bold; display: flex; justify-content: space-between; margin-bottom: 3px; }
        .prime { width: 100%; background: #7d42ff; border: none; color: #fff; padding: 10px; cursor: pointer; font-weight: bold; border-radius: 5px; margin-top: 10px; }
        hr { border: 0; border-top: 1px solid #222; margin: 10px 0; }
    `;
    shadow.appendChild(style);
    shadow.appendChild(ui);

    // --- 2. LOGIC: EXTRACTION & DISPLAY ---
    const getFileSize = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const size = response.headers.get('content-length');
            return size ? (size / (1024 * 1024)).toFixed(2) + " MB" : "Buffer/Live";
        } catch (e) { return "Link Detected"; }
    };

    const addStream = async (url) => {
        if (!url || Bishop.streams.includes(url)) return;
        if (url.includes('.ts') || url.startsWith('blob:') || url.length < 15) return;

        Bishop.streams.push(url);
        const list = shadow.getElementById('stream-list');
        if (list.querySelector('.empty-msg')) list.innerHTML = '';

        const size = await getFileSize(url);
        const fileName = url.split('/').pop().split('?')[0] || "Unknown Source";

        const item = document.createElement('div');
        item.className = 'stream-item';
        item.innerHTML = `
            <div class="stream-info">
                <span>🎬 ${fileName.substring(0, 22)}...</span>
                <span style="color:#00ff00;">${size}</span>
            </div>
            <div style="font-size:8px; color:#666; word-break: break-all;">${url.substring(0, 60)}...</div>
            <div class="copy-hint" style="font-size:7px; color:#aaa; margin-top:2px;">[Click to Copy URL]</div>
        `;

       
        item.onclick = () => {
            navigator.clipboard.writeText(url).then(() => {
                const originalColor = item.style.background;
                item.style.background = "#2e7d32"; 
                const msg = item.querySelector('.copy-hint');
                msg.innerText = "✅ COPIED!";
                setTimeout(() => {
                    item.style.background = originalColor;
                    msg.innerText = "[Click to Copy URL]";
                }, 1000);
            });
        };
        list.appendChild(item);
    };

    // --- 3. SNIPER HOOKS ---
    const originalFetch = window.fetch;
    window.fetch = function() {
        let url = (typeof arguments[0] === 'string') ? arguments[0] : arguments[0].url;
        if (url && (url.includes('.m3u8') || url.includes('.mp4') || url.includes('video') || url.includes('master'))) {
            addStream(url);
        }
        return originalFetch.apply(this, arguments);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', () => {
            let url = this.responseURL;
            if (url && (url.includes('.mp4') || url.includes('.m3u8') || url.includes('playlist'))) {
                addStream(url);
            }
        });
        return originalOpen.apply(this, arguments);
    };

    const deepScan = () => {
        document.querySelectorAll('video, source, object, embed').forEach(el => {
            let src = el.src || el.currentSrc || (el.getAttribute('data-src'));
            if (src && src.startsWith('http')) addStream(src);
        });
        document.querySelectorAll('iframe').forEach(f => {
            try { if (f.src && f.src.startsWith('http')) addStream(f.src); } catch(e) {}
        });
    };

    setInterval(deepScan, 2000);

    shadow.getElementById('btn-force').onclick = () => {
        if (Bishop.streams.length > 0) {
            
            Bishop.streams.forEach(link => window.open(link, '_blank'));
        } else {
            alert("Bishop: No streams detected yet!");
        }
    };

    // Dragging Logic
    let isDragging = false, offset = [0,0];
    ui.querySelector('#b-header').onmousedown = (e) => {
        isDragging = true;
        offset = [ui.offsetLeft - e.clientX, ui.offsetTop - e.clientY];
    };
    window.onmousemove = (e) => {
        if (!isDragging) return;
        ui.style.left = (e.clientX + offset[0]) + 'px';
        ui.style.top = (e.clientY + offset[1]) + 'px';
    };
    window.onmouseup = () => isDragging = false;

})();
