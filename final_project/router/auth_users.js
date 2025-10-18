const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (exists)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// --------- LOGIN ROUTE (/customer/login) -----------
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate credentials
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const accessToken = jwt.sign(
      { data: username },
      "fingerprint_customer", // secret key
      { expiresIn: '1h' }
    );

    // Save token in session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "Login successful",
      token: accessToken
    });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
