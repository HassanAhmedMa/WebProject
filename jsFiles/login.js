const loginIdentifier = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
loginIdentifier.addEventListener("input", validateIdentifier);
loginPassword.addEventListener("input", validatePasswordInput);

function validateIdentifier() {
    const value = loginIdentifier.value.trim();

    if (!value) {
        showError("identifierError", "Username is required");
    } else {
        clearError("identifierError");
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function validatePasswordInput() {
    const value = loginPassword.value.trim();

    if (!value) {
        showError("loginPasswordError", "Password is required");
    } else {
        clearError("loginPasswordError");
    }
}

function showError(id, message) {
    const el = document.getElementById(id);
    el.innerText = message;
    el.style.display = "block";
}

function clearError(id) {
    document.getElementById(id).innerText = "";
}




if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        validateIdentifier();
        validatePasswordInput();

        if (
            document.getElementById("identifierError").innerText ||
            document.getElementById("loginPasswordError").innerText
        ) {
            return;
        }

        const identifier = loginIdentifier.value.trim();
        const password = loginPassword.value.trim();

        const users = getUsers();

        const user = users.find(
            u => u.email === identifier || u.username === identifier
        );

        if (!user) {
            showError("identifierError", "No account found with this username");
            return;
        }

        if (user.password !== password) {
            showError("loginPasswordError", "Incorrect password");
            return;
        }


        alert("Login successful!");
        location.href = "AdminUsers.html";
    });
}