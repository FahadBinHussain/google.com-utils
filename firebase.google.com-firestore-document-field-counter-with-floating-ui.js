// ==UserScript==
// @name         Firestore Field Counter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Count .database-key-value elements in Firestore console
// @author       You
// @match        https://console.firebase.google.com/*project*
// @icon         https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const TARGET_CLASS = 'database-key-value';
    const UPDATE_INTERVAL_MS = 1000; // Check every 1 second

    // Create the display element
    const counterBox = document.createElement('div');
    counterBox.id = 'firestore-field-counter-ui';
    counterBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #1a73e8;
        color: white;
        padding: 10px 15px;
        border-radius: 24px;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 9999;
        cursor: pointer;
        display: none; /* Hidden by default until we find elements */
        user-select: none;
        transition: transform 0.2s;
    `;
    counterBox.title = "Click to force recount";
    document.body.appendChild(counterBox);

    // Hover effect
    counterBox.onmouseenter = () => counterBox.style.transform = "scale(1.05)";
    counterBox.onmouseleave = () => counterBox.style.transform = "scale(1)";

    // Manual refresh on click
    counterBox.onclick = () => {
        updateCount();
        // Visual feedback
        const originalBg = counterBox.style.backgroundColor;
        counterBox.style.backgroundColor = '#1557b0';
        setTimeout(() => counterBox.style.backgroundColor = originalBg, 150);
    };

    function updateCount() {
        // 1. Check if we are on the correct URL path pattern
        // The user specified /u/x/project/, but we check for 'firestore' or 'database' in url or just presence of elements
        // to ensure we don't show this on the Authentication or Analytics tabs.
        const elements = document.getElementsByClassName(TARGET_CLASS);
        const count = elements.length;

        if (count > 0) {
            counterBox.style.display = 'block';
            counterBox.innerText = `Fields Visible: ${count}`;
        } else {
            // Optional: Hide if 0, or show "0"
            // If you want it to hide when leaving the database tab:
            counterBox.style.display = 'none';
        }
    }

    // Run the updater on an interval to handle SPA navigation and scrolling
    setInterval(updateCount, UPDATE_INTERVAL_MS);

})();
