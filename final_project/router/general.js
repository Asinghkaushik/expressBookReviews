const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  var author = req.params.author;
  booksbyauthor =[];
  for(var i=1;i<=Object.keys(books).length;i++){
    if(books[i].author == author) {
      var temp = {
        "isbn": i,
        "title": books[i].title,
        "reviews": books[i].reviews
      }
      booksbyauthor.push(temp);
    }
  }
  res.send({"booksbyauthor": booksbyauthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  var title = req.params.title;
  booksbytitle =[];
  for(var i=1;i<=Object.keys(books).length;i++){
    if(books[i].title == title) {
      var temp = {
        "isbn": i,
        "author": books[i].author,
        "reviews": books[i].reviews
      }
      booksbytitle.push(temp);
    }
  }
  res.send({"booksbytitle": booksbytitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;