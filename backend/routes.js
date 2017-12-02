const express = require('express');
const router = express.Router();
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
  db.getUser(req.body.username, (data, err) => {
    //  there was an error looking up user
    if(err) {
      res.send({
        success: false,
        err: "User not found, consider signing up.",
      });
    // user exists
    } else if (data) {
      // check password
      if(req.body.password !== data.password) {
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
  db.createUser(req.body, (data, err) => {
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
