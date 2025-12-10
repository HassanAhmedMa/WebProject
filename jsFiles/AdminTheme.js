/* ============================================================
   GLOBAL THEME CONTROLLER (Works on ALL Admin Pages)
============================================================ */

/* ================================
   1. Load saved theme on startup
================================ */
const savedTheme = localStorage.getItem("adminTheme");

// Remove any existing theme classes first
document.body.classList.remove("theme-light", "theme-dark");

// Apply saved theme or default to light
if (savedTheme === "dark") {
    document.body.classList.add("theme-dark");
} else {
    document.body.classList.add("theme-light");
}


/* ================================
   2. Theme toggle button
================================ */
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        const isDark = document.body.classList.contains("theme-dark");

        if (isDark) {
            document.body.classList.replace("theme-dark", "theme-light");
            localStorage.setItem("adminTheme", "light");
        } else {
            document.body.classList.replace("theme-light", "theme-dark");
            localStorage.setItem("adminTheme", "dark");
        }

        updateThemeIcons(); 
    });
}


/* ================================
   3. Sync sun/moon icons + switch
================================ */
function updateThemeIcons() {
    const isDark = document.body.classList.contains("theme-dark");

    const sun = document.getElementById("sunIcon");
    const moon = document.getElementById("moonIcon");
    const thumb = document.querySelector(".switch-thumb");

    if (sun && moon) {
        sun.style.display = isDark ? "none" : "block";
        moon.style.display = isDark ? "block" : "none";
    }

    if (thumb) {
        thumb.style.transform = isDark ? "translateX(32px)" : "translateX(0px)";
    }
}

// Run immediately on page load
updateThemeIcons();
