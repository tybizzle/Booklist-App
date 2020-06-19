// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Store Constuctor
function Store() {}

// Add book to prototype method "addBookToList"
UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');
  // Create tr element
  const row = document.createElement('tr');
  // Insert Col
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;
  // Append list to row
  list.appendChild(row);
}

// Show Alert
UI.prototype.showAlert = function(message, className) {
  // Create div element
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Append text node
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container');
  // Get form
  const form = document.querySelector('#book-form');
  // Insert error alert
  container.insertBefore(div,form);

  // Set timeout after 3 secs
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000);
}

// Delete book
UI.prototype.deleteBook = function(target) {
  if(target.className === 'delete' ) {
    target.parentElement.parentElement.remove();
  }
}

// Clear fields
UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Store in Local Storage
// Get book from LS
Store.prototype.getBooks = function() {
  let books;
  if(localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }

  return books;
}

// Display books
Store.prototype.displayBooks = function() {
  const store = new Store();
  const books = store.getBooks();

  books.forEach(function(book) {
    const ui = new UI();

    // Add book to UI
    ui.addBookToList(book);
  });
}

// Add book
Store.prototype.addBook = function(book) {
  const store = new Store();
  const books = store.getBooks();

  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
}

// Remove book
Store.prototype.removeBook = function(isbn) {
  const store = new Store();
  const books = store.getBooks();

  books.forEach(function(book, index) {
    if(book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
}

// DOM load event to display books
const store = new Store();
document.addEventListener('DOMContentLoaded', store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  // Get input values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // Instantiate book object
  const book = new Book(title, author, isbn);

  // Instantiate UI object
  const ui = new UI();

  // Instantiate store object
  const store = new Store();

  // Validate
  if(title === '' || author === '' || isbn === '') {
    // Show alert
    ui.showAlert('Please fill in all details', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add book to LS
    store.addBook(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for delete book
document.getElementById('book-list').addEventListener('click', function(e) {
  // Instantiate UI object
  const ui = new UI();

  // Delete book
  ui.deleteBook(e.target);

  // Remove from LS
  const store = new Store();
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});