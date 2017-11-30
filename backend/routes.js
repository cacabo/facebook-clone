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
