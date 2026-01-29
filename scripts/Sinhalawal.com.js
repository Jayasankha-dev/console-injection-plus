(function() {
    'use strict';

    // 1. CSS Injection - Hides ONLY the Ad Layer, keeps Age Verify visible
    const style = document.createElement('style');
    style.innerHTML = `
        .global-ad-layer, .modal, .overlay {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
        .sw-video-card, .media-item {
            filter: none !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Disable Ad Functions
    window.openGlobalAd = () => false;
    window.showGlobalAdLayer = () => false;
    window.onGlobalLayerClick = () => false;

    // Kill background ad timers
    let id = window.setInterval(() => {}, 0);
    while (id--) window.clearInterval(id);

    // 3. Optimization Logic
    const runOptimization = () => {
        // Remove only the Ad layer (Leaves #sw-age-verify alone)
        document.querySelectorAll('.global-ad-layer').forEach(el => el.remove());

        // Process Video Cards
        document.querySelectorAll('.sw-video-card').forEach(card => {
            const onClickAttr = card.getAttribute('onclick');
            if (onClickAttr) {
                const match = onClickAttr.match(/href='([^']+)'/);
                if (match && match[1]) {
                    console.log("Video Link: " + match[1]);
                }
            }
            card.classList.add('unblurred');
            card.style.filter = "none";
        });

        // Your specific snippets
        try {
            document.querySelectorAll('.watch-btn').forEach(btn => btn.click());
            
            if (typeof mediaItems !== 'undefined') {
                mediaItems.forEach(item => { 
                    if(item.type === 'video') console.log("Media Link: " + item.src); 
                });
            }
            
            document.querySelectorAll('.watch-btn').forEach(btn => btn.remove());
            document.querySelectorAll('.media-item').forEach(item => item.classList.add('unblurred'));
        } catch (e) {}
    };

    // 4. Observer to keep cleaning while browsing
    const observer = new MutationObserver(() => {
        runOptimization();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    runOptimization();
})();
