const express = require('express');
const router = express.Router();
const SHA3 = require('crypto-js/sha3');
const db = require('./database.js');

// API routes
router.get('/', (req, res) => {
  res.send({
    success: true,
    data: "The API is up and running",
  });
});

// Sign the user out
router.get('/logout', (req, res) => {
  // Delete the current session
  req.session.destroy();

  // Send the success
  res.send({
    success: true,
  });
});

// Login the user
router.post('/users/sessions/new', (req, res) => {
  // Hash the password
  const hash = SHA3(req.body.password).toString();

  // Query for the specified user
  db.getUser(req.body.username, (data, err) => {
    //  there was an error looking up user
    if (err) {
      res.send({
        success: false,
        err: "User not found, consider signing up.",
      });
    } else if (data) {
      // Else the user exists: check the password
      if(hash !== data.password) {
        res.send({
          success: false,
          err: "Username and password do not match."
        });
      } else{
        res.send({
          success: true,
          data: data,
        });
      }
    }
  });
});

// Find a user with the specified username
router.get('/users/:username', (req, res) => {
  // Find the username in the URL
  const username = req.params.username;

  // Find the user in the database
  db.getUser(username, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
});

// Register a new user
router.post('/users/new', (req, res) => {
  // Hash the password
  const obj = req.body;
  const hash = SHA3(req.body.password).toString();
  obj.password = hash;

  // Create the user in the database
  db.createUser(obj, (data, err) => {
    if (err) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      // Set the session username
      req.session.username = req.body.username;

      // Propogate the success to the component
      res.send({
        success: true,
        data: data,
        username: req.session.username,
      });
    }
  });
});

module.exports = router;
