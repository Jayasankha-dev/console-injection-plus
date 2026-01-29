(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        div.wrapper-outer > div.boxed > div.inner-wrapper > header.theme-header.center-logo > div.header-content > div.donatesl > nav.nav-banner > div.nav-content { 
            display: none !important; 
        }
    `;
    document.head.appendChild(style);
    console.log("%c[Console Injection+] Cineru CSS Filter Applied!", "color: #00ff88; font-weight: bold;");
})();
