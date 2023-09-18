const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {  
  var isbn = req.params.isbn;
  var review = req.body.review;
  console.log(req.user["data"]);
  var user = req.user["data"];
  book_reviews = books[isbn]["reviews"];
  books[isbn]["reviews"][user] = review;
  res.status(200).send("The review for the book with ISBN " + isbn +" has been added/updated.");
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
  var isbn = req.params.isbn;
  var user = req.user["data"];
  delete books[isbn]["reviews"][user];
  res.status(200).send("Review for the ISBN " + isbn +" posted by the user "+user+" deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;