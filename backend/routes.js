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

router.get('/users', (req, res) => {
  db.getUser("cameroncabo@gmail.com", (data, err) => {
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

module.exports = router;
