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

// Login the user
router.post('/users/sessions/new', (req, res) => {
  db.getUser(req.body.username, (data, err) => {
    //  there was an error looking up user
    if(err) {
      res.send({
        success: false,
        err: "Username Doesn't Exist. Consider signing up",
      });
    // user exists
    } else if (data) {
      // check password
      if(req.body.password !== data.password) {
        res.send({
          success: false,
          err: "Wrong Password"
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
      // Set teh session username
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
