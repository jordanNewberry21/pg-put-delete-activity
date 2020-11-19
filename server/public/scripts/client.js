$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);
  $('#bookShelf').on('click', '.readBtn', changeStatus);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  // if (book.title === '') {
  //   alert('Please tell me the name of the book...');
  // } else if (book.author === '') {
  //   alert('Please let me know who wrote this book...');
  // } else {
    addBook(book);
  };
//}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr data-id=${book.id}></tr>`);
    // $tr.data('book', book); -- is this line redundant with what I have inside the tr?
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class="btn btn-primary readBtn">Read It!</button></td>`);
    $tr.append(`<td><button class="deleteBtn btn btn-danger">Delete Book</button>`);
    $('#bookShelf').append($tr);
  }
}

function deleteBook() {
  console.log('Deleting book from bookShelf...');
  let bookId = $(this).closest('tr').data('id'); // getting id of book from deleteBtn click event
  console.log(bookId);
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then(function (response) {
    refreshBooks();
  }).catch(function (error) {
    console.log('Error ...', error);
    alert('Something went wrong. Please try again.');
  });
}

function changeStatus() {
  let bookId = $(this).closest('tr').data('id'); // targeting book by the ID number
  console.log(`Changing status for book: ${bookId}...`); // logging variable to confirm
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
  }).then(function (response) {
    refreshBooks();
  }).catch(function (error) {
    console.log('Error...', error);
    alert('Something went wrong. Please try again.');
  });
}