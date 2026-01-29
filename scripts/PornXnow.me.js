(function() {
    'use strict';
    console.log("%c 🛡️ Surgical Shield: Targeting Redirects, Saving Video...", "color: #00ff88; font-weight: bold;");

    // 1. NEUTRALIZE WINDOW OPENING
    // This stops the browser from allowing scripts to pop a new tab.
    const deadWindow = { focus: () => {}, close: () => {}, postMessage: () => {} };
    window.open = function() { 
        console.warn("🚫 Blocked a popup attempt."); 
        return deadWindow; 
    };

    // 2. STOP EVENT PROPAGATION ON CLICKS
    // We catch the click before the site's ad-script can see it.
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // If the user clicked a link leading to the redirect domain, kill it.
        const link = target.closest('a');
        if (link && (link.href.includes('pxnw.xyz') && !link.href.includes('.mp4'))) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log("🛑 Blocked redirect link click.");
        }
    }, true); // 'true' is critical - it catches the event first.

    // 3. REMOVE TRANSPARENT CLICK-JACKING OVERLAYS
    // These are often placed directly over the <video> tag.
    const removeOverlays = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const videoRect = video.getBoundingClientRect();

        document.querySelectorAll('div').forEach(div => {
            const style = window.getComputedStyle(div);
            const rect = div.getBoundingClientRect();

            // If a DIV is roughly the same size as the video and has a high z-index, it's an overlay.
            if (parseInt(style.zIndex) > 10 && 
                Math.abs(rect.width - videoRect.width) < 50 && 
                style.position !== 'relative') {
                
                // If it contains no actual UI elements, it's likely an ad trigger.
                if (div.innerText.trim() === "" && !div.querySelector('video')) {
                    console.log("🗑️ Removing invisible ad-overlay.");
                    div.remove();
                }
            }
        });
    };

    // 4. RE-ENABLE CONTROLS
    // Sometimes ad scripts disable the 'controls' attribute.
    const fixPlayer = () => {
        const video = document.querySelector('video');
        if (video) {
            video.setAttribute('controls', 'true');
            video.style.pointerEvents = 'auto'; // Ensures you can click play/pause
        }
    };

    // Run every second to catch dynamic ads
    setInterval(() => {
        removeOverlays();
        fixPlayer();
    }, 1000);

})();
