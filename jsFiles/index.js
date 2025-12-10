const toggle = document.getElementById("themeToggle");
const body = document.body;

toggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
});