(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide global ad layers and force layout fix */
        .global-ad-layer {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            z-index: -9999 !important;
        }

        /* Re-enable scrolling if the site disabled it */
        body {
            overflow: auto !important;
        }
    `;
    document.head.appendChild(style);
    console.log("%c[Console Injection+] Sinhalawal Filters Applied!", "color: #00ff88; font-weight: bold;");
})();
