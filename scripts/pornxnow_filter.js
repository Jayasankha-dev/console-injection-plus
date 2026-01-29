(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide backgrounds, ad buttons, and overlays */
        .wp-block-cover__background,
        .wp-block-cover:has(a[href*="ad"]),
        div[class*="wp-block-button"]:has(a[href*="redirect"]),
        .wp-block-post-comments,
        [style*="z-index: 2000"],
        [style*="z-index: 1999"],
        [class*="overlay"],
        [id*="overlay"],
        .video_ad,
        .video_ad_fadein,
        div[style*="opacity: 0"],
        div[style*="background: none"]:not(:has(video)) {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* Remove player limits and hidden inputs */
        .play_limit_box,
        .over_player_msg,
        [class*="uploadv"],
        input[opacity="0"],
        .xfname {
            display: none !important;
            opacity: 0 !important;
        }

        /* Force hide VAST players and floating ads */
        div[class*='E5IaTEuzNAtsJSrBDlFn'],
        div.qg54XWSzHQRhG1ssz3ej,
        div.vast_player,
        a.vast_player_click_link,
        div.vast_player_content,
        [data-izone],
        .E5IaTEu,
        [id*="ad-"],
        .popunder,
        .floating-ad,
        div[style*="z-index: 2147483647"],
        div[data-izone="main"], 
        div[class*="skin__adBadge"], 
        div[class*="skin__wrap"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            top: -9999px !important;
        }

        /* Ensure main player remains interactive */
        iframe, video {
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
    console.log("%c[Console Injection+] PornXnow Filters Applied!", "color: #00ff88; font-weight: bold;");
})();
