// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

        list.appendChild(row);
    }

    // Delete book
    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    // Clear fields after submission
    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }

    // show alerts
    static showAlerts(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // remove the alert timer
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
}

// storage class: Local Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: Displaying books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // prevent actual submit
    e.preventDefault();

    // Get form data
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate
    if (!title || !author || !isbn) {
        UI.showAlerts("Please fill in all fields", "danger");
    } else {
        // insatiate a book
        const book = new Book(title, author, isbn);
        console.log(book);

        // add a book to UI
        UI.addBookToList(book);

        // add book to store
        Store.addBook(book);
        UI.showAlerts("Book added successfully", "info");

        // Clear the fields
        UI.clearFields();
    }
});

// Event: Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    // Remove from UI
    UI.deleteBook(e.target);

    // Remove from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlerts("Book removed", "danger");
});
