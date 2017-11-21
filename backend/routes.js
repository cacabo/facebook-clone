const express = require('express');
const router = express.Router();

// YOUR API ROUTES HERE

// SAMPLE ROUTE
router.get('/users', (req, res) => {
    res.send({
      location: "/users",
      success: true,
    });
});

module.exports = router;
