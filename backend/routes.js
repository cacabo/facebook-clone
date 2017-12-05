const express = require('express');
const router = express.Router();
const SHA3 = require('crypto-js/sha3');
const db = require('./database.js');

/**
 * Denote that the API is up and running
 */
router.get('/', (req, res) => {
  res.send({
    success: true,
    data: "The API is up and running",
  });
});

/**
 * Sign the user out
 */
router.get('/logout', (req, res) => {
  // Delete the current session
  req.session.destroy();

  // Send the success
  res.send({
    success: true,
  });
});

/**
 * Get all statuses
 * NOTE this likely is not userful though can be used to start off before we
 * have more targetted database methods
 * TODO test that this works
 */
router.get('/statuses', (req, res) => {
  // Find all statuses in the database
  db.getStatuses((data, err) => {
    if (err || !data) {
      // If there is an error or no data is sent
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        // If there is a success, relay the data to the user
        success: true,
        data: data,
      });
    }
  });
});

/**
 * Get a single status
 * TODO
 */
router.get('/statuses/id', (req, res) => {
  // Get the status from the database
  db.getStatus((data, err) => {
    if (err || !data) {
      // If there is an error or no data is sent
      res.send({
        success: false,
        error: err,
      });
    } else {
      // TO
      res.send({
        // If there is a success, relay the data to the user
        success: true,
        data: data,
      });
    }
  });
});

/**
 * Find a user with the specified username
 */
router.get('/users/:username', (req, res) => {
  // Find the username in the URL
  const username = req.params.username;

  // Find the user in the database
  db.getUser(username, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  });
});

/**
 * Login the user (start a new express session)
 */
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

/**
 * Register a new user
 */
router.post('/users/new', (req, res) => {
  // Hash the password and confirm password
  const obj = req.body;
  const hashPassword = SHA3(req.body.password).toString();
  const hashConfirmPassword = SHA3(req.body.confirmPassword).toString();

  // Update the object containing the form data
  obj.password = hashPassword;
  obj.confirmPassword = hashConfirmPassword;

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
