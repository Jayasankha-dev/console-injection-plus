(function() {
    'use strict';

    /**
     * 1. TARGETED CSS
     * We only target the specific elements that cause trouble.
     */
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Fix the 'cursor: pointer' trap on body */
            html, body { 
                cursor: default !important; 
                overflow: auto !important; 
            }

            /* Hide the loader without deleting it (Prevents JS errors) */
            #se-pre-con { 
                opacity: 0 !important; 
                visibility: hidden !important; 
                pointer-events: none !important; 
            }

            /* ONLY force the main content area to show */
            /* We avoid forcing ALL .d-none so the Nav-Bar doesn't break */
            #maincontent.d-none { 
                display: block !important; 
                visibility: visible !important; 
                opacity: 1 !important; 
            }

            /* Maintain proper pointer only for links and buttons */
            a, button, .nav-link, [role="button"], .btn { 
                cursor: pointer !important; 
            }

            /* Hide high z-index ad layers */
            div[style*="z-index: 2147483647"], .global-ad-layer { 
                display: none !important; 
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * 2. MAINTENANCE LOGIC
     * Tricking the site to unlock the content.
     */
    const runMaintenance = () => {
        // Unlock main content if it's stuck in 'd-none'
        const content = document.getElementById('maincontent');
        if (content && content.classList.contains('d-none')) {
            content.classList.remove('d-none');
        }

        // Snap body cursor back to default
        if (document.body && document.body.style.cursor !== 'default') {
            document.body.style.setProperty('cursor', 'default', 'important');
        }
    };

    /**
     * 3. CLICKJACKING PROTECTION
     * Blocks redirects to ad domains.
     */
    const interceptClicks = (e) => {
        const target = e.target.closest('a');
        if (target) {
            const href = target.href.toLowerCase();
            const isAd = /m1rs|leegloa|jnbhi|ads|pop|syndication/.test(href);
            
            if (isAd) {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log("🛡️ Ad Blocked: ", href);
                return false;
            }
        }
    };

    // --- INITIALIZE ---
    if (document.head) injectStyles();
    else {
        const obs = new MutationObserver(() => { if(document.head) { injectStyles(); obs.disconnect(); } });
        obs.observe(document.documentElement, { childList: true });
    }

/**
     * 4. REDIRECT & POPUP LOCKDOWN
     * Blocks dynamic redirects and window opening to the specified domain.
     */
    const blockRedirects = () => {
        const forbidden = /leegloa|xupob|ntvp|metricsw/; // Add keywords here

        // Override window.open to stop pop-unders
        const originalWindowOpen = window.open;
        window.open = function(url, name, specs) {
            if (typeof url === 'string' && forbidden.test(url.toLowerCase())) {
                console.log("🛑 Blocked Window Popup: ", url);
                return null;
            }
            return originalWindowOpen.apply(this, arguments);
        };

        // Stop Location Hijacking 
        const originalLocationSet = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href')?.set;
        if (originalLocationSet) {
            Object.defineProperty(window.location, 'href', {
                set: function(url) {
                    if (forbidden.test(url.toLowerCase())) {
                        console.log("🛑 Blocked Location Redirect: ", url);
                        return;
                    }
                    originalLocationSet.call(window.location, url);
                }
            });
        }
    };

    blockRedirects(); // Execute lockdown

    // Monitor for changes (Prevents freezing)
    const observer = new MutationObserver(runMaintenance);
    observer.observe(document.documentElement, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        attributeFilter: ['class', 'style']
    });

    window.addEventListener('click', interceptClicks, true);
    
    // Safety triggers
    window.addEventListener('load', () => {
        runMaintenance();
        window.dispatchEvent(new Event('resize')); 
    });
    setInterval(runMaintenance, 1000);

    console.log("%c 🚀 V8 SURGICAL SHIELD ACTIVE ", "color: white; background: green; font-weight: bold; padding: 5px;");
})();
