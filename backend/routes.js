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
    console.log("ROUTE: ", data);
    console.log("ROUTE ERR: ", err);
    res.send({
      "success": true,
    });
  });
});

module.exports = router;
