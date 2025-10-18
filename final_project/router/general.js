const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Convert the books object to a nicely formatted JSON string
  let formattedBooks = JSON.stringify(books, null, 4);
  res.send(formattedBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve ISBN from the URL parameters
  const isbn = req.params.isbn;

  // Check if the book exists in the database
  const book = books[isbn];

  if (book) {
    // If found, return the book details in a neat format
    res.send(JSON.stringify(book, null ,4));
  } else {
    // If not found, return a 404 message
    res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Step 1: Get the author name from the request parameters
  const authorName = req.params.author;

  // Step 2: Get all keys (ISBNs) from the books object
  const keys = Object.keys(books);

  // Step 3: Create an array to store books by this author
  let booksByAuthor = [];

  // Step 4: Loop through each book and check if the author matches
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });

  // Step 5: Send the results
  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
