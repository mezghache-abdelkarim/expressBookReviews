const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  // Step 1: Extract username and password from request body
  const { username, password } = req.body;

  // Step 2: Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Step 3: Check if the username already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Step 4: Add new user to the users array
  users.push({ username, password });

  // Step 5: Send success message
  return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate fetching books using axios (from local server)
    const response = await axios.get('http://localhost:5000/booksdata');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

public_users.get('/booksdata', (req, res) => {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;

    // Simulate fetching a single book via Axios from the same API
    const response = await axios.get(`http://localhost:5000/booksdata`);
    const allBooks = response.data;

    const book = allBooks[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
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
public_users.get('/title/:title', function (req, res) {
  // Step 1: Get the title from the request parameters
  const title = req.params.title;

  // Step 2: Get all the book keys (ISBNs)
  const keys = Object.keys(books);

  // Step 3: Create an array to store the matching books
  let booksByTitle = [];

  // Step 4: Loop through the books and find matches
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  });

  // Step 5: Send response
  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Step 1: Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Step 2: Find the book in the database
  const book = books[isbn];

  // Step 3: Check if the book exists
  if (book) {
    // Step 4: Return the book's reviews
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    // Step 5: If not found, send error message
    res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
