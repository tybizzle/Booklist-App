// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class
class UI {
  // Add book to list
  addBookToList(book) {
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

   // Show alert
  showAlert(message, className) {
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
  deleteBook(target) {
    if(target.className === 'delete' ) {
      target.parentElement.parentElement.remove();
    }
  }

  // Clear fields
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      } 
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM load event to display books
document.addEventListener('DOMContentLoaded', Store.displayBooks); 

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

  // Validate
  if(title === '' || author === '' || isbn === '') {
    // Show alert
    ui.showAlert('Please fill in all details', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add book to LS
    Store.addBook(book);

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
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});