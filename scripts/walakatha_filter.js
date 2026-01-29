(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide pre-containers and popups */
        #se-pre-con, 
        div[class*="popup"], 
        div[id*="popup"], 
        div[class*="modal"],
        iframe[src*="jnbhi"],
        iframe[src*="m1rs"],
        iframe[src*="leeg"],
        [data-cfasync="false"],
        iframe[src*="rocket-loader"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
        }

        /* Remove blur effects */
        .blurred, 
        [class*="blurred"], 
        .media-item, 
        .entry-content img {
            filter: none !important;
            -webkit-filter: none !important;
            opacity: 1 !important;
        }

        /* Block fixed ad layers */
        div[style*="position: fixed"][style*="z-index: 2147483647"],
        div[style*="z-index: 999999"],
        .global-ad-layer {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    console.log("%c[Console Injection+] Walakatha Filters Applied!", "color: #00ff88; font-weight: bold;");
})();
