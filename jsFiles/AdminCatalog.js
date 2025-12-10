// ================================
// CHECK OUT BOOK POPUP
// ================================

// Buttons & UI elements
const checkoutBtn = document.getElementById("checkoutBookBtn");
const checkoutOverlay = document.getElementById("checkoutPopupOverlay");
const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
const checkoutCancelBtn = document.getElementById("checkoutCancelBtn");
const checkoutConfirmBtn = document.getElementById("checkoutConfirmBtn");

// Form fields
const checkoutBookSelect = document.getElementById("checkoutBookSelect");
const checkoutPatronSelect = document.getElementById("checkoutPatronSelect");
const checkoutBorrowDate = document.getElementById("checkoutBorrowDate");
const checkoutDueDate = document.getElementById("checkoutDueDate");

// Table body
const borrowedTableBody = document.getElementById("borrowedTableRows");

// Show popup
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        checkoutOverlay.classList.remove("d-none");
    });
}

// Close popup
function closeCheckoutPopup() {
    checkoutOverlay.classList.add("d-none");
    resetCheckoutForm();
}

checkoutCloseBtn?.addEventListener("click", closeCheckoutPopup);
checkoutCancelBtn?.addEventListener("click", closeCheckoutPopup);

// Confirm checkout -> Add row
checkoutConfirmBtn?.addEventListener("click", () => {
    const book = checkoutBookSelect.value.trim();
    const patron = checkoutPatronSelect.value.trim();
    const borrowDate = checkoutBorrowDate.value;
    const dueDate = checkoutDueDate.value;

    if (!book || !patron || !borrowDate || !dueDate) return;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${book}</td>
        <td>${patron}</td>
        <td>${borrowDate}</td>
        <td>${dueDate}</td>
        <td>Borrowed</td>
        <td>$0</td>
        <td><iconify-icon icon="mdi:book-check" width="20"></iconify-icon></td>
    `;

    borrowedTableBody.appendChild(newRow);
    closeCheckoutPopup();
});

// Reset form
function resetCheckoutForm() {
    checkoutBookSelect.selectedIndex = 0;
    checkoutPatronSelect.selectedIndex = 0;
    checkoutBorrowDate.value = "";
    checkoutDueDate.value = "";
}
