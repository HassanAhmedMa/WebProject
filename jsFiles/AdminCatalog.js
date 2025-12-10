/* ================================
   TIME & DATE
================================ */
function updateDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString();

    const dt = document.getElementById("dateTimeBox");
    if (dt) {
        dt.innerHTML = `
            <div class="fw-bold">${time}</div>
            <small>${date}</small>
        `;
    }
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* ================================
   THEME TOGGLE
================================ */
const toggle = document.getElementById("themeToggle");
if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("theme-dark");
        document.body.classList.toggle("theme-light");
    });
}

/* ================================
   ADD BOOK POPUP SYSTEM
================================ */
const addBookBtn = document.getElementById("addBookBtn");
const addBookOverlay = document.getElementById("addBookOverlay");
const closePopupBtn = document.getElementById("closePopupBtn");
const cancelPopupBtn = document.getElementById("cancelPopupBtn");
const addBookConfirmBtn = document.getElementById("addBookConfirmBtn");

const bookISBN = document.getElementById("bookISBN");
const isbnWarning = document.getElementById("isbnWarning");

const bookTitle = document.getElementById("bookTitle");
const bookAuthors = document.getElementById("bookAuthors");
const bookPublisher = document.getElementById("bookPublisher");
const bookYear = document.getElementById("bookYear");
const bookTotalCopies = document.getElementById("bookTotalCopies");
const bookAvailableCopies = document.getElementById("bookAvailableCopies");

const booksTableBody = document.getElementById("booksTableBody");

if (addBookBtn && addBookOverlay && closePopupBtn && cancelPopupBtn && addBookConfirmBtn) {

    /* SHOW POPUP */
    addBookBtn.addEventListener("click", () => {
        addBookOverlay.classList.remove("d-none");
    });

    /* CLOSE POPUP */
    function closeAddPopup() {
        addBookOverlay.classList.add("d-none");
        resetAddBookForm();
    }

    closePopupBtn.addEventListener("click", closeAddPopup);
    cancelPopupBtn.addEventListener("click", closeAddPopup);

    /* ISBN VALIDATION */
    function normalizeISBN(val) {
        return val.replace(/[^0-9]/g, "");
    }

    function isISBNUnique(val) {
        const rows = booksTableBody.querySelectorAll("tr");
        for (const r of rows) {
            const isbnCell = r.querySelector("td");
            if (!isbnCell) continue;
            const existing = normalizeISBN(isbnCell.textContent);
            if (existing === val) return false;
        }
        return true;
    }

    bookISBN.addEventListener("input", () => {
        let value = normalizeISBN(bookISBN.value);
        bookISBN.value = value;

        if (value.length === 0) {
            isbnWarning.textContent = "";
            bookISBN.style.borderColor = "";
            addBookConfirmBtn.disabled = true;
            return;
        }

        if (value.length !== 13) {
            isbnWarning.textContent = "ISBN must be exactly 13 digits.";
            isbnWarning.style.color = "red";
            bookISBN.style.borderColor = "red";
            addBookConfirmBtn.disabled = true;
            return;
        }

        if (!isISBNUnique(value)) {
            isbnWarning.textContent = "ISBN already exists.";
            isbnWarning.style.color = "red";
            bookISBN.style.borderColor = "red";
            addBookConfirmBtn.disabled = true;
            return;
        }

        isbnWarning.textContent = "Valid ISBN ✓";
        isbnWarning.style.color = "green";
        bookISBN.style.borderColor = "green";
        addBookConfirmBtn.disabled = false;
    });

    /* ================================
       ADD BOOK -> TABLE
    ================================= */
    addBookConfirmBtn.addEventListener("click", () => {
        const isbn = normalizeISBN(bookISBN.value);
        const title = bookTitle.value.trim();
        const authors = bookAuthors.value.trim();
        const publisher = bookPublisher.value.trim();
        const year = bookYear.value.trim();
        const total = bookTotalCopies.value.trim();
        const available = bookAvailableCopies.value.trim();

        if (!isbn || isbn.length !== 13) return;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${isbn.slice(0,3)}-${isbn.slice(3)}</td>
            <td>${title}</td>
            <td>${authors}</td>
            <td>${publisher}</td>
            <td>${year}</td>
            <td>${total}</td>
            <td>${available}</td>
            <td>
                <iconify-icon icon="mdi:pencil" class="me-2 edit-book-icon"></iconify-icon>
                <iconify-icon icon="mdi:trash-can" class="me-2 delete-icon"></iconify-icon>
                <iconify-icon icon="mdi:book-check" class="view-book-icon"></iconify-icon>
            </td>
        `;

        booksTableBody.appendChild(newRow);
        attachEditListeners();
        attachDeleteListeners();
        attachViewListeners();  // IMPORTANT
        closeAddPopup();
    });

    function resetAddBookForm() {
        bookISBN.value = "";
        isbnWarning.textContent = "";
        bookISBN.style.borderColor = "";

        bookTitle.value = "";
        bookAuthors.value = "";
        bookPublisher.value = "";
        bookYear.value = "";
        bookTotalCopies.value = "";
        bookAvailableCopies.value = "";

        addBookConfirmBtn.disabled = true;
    }
}

/* ================================
   DELETE POPUP LOGIC
================================ */
let rowToDelete = null;

const deletePopupOverlay = document.getElementById("deletePopupOverlay");
const deleteCloseBtn = document.getElementById("deleteCloseBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");

function deleteHandler() {
    rowToDelete = this.closest("tr");
    deletePopupOverlay.classList.remove("d-none");
}

function attachDeleteListeners() {
    document.querySelectorAll(".delete-icon").forEach(icon => {
        icon.removeEventListener("click", deleteHandler);
        icon.addEventListener("click", deleteHandler);
    });
}

if (deleteCloseBtn) {
    deleteCloseBtn.addEventListener("click", () => {
        deletePopupOverlay.classList.add("d-none");
        rowToDelete = null;
    });
}

if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener("click", () => {
        if (rowToDelete) rowToDelete.remove();
        deletePopupOverlay.classList.add("d-none");
        rowToDelete = null;
    });
}

attachDeleteListeners();

/* ================================
   VIEW BOOK POPUP LOGIC
================================ */
const viewBookOverlay = document.getElementById("viewBookOverlay");
const viewCloseBtn = document.getElementById("viewCloseBtn");
const viewCloseBtn2 = document.getElementById("viewCloseBtn2");

function closeViewPopup() {
    viewBookOverlay.classList.add("d-none");
}

if (viewCloseBtn) viewCloseBtn.addEventListener("click", closeViewPopup);
if (viewCloseBtn2) viewCloseBtn2.addEventListener("click", closeViewPopup);

function attachViewListeners() {
    document.querySelectorAll(".view-book-icon").forEach(icon => {
        icon.addEventListener("click", function () {

            const row = this.closest("tr");
            const cells = row.querySelectorAll("td");

            document.getElementById("viewISBN").textContent = cells[0].textContent;
            document.getElementById("viewTitle").textContent = cells[1].textContent;
            document.getElementById("viewAuthors").textContent = cells[2].textContent;
            document.getElementById("viewPublisher").textContent = cells[3].textContent;
            document.getElementById("viewYear").textContent = cells[4].textContent;
            document.getElementById("viewTotalCopies").textContent = cells[5].textContent;
            document.getElementById("viewAvailableCopies").textContent = cells[6].textContent;

            viewBookOverlay.classList.remove("d-none");
        });
    });
}
/* ================================
   EDIT BOOK POPUP LOGIC
================================ */

let rowBeingEdited = null;

const editBookOverlay = document.getElementById("editBookOverlay");
const editCloseBtn = document.getElementById("editCloseBtn");
const editCancelBtn = document.getElementById("editCancelBtn");
const editConfirmBtn = document.getElementById("editConfirmBtn");

const editISBN = document.getElementById("editISBN");
const editTitle = document.getElementById("editTitle");
const editAuthors = document.getElementById("editAuthors");
const editPublisher = document.getElementById("editPublisher");
const editYear = document.getElementById("editYear");
const editTotalCopies = document.getElementById("editTotalCopies");
const editAvailableCopies = document.getElementById("editAvailableCopies");

function openEditPopup(row) {
    rowBeingEdited = row;

    const cells = row.querySelectorAll("td");

    editISBN.value = cells[0].textContent.trim();
    editTitle.value = cells[1].textContent.trim();
    editAuthors.value = cells[2].textContent.trim();
    editPublisher.value = cells[3].textContent.trim();
    editYear.value = cells[4].textContent.trim();
    editTotalCopies.value = cells[5].textContent.trim();
    editAvailableCopies.value = cells[6].textContent.trim();

    editBookOverlay.classList.remove("d-none");
}

function closeEditPopup() {
    editBookOverlay.classList.add("d-none");
    rowBeingEdited = null;
}

if (editCloseBtn) editCloseBtn.addEventListener("click", closeEditPopup);
if (editCancelBtn) editCancelBtn.addEventListener("click", closeEditPopup);

editConfirmBtn.addEventListener("click", () => {
    if (!rowBeingEdited) return;

    const cells = rowBeingEdited.querySelectorAll("td");

    cells[1].textContent = editTitle.value.trim();
    cells[2].textContent = editAuthors.value.trim();
    cells[3].textContent = editPublisher.value.trim();
    cells[4].textContent = editYear.value.trim();
    cells[5].textContent = editTotalCopies.value.trim();
    cells[6].textContent = editAvailableCopies.value.trim();

    closeEditPopup();
});

/* Attach edit listeners */
function attachEditListeners() {
    document.querySelectorAll(".edit-book-icon").forEach(icon => {
        icon.addEventListener("click", function () {
            openEditPopup(this.closest("tr"));
        });
    });
}
attachViewListeners();
attachEditListeners();
