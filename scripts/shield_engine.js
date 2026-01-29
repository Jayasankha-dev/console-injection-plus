(function() {

    'use strict';



    // 1. JSON-BASED CONFIGURATION

    // Instead of hardcoding URLs, we use wildcards and keywords to catch ads dynamically.

    const shieldRules = {

        "domain_patterns": ["*ads*", "*popunder*", "*shorthub*", "*click*", "*delivery*", "*analytics*"],

        "css_selectors": [

            "div[class*='AdShield']", "div[id*='AdShield']", 

            "div[class*='Sponsored']", "div[class^='E5IaTE']",

            "iframe[src*='ads']", "div[style*='z-index: 2147483647']",

            ".popunder", ".floating-ad", "[data-izone]"

        ],

        "network_keywords": ["/ads/", "/pop/", "/vast/", "delivery", "track", "pixel"]

    };



    // 2. PATTERN MATCHER LOGIC

    // Converts wildcard strings (e.g., *ads*) into Regular Expressions for deep scanning.

    const matchesPattern = (str, pattern) => {

        const regex = new RegExp("^" + pattern.split("*").join(".*") + "$", "i");

        return regex.test(str);

    };



    // 3. NETWORK INTERCEPTOR (Pre-emptive Strike)

    // Blocks requests at the browser level before the ad even loads.

    const originalFetch = window.fetch;

    window.fetch = function(url, ...args) {

        if (typeof url === 'string') {

            const isBlocked = shieldRules.network_keywords.some(kw => url.includes(kw)) ||

                              shieldRules.domain_patterns.some(pat => matchesPattern(url, pat));

            

            if (isBlocked) {

                console.warn("🛡️ SentinelJS: Blocked network request:", url);

                return Promise.reject(new Error("Blocked by SentinelJS Pattern"));

            }

        }

        return originalFetch(url, ...args);

    };



    // 4. SMART DOM SANITIZER

    // Cleans the page structure and removes visual ad layers.

    const cleanDOM = () => {

        shieldRules.css_selectors.forEach(selector => {

            document.querySelectorAll(selector).forEach(el => {

                // Safety: Avoid removing actual video players

                if (!el.querySelector('video')) {

                    el.remove();

                }

            });

        });



        // Anti-Scroll-Lock: Re-enables scrolling if a popup disabled it.

        if (document.body && document.body.style.overflow === 'hidden') {

            document.body.style.overflow = 'auto';

        }

    };



    // 5. BEHAVIORAL PROTECTION (Popups & Redirects)

    const protectWindow = () => {

        // Suppress forced window.open attempts

        window.open = function() {

            console.warn("🛡️ SentinelJS: Blocked a suspicious popup attempt.");

            return { close: () => {}, focus: () => {}, closed: true };

        };

        // Suppress unwanted redirects

        window.onbeforeunload = () => "🛡️ SentinelJS protected this page.";

    };



    // --- INITIALIZATION ---

    protectWindow();

    cleanDOM();



    // Monitor for late-loading ads

    const observer = new MutationObserver(cleanDOM);

    observer.observe(document.documentElement, { 

        childList: true, 

        subtree: true 

    });



    // Final fallback sweep every 3 seconds

    setInterval(cleanDOM, 3000);



    console.log("%c🛡️ SENTINEL-JSON ACTIVE", "color: lime; background: black; font-weight: bold; padding: 10px; border-radius: 5px;");

})();
