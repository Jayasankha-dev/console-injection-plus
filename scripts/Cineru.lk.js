(function() {
    'use strict';

    
    const log = console.log;
    console.clear = function() {
        log("%c [System] Console clear attempt blocked. ", "color: #00ff88; font-weight: bold;");
    };
    Object.defineProperty(console, 'clear', { value: console.clear, writable: false });

    
    const noop = () => {};
    Object.defineProperty(window, 'disableDevtool', {
        value: { isEnable: false, stop: noop, on: noop, off: noop, config: noop },
        writable: false
    });

    const _Constructor = window.Function.prototype.constructor;
    window.Function.prototype.constructor = function(str) {
        if (typeof str === 'string' && (str.includes('debugger') || str.includes('devtool'))) return noop;
        return _Constructor.apply(this, arguments);
    };

    
    function fixCineruButton() {
        
        const btn = document.getElementById('btn-download');
        
        if (btn) {
            const encryptedLink = btn.getAttribute('data-link');
            
            if (encryptedLink && (btn.href.includes('javascript') || btn.innerHTML.includes('Loading'))) {
               
                btn.href = encryptedLink;
                
                
                btn.style.pointerEvents = "auto";
                btn.style.cursor = "pointer";
                btn.style.opacity = "1";
                
              
                btn.innerHTML = `
                    <span></span><span></span><span></span><span></span>
                     සිංහල උපසිරැසි (DOWNLOAD READY) 😂
                `;
                
                log("%c [Success] Download button unlocked!", "color: lime; font-weight: bold;");
            }
        }
    }

    
    const observer = new MutationObserver(fixCineruButton);
    observer.observe(document.documentElement, { childList: true, subtree: true });

   
    window.addEventListener('contextmenu', (e) => e.stopImmediatePropagation(), true);
    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode))) {
            e.stopImmediatePropagation();
        }
    }, true);

    log("%c [Injection+] Cineru Bypass Active! ", "background: #222; color: #00ff88; padding: 5px;");
})();
