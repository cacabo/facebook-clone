// Import frameworks
const express = require('express');
const router = express.Router();
const SHA3 = require('crypto-js/sha3');
const db = require('./database.js');

/**
 * TODO ensure that a user is logged in where it makes sense
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
  db.getStatuses((err, data) => {
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
 */
router.get('/users/:username/statuses/:id', (req, res) => {
  // if (!req.session.username) {
  //   // If the current user is not logged in
  //   res.send({
  //     success: false,
  //     error: "User must be logged in",
  //   });
  // }

  // Find the ID and username
  const username = req.params.username;
  const id = req.params.id;

  // Find the status in the database
  db.getStatus(username, id, (data, err) => {
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
 * Update a user object
 */
router.post('/users/:username/update/', (req, res) => {
  const sessionUsername = req.session.username;
  const reqUsername = req.params.username;

  // Ensure that the two uesernames are the same
  if (sessionUsername === reqUsername) {
    // Update the object to contain the information we want
    const obj = {
      username: sessionUsername,
      name: req.body.name,
      affiliation: req.body.affiliation,
      bio: req.body.bio,
      interests: req.body.interests,
      profilePicture: req.body.profilePicture,
      coverPhoto: req.body.coverPhoto,
    };

    // Send the object to the database
    db.updateUser(obj, (data, err) => {
      if (err || !data) {
        // If there was an error updating
        res.send({
          success: false,
          error: err,
        });
      } else {
        // If the update was successful
        res.send({
          success: true,
          data: data,
        });
      }
    });
  } else {
    // If there is no username match
    res.send({
      success: false,
      error: "Invalid user credentials.",
    });
  }
});

/**
 * Get all statuses by a particular user
 * TODO get statuses to this user
 */
router.get('/users/:username/statuses/', (req, res) => {
  // Find the username in the URL
  const username = req.params.username;

  // Get the statuses from the database
  db.getUserStatuses(username, (data, err) => {
    if (err) {
      // If there is an error or no data is sent
      res.send({
        success: false,
        error: err,
      });
    } else if (!data) {
      // If no data was returned
      res.send({
        success: false,
        error: "No data returned."
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
    // There was an error looking up user
    if (err || !data) {
      res.send({
        success: false,
        err: "User not found, consider signing up.",
      });
    } else if (data) {
      // Else the user exists: check the password
      if (hash !== data.password) {
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
 * Add a friend
 */
router.get('/users/:username/friends/new', (req, res) => {
  // Friend the current user is friending
  const friend2 = req.params.username;

  // Current user (as based on the express session)
  const friend1 = req.session.username;

  // Create the friendship in the database
  db.createFriendship(friend1, friend2, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
      });
    }
  });
});

/**
 * Check if user has liked status (for front end)
 */
router.get('/users/:username/statuses/:statusID/checkLike', (req, res) => {
  // Get the status and liker
  const statusID = req.params.statusID;
  const statusUser = req.params.username;
  const liker = req.session.username;

  // Check if user has liked the status already
  db.checkLike(liker, statusUser, statusID, (checkData, checkErr) => {
    if (!checkData || checkErr) {
      // Not liked yet
      res.send({
        success: false,
        err: checkErr,
      });
    } else {
      // Already liked
      res.send({
        success: true,
        data: checkData,
      });
    }
  });
});

/**
 * Add like to statuses
 * TODO: checkLike, and then either go to addLike or deleteLike
 */
router.get('/users/:username/statuses/:statusID/likes', (req, res) => {
  // Get the status and liker
  const statusID = req.params.statusID;
  const statusUser = req.params.username;
  const liker = req.session.username;

  // Add like and update status
  db.checkLike(liker, statusUser, statusID, (data, err) =>{
    // If Like doesn't exist, add like
    if (err || !data) {
      db.addLike(liker, statusUser, statusID, (addData, addErr) => {
        if (addErr || !addData) {
          res.send({
            success: false,
            err: addErr,
          });
        } else {
          res.send({
            success: true,
            data: addData,
          });
        }
      });
    } else {
      // If Like exists, delete
      db.deleteLike(liker, statusUser, statusID, (deleteData, deleteErr) => {
        if (deleteErr || !deleteData) {
          res.send({
            success: false,
            err: deleteErr,
          });
        } else {
          res.send({
            success: true,
            data: deleteData,
          });
        }
      });
    }
  });
});

/**
 * Add new comment for status
 */
router.post('/users/:username/statuses/:statusID/comments/new', (req, res) => {
  const comment = req.body.comment;
  const statusUser = req.params.username;
  const statusID = req.params.statusID;
  const commenter = req.session.username;

  // Add comment
  db.addComment(commenter, comment, statusUser, statusID, (addData, addErr) => {
    if (addErr || !addData) {
      res.send({
        success: false,
        err: addErr,
      });
    } else {
      res.send({
        success: true,
        data: addData,
      });
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
 * Add like to statuses
 * TODO: first check if the like exists or not
 *       if it does exist, then delete the like
 *       if it does not exists, then add the like
 */
router.get('/users/:username/statuses/:statusID/likes', (req, res) => {
  // Get the status and liker
  const statusID = req.params.statusID;
  const statusUser = req.params.username;
  const liker = req.session.username;

  // Add like and update status
  db.deleteLike(liker, statusUser, statusID, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
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
