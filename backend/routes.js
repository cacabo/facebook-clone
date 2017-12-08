// Import frameworks
const express = require('express');
const router = express.Router();
const SHA3 = require('crypto-js/sha3');
const db = require('./database.js');

/**
 * TODO handle 404 error
 * TODO ensure that a user is logged in
 */

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
 * Return the current session if there is one
 */
router.get('/session', (req, res) => {
  // Check the session cookie
  if (req.session.username) {
    res.send({ success: true, username: req.session.username });
  } else {
    res.send({ success: false });
  }
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
 * Create a new status
 */
router.post('/statuses/new', (req, res) => {
  if (!req.session.username) {
    // If the current user is not logged in
    res.send({
      success: false,
      error: "User must be logged in.",
    });
  }

  // Find instance variables
  const content = req.body.content;
  const receiver = req.body.receiver;
  const user = req.session.username;

  // Add the status to the database
  db.createStatus(content, receiver, user, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: "Error adding user to database.",
      });
    } else {
      res.send({
        success: true,
        data,
      });
    }
  });
});

/**
 * Get all statuses by a particular user
 * TODO test that this works / implement
 */
router.get('/users/:username/statuses/', (req, res) => {
  // Find the username in the URL
  const username = req.params.username;

  // Get the statuses from the database
  db.getUserStatuses(username, (data, err) => {
    if (err || !data) {
      // If there is an error or no data is sent
      res.send({
        success: false,
        error: err,
      });
    } else {
      // If there is a success, relay the data to the user
      res.send({
        success: true,
        data,
      });
    }
  });
});

/**
 * Get a single status
 * TODO
 */
router.get('/statuses/:id', (req, res) => {
  // Find the id in the URL
  const id = req.params.id;

  // Get the status from the database
  db.getStatus(id, (data, err) => {
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
      } else {
        // Update the user session
        req.session.username = req.body.username;

        // Send success to the user
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

/**
 * Handle a 404
 */
router.get('*', (req, res) => {
  res.status(404).send("404: page not found");
});

module.exports = router;
