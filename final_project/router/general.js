const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    let username = req.body.username
    let password = req.body.password

    if (username && password) {
        if (isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});
        }
      }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    let myPromise = new Promise ((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4))
    });

    myPromise.then((response) => {
        return res.send(response)
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let myPromise = new Promise ((resolve, reject) => {
        if (books[req.params.isbn]) {
            resolve(JSON.stringify(books[req.params.isbn], null, 4))
        } else {
            reject("Error. Can't find the book with that isbn")
        }
    });

    myPromise
    .then((response) => { return res.send(response)})  
    .catch((err) => { return res.send(err)})
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let myPromise = new Promise ((resolve, reject) => {
    Object.keys(books).forEach((key) => {
        if (books[key].author === req.params.author) {
            resolve(JSON.stringify(books[key], null, 4))
        }
    })
    reject("Error. Can't find the author")
  });
  myPromise
  .then((response) => {
    return res.send(response)
  })  
  .catch((err) => {
    return res.send(err)
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise ((resolve, reject) => {
        Object.keys(books).forEach((key) => {
            if (books[key].title === req.params.title) {
                resolve(JSON.stringify(books[key], null, 4))
            }
        })
        reject("Error. Can't find the title")
    });
    myPromise
    .then((response) => {
        return res.send(response)
    })
    .catch((err) => {
        return res.send(err)
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let targeted_book = books[isbn]
  return res.send(JSON.stringify(targeted_book.reviews))
});

module.exports.general = public_users;
