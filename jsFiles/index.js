const toggle = document.getElementById("themeToggle");
const body = document.body;
const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("signupName");
const emailInput = document.getElementById("signupEmail");
const usernameInput = document.getElementById("signupUsername");
const passwordInput = document.getElementById("signupPassword");
const loginForm = document.getElementById("loginForm");


// Live validation on typing
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
usernameInput.addEventListener("input", validateUsername);
passwordInput.addEventListener("input", validatePassword);

toggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
});







// ----- Save & Retrieve users from localStorage -----
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Email Regex Validation (basic safe format)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // ensures email contains @ and domain
    return emailRegex.test(email);
}

// Password must have 8+ chars, numbers, letters & symbol
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
}

function showError(id, message) {
    const el = document.getElementById(id);
    el.innerText = message;
    el.style.display = "block";
}

function clearError(id) {
    document.getElementById(id).innerText = "";
}

// function clearErrors() {
//     document.querySelectorAll(".error-msg").forEach(e => {
//         e.style.display = "none";
//         e.innerText = "";
//     });
// }

function validateName() {
    if (!nameInput.value.trim()) {
        showError("nameError", "Name is required");
    } else {
        clearError("nameError");
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    if (!email) {
        showError("emailError", "Email is required");
    } else if (!isValidEmail(email)) {
        showError("emailError", "Invalid email format");
    } else {
        clearError("emailError");
    }
}

function validateUsername() {
    if (!usernameInput.value.trim()) {
        showError("usernameError", "Username is required");
    } else {
        clearError("usernameError");
    }
}

function validatePassword() {
    const pass = passwordInput.value.trim();
    if (!pass) {
        showError("passwordError", "Password required");
    } else if (!isValidPassword(pass)) {
        showError("passwordError", "Min 8 chars, include letters, numbers & symbol");
    } else {
        clearError("passwordError");
    }
}


// ====================== SIGN UP ======================

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        validateName();
        validateEmail();
        validateUsername();
        validatePassword();

        // If errors still exist, stop submit
        if (
            document.getElementById("nameError").innerText ||
            document.getElementById("emailError").innerText ||
            document.getElementById("usernameError").innerText ||
            document.getElementById("passwordError").innerText
        ) {
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const users = getUsers();

        if (users.some(u => u.email === email)) {
            alert("Email already registered!");
            return;
        }
        if (users.some(u => u.username === username)) {
            alert("Username already taken!");
            return;
        }

        users.push({ name, email, username, password });
        saveUsers(users);

        alert("Account created successfully!");
        location.href = "index.html";
    });
}


