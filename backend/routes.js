const express = require('express');
const router = express.Router();
const db = require('./database.js');

// API routes
router.get('/users', (req, res) => {
    res.send({
      location: "/users",
      success: true,
    });
});

module.exports = router;
