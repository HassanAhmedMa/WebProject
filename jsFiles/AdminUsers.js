
// TIME & DATE (AdminCatalog.js also has a similar function; this is safe if both exist)
function updateDateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString();
  const dt = document.getElementById("dateTimeBox");
  if (dt) dt.innerHTML = `<div class="fw-bold">${time}</div><small>${date}</small>`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// DOM refs
const usersTableBody = document.getElementById("usersTableBody");

// ADD
const addUserBtn = document.getElementById("addUserBtn");
const addUserOverlay = document.getElementById("addUserOverlay");
const closeUserPopupBtn = document.getElementById("closeUserPopupBtn");
const cancelUserPopupBtn = document.getElementById("cancelUserPopupBtn");
const addUserConfirmBtn = document.getElementById("addUserConfirmBtn");

const userId = document.getElementById("userId");
const userIdWarning = document.getElementById("userIdWarning");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userEmailWarning = document.getElementById("userEmailWarning");
const userUsername = document.getElementById("userUsername");

// DELETE
const deleteUserPopupOverlay = document.getElementById("deleteUserPopupOverlay");
const deleteUserCloseBtn = document.getElementById("deleteUserCloseBtn");
const deleteUserConfirmBtn = document.getElementById("deleteUserConfirmBtn");
let userRowToDelete = null;

// VIEW
const viewUserOverlay = document.getElementById("viewUserOverlay");
const viewUserCloseBtn = document.getElementById("viewUserCloseBtn");
const viewUserCloseBtn2 = document.getElementById("viewUserCloseBtn2");

// EDIT
const editUserOverlay = document.getElementById("editUserOverlay");
const editUserCloseBtn = document.getElementById("editUserCloseBtn");
const editUserCancelBtn = document.getElementById("editUserCancelBtn");
const editUserConfirmBtn = document.getElementById("editUserConfirmBtn");

const editUserId = document.getElementById("editUserId");
const editUserName = document.getElementById("editUserName");
const editUserEmail = document.getElementById("editUserEmail");
const editUserUsername = document.getElementById("editUserUsername");

// SEARCH
const searchInputUsers = document.getElementById("searchInputUsers");

// Helpers
function isUserIdUnique(id) {
  const rows = usersTableBody.querySelectorAll("tr");
  for (const r of rows) {
    const cell = r.querySelector("td");
    if (!cell) continue;
    if (cell.textContent.trim() === id.trim()) return false;
  }
  return true;
}
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function enhanceOverlayDismiss(overlay, onClose) {
  if (!overlay) return;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("d-none")) {
      overlay.classList.add("d-none");
      if (typeof onClose === "function") onClose();
    }
  });
  overlay.addEventListener("click", (e) => {
    const box = overlay.querySelector(".popup-box");
    if (e.target === overlay && box) {
      overlay.classList.add("d-none");
      if (typeof onClose === "function") onClose();
    }
  });
}

// ADD popup flow
function openAddUserPopup() {
  addUserOverlay.classList.remove("d-none");
  addUserConfirmBtn.disabled = true;
}
function closeAddUserPopup() {
  addUserOverlay.classList.add("d-none");
  resetAddUserForm();
}
function resetAddUserForm() {
  userId.value = "";
  userName.value = "";
  userEmail.value = "";
  userUsername.value = "";
  userIdWarning.textContent = "";
  userEmailWarning.textContent = "";
  addUserConfirmBtn.disabled = true;
}
function validateAddUserForm() {
  let ok = true;

  const idVal = userId.value.trim();
  if (!idVal) {
    userIdWarning.textContent = "User ID is required.";
    ok = false;
  } else if (!isUserIdUnique(idVal)) {
    userIdWarning.textContent = "User ID already exists.";
    ok = false;
  } else {
    userIdWarning.textContent = "";
  }

  const emailVal = userEmail.value.trim();
  if (!emailVal) {
    userEmailWarning.textContent = "Email is required.";
    ok = false;
  } else if (!isEmailValid(emailVal)) {
    userEmailWarning.textContent = "Invalid email format.";
    ok = false;
  } else {
    userEmailWarning.textContent = "";
  }

  if (!userName.value.trim() || !userUsername.value.trim()) ok = false;
  addUserConfirmBtn.disabled = !ok;
}

[userId, userName, userEmail, userUsername].forEach((el) => {
  el && el.addEventListener("input", validateAddUserForm);
});

if (addUserBtn) addUserBtn.addEventListener("click", openAddUserPopup);
if (closeUserPopupBtn) closeUserPopupBtn.addEventListener("click", closeAddUserPopup);
if (cancelUserPopupBtn) cancelUserPopupBtn.addEventListener("click", closeAddUserPopup);

if (addUserConfirmBtn) {
  addUserConfirmBtn.addEventListener("click", () => {
    const id = userId.value.trim();
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const username = userUsername.value.trim();

    if (!id || !isUserIdUnique(id) || !name || !isEmailValid(email) || !username) return;

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", id);
    newRow.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${username}</td>
      <td class="text-nowrap">
        <iconify-icon icon="mdi:pencil" class="me-3 edit-user-icon" aria-hidden="true"></iconify-icon>
        <iconify-icon icon="mdi:trash-can" class="me-3 delete-user-icon" aria-hidden="true"></iconify-icon>
        <iconify-icon icon="mdi:account-eye" class="view-user-icon" aria-hidden="true"></iconify-icon>
      </td>
    `;
    usersTableBody.appendChild(newRow);
    closeAddUserPopup();
  });
}

// DELETE popup
function openDeleteUserPopup(row) {
  userRowToDelete = row;
  deleteUserPopupOverlay.classList.remove("d-none");
}
function closeDeleteUserPopup() {
  deleteUserPopupOverlay.classList.add("d-none");
  userRowToDelete = null;
}
if (deleteUserCloseBtn) deleteUserCloseBtn.addEventListener("click", closeDeleteUserPopup);
if (deleteUserConfirmBtn) {
  deleteUserConfirmBtn.addEventListener("click", () => {
    if (userRowToDelete) userRowToDelete.remove();
    closeDeleteUserPopup();
  });
}

// VIEW popup
function openViewUserPopup(row) {
  const cells = row.querySelectorAll("td");
  if (cells.length < 5) return;

  document.getElementById("viewUserId").textContent = cells[0].textContent.trim();
  document.getElementById("viewUserName").textContent = cells[1].textContent.trim();
  document.getElementById("viewUserEmail").textContent = cells[2].textContent.trim();
  document.getElementById("viewUserUsername").textContent = cells[3].textContent.trim();

  viewUserOverlay.classList.remove("d-none");
}
function closeViewUserPopup() {
  viewUserOverlay.classList.add("d-none");
}
if (viewUserCloseBtn) viewUserCloseBtn.addEventListener("click", closeViewUserPopup);
if (viewUserCloseBtn2) viewUserCloseBtn2.addEventListener("click", closeViewUserPopup);

// EDIT popup
let userRowBeingEdited = null;
function openEditUserPopup(row) {
  userRowBeingEdited = row;
  const cells = row.querySelectorAll("td");
  if (cells.length < 5) return;

  editUserId.value = cells[0].textContent.trim();
  editUserName.value = cells[1].textContent.trim();
  editUserEmail.value = cells[2].textContent.trim();
  editUserUsername.value = cells[3].textContent.trim();

  editUserOverlay.classList.remove("d-none");
}
function closeEditUserPopup() {
  editUserOverlay.classList.add("d-none");
  userRowBeingEdited = null;
}
if (editUserCloseBtn)  editUserCloseBtn.addEventListener("click", closeEditUserPopup);
if (editUserCancelBtn) editUserCancelBtn.addEventListener("click", closeEditUserPopup);

if (editUserConfirmBtn) {
  editUserConfirmBtn.addEventListener("click", () => {
    if (!userRowBeingEdited) return;

    const name = editUserName.value.trim();
    const email = editUserEmail.value.trim();
    const username = editUserUsername.value.trim();

    if (!name || !isEmailValid(email) || !username) {
      alert("Please fill valid Name, Email, and Username.");
      return;
    }

    const cells = userRowBeingEdited.querySelectorAll("td");
    cells[1].textContent = name;
    cells[2].textContent = email;
    cells[3].textContent = username;

    closeEditUserPopup();
  });
}

// EVENT DELEGATION (edit/view/delete)
if (usersTableBody) {
  usersTableBody.addEventListener("click", (e) => {
    const icon = e.target.closest("iconify-icon");
    if (!icon) return;

    const row = icon.closest("tr");
    if (!row) return;

    if (icon.classList.contains("delete-user-icon")) { openDeleteUserPopup(row); return; }
    if (icon.classList.contains("view-user-icon"))   { openViewUserPopup(row);   return; }
    if (icon.classList.contains("edit-user-icon"))   { openEditUserPopup(row);   return; }
  });
}

// LIVE SEARCH
if (searchInputUsers && usersTableBody) {
  searchInputUsers.addEventListener("input", () => {
    const q = searchInputUsers.value.trim().toLowerCase();
    Array.from(usersTableBody.querySelectorAll("tr")).forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? "" : "none";
    });
  });
}

// Overlay UX
enhanceOverlayDismiss(addUserOverlay, resetAddUserForm);
enhanceOverlayDismiss(deleteUserPopupOverlay, () => (userRowToDelete = null));
enhanceOverlayDismiss(viewUserOverlay);
enhanceOverlayDismiss(editUserOverlay, () => (userRowBeingEdited = null));
