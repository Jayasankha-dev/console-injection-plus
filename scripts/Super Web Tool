(function() {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.id = 'ultimate-tool-canvas';
    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0',
        zIndex: '2147483646', pointerEvents: 'none', display: 'block'
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let tool = 'none';
    let drawing = false;
    let color = '#ff0000';
    let particles = [];
    let history = [];
    let scrollInterval = null;
    let mouseY = 0, mouseX = 0;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class BinaryParticle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.text = Math.random() > 0.5 ? "1" : "0";
            this.alpha = 1.0; this.life = 0.03;
            this.fontSize = Math.floor(Math.random() * 8) + 14;
        }
        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = "#00FF41";
            ctx.font = `bold ${this.fontSize}px monospace`;
            ctx.fillText(this.text, this.x, this.y);
            this.alpha -= this.life;
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (tool === 'hacker') {
            particles.forEach((p, i) => {
                p.draw();
                if (p.alpha <= 0) particles.splice(i, 1);
            });
        } else if (tool === 'focus') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, mouseY - 40, canvas.width, 80);
        } else if (tool === 'xray') {
            const el = document.elementFromPoint(mouseX, mouseY);
            if (el && !el.closest('#super-tools-bar') && el.id !== 'ultimate-tool-canvas') {
                const rect = el.getBoundingClientRect();
                // 🩻 X-Ray Box
                ctx.strokeStyle = '#00FF41';
                ctx.lineWidth = 2;
                ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
                ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
                ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
                // Label
                ctx.fillStyle = '#00FF41';
                ctx.font = '12px Arial';
                ctx.fillText(`${el.tagName.toLowerCase()} ${el.className ? '.'+el.className.split(' ')[0] : ''}`, rect.left, rect.top - 5);
                ctx.fillText(`${rect.width.toFixed(0)}px x ${rect.height.toFixed(0)}px`, rect.left, rect.bottom + 15);
            }
        }
        
        if (tool !== 'none') requestAnimationFrame(animate);
    };

    const injectToolbar = () => {
        if(document.getElementById('super-tools-bar')) return;
        const bar = document.createElement('div');
        bar.id = 'super-tools-bar';
        bar.innerHTML = `
            <div style="font-weight:bold; font-size:11px; text-align:center; color:#00FF41; margin-bottom:8px; border-bottom:1px solid #444;">SUPER TOOL</div>
            <button class="t-btn" id="btn-pen">🖋️ Pen</button>
            <button class="t-btn" id="btn-high">🖍️ HighLT</button>
            <button class="t-btn" id="btn-hacker">👾 Hacker</button>
            <button class="t-btn" id="btn-focus">🔦 Focus</button>
            <button class="t-btn" id="btn-xray">🩻 X-Ray</button>
            <button class="t-btn" id="btn-ghost">👻 Ghost</button>
            <button class="t-btn" id="btn-scroll">📜 Scroll</button>
            <button class="t-btn" id="btn-blur">🌫️ Blur</button>
            <button class="t-btn" id="btn-design">📝 Edit</button>
            <button class="t-btn" id="btn-night">🌙 Night</button>
            <hr style="border:0.1px solid #444; width:100%; margin:4px 0;">
            <input type="color" id="t-color" value="#ff0000">
            <button class="t-btn" id="btn-undo">↩️ Undo</button>
            <button class="t-btn" id="btn-clear">🧹 Clear</button>
            <button class="t-btn" id="btn-cursor" style="background:#444">🖱️ Cursor</button>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            #super-tools-bar {
                position: fixed; top: 50%; right: 15px; transform: translateY(-50%);
                background: rgba(10,10,10,0.95); color: white; padding: 12px; border-radius: 15px;
                z-index: 2147483647; display: flex; flex-direction: column; gap: 6px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.9); border: 1px solid #00FF41; width: 95px;
                font-family: 'Segoe UI', sans-serif;
            }
            .t-btn { background: #1e1e1e; color: #bbb; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px; transition: 0.2s; }
            .t-btn:hover { background: #00FF41; color: #000; transform: scale(1.05); }
            .t-active { background: #0078d4 !important; color: white !important; }
            #t-color { width: 100%; height: 25px; border: none; background: none; cursor: pointer; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(bar);
    };

    const updateActive = (id) => {
        document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('t-active'));
        if(id) document.getElementById(id).classList.add('t-active');
    };

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (tool === 'hacker' && Math.random() > 0.1) particles.push(new BinaryParticle(e.clientX, e.clientY));
    });

    canvas.addEventListener('mousedown', (e) => {
        if (['pen', 'high'].includes(tool)) {
            drawing = true;
            history.push(canvas.toDataURL());
            ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY);
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.lineCap = 'round';
        if (tool === 'pen') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.globalAlpha = 1;
        } else if (tool === 'high') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.strokeStyle = color + '66'; ctx.lineWidth = 20; ctx.globalAlpha = 1;
        }
        ctx.lineTo(e.clientX, e.clientY); ctx.stroke();
    });

    window.addEventListener('mouseup', () => drawing = false);

    injectToolbar();

    document.getElementById('btn-pen').onclick = () => { tool = 'pen'; canvas.style.pointerEvents = 'auto'; updateActive('btn-pen'); };
    document.getElementById('btn-high').onclick = () => { tool = 'high'; canvas.style.pointerEvents = 'auto'; updateActive('btn-high'); };
    document.getElementById('btn-hacker').onclick = () => { tool = 'hacker'; canvas.style.pointerEvents = 'none'; animate(); updateActive('btn-hacker'); };
    document.getElementById('btn-focus').onclick = () => { tool = 'focus'; canvas.style.pointerEvents = 'none'; animate(); updateActive('btn-focus'); };
    document.getElementById('btn-xray').onclick = () => { tool = 'xray'; canvas.style.pointerEvents = 'none'; animate(); updateActive('btn-xray'); };
    
    document.getElementById('btn-ghost').onclick = () => {
        const media = document.querySelectorAll('img, video, iframe, canvas:not(#ultimate-tool-canvas)');
        const isHidden = media[0]?.style.display === 'none';
        media.forEach(m => m.style.display = isHidden ? '' : 'none');
        updateActive(!isHidden ? 'btn-ghost' : null);
    };

    document.getElementById('btn-scroll').onclick = () => {
        if (scrollInterval) { clearInterval(scrollInterval); scrollInterval = null; updateActive(null); }
        else { scrollInterval = setInterval(() => window.scrollBy(0, 1), 25); updateActive('btn-scroll'); }
    };

    document.getElementById('btn-night').onclick = () => {
        document.documentElement.style.filter = document.documentElement.style.filter.includes('invert') ? '' : 'invert(1) hue-rotate(180deg)';
    };

    document.getElementById('btn-design').onclick = () => {
        document.designMode = document.designMode === 'on' ? 'off' : 'on';
        updateActive(document.designMode === 'on' ? 'btn-design' : null);
    };

    document.getElementById('btn-blur').onclick = () => {
        tool = 'blur'; canvas.style.pointerEvents = 'none'; updateActive('btn-blur');
        document.onclick = (e) => {
            if(tool === 'blur') { e.preventDefault(); e.target.style.filter = e.target.style.filter.includes('blur') ? '' : 'blur(10px)'; }
        };
    };

    document.getElementById('btn-cursor').onclick = () => {
        tool = 'none'; canvas.style.pointerEvents = 'none';
        if(scrollInterval) clearInterval(scrollInterval);
        ctx.clearRect(0,0,canvas.width,canvas.height); updateActive('btn-cursor');
    };

    document.getElementById('btn-clear').onclick = () => ctx.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById('t-color').oninput = (e) => color = e.target.value;
    document.getElementById('btn-undo').onclick = () => {
        if (history.length) {
            let img = new Image(); img.src = history.pop();
            img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0); };
        }
    };
})();
