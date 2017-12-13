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
 * Find users with the passed in affiliation
 */
router.get('/users/affiliations/:affiliation/', (req, res) => {
  // Get the prefix from the request
  const affiliation = req.params.affiliation;

  // Get the users from the database
  db.affiliationUsers(affiliation, (data, err) => {
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
 * Search for users
 */
router.get('/users/search/:prefix/', (req, res) => {
  // Get the prefix from the request
  const prefix = req.params.prefix;

  // Get the users from the database
  db.searchUsers(prefix, (data, err) => {
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
        error: err,
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
 * Get newsfeed statuses of the user that is logged in (friends as well as his/her own)
 */
router.get('/newsfeed', (req, res) => {
  if (!req.session.username) {
    // If the current user is not logged in
    res.send({
      success: false,
      error: "User must be logged in.",
    });
  }

  const user = req.session.username;

  // Get newsfeed statuses of the user that is logged in
  db.getNewsfeedStatuses(user, (data, err) => {
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
 * Update a user object
 */
router.post('/users/:username/update/', (req, res) => {
  const sessionUsername = req.session.username;
  const reqUsername = req.params.username;

  // Ensure that the two uesernames are the same
  if (sessionUsername === reqUsername) {
    // Regular expression for validating URL's
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    // Error checking
    if (!req.body.name) {
      res.send({
        success: false,
        error: "Name must be populated.",
      });
    } else if (req.body.affiliation && req.body.affiliation.length > 50) {
      res.send({
        success: false,
        error: "Affiliation can be at most 50 characters.",
      });
    } else if (req.body.bio && req.body.bio.length > 200) {
      res.send({
        success: false,
        error: "Bio must be less than 200 characters.",
      });
    } else if (req.body.interests && req.body.interests.length > 200) {
      res.send({
        success: false,
        error: "Interests must be less than 200 characters.",
      });
    } else if (req.body.profilePicture && !urlRegex.test(req.body.profilePicture)) {
      res.send({
        success: false,
        error: "Profile picture must be a valid url.",
      });
    } else if (req.body.coverPhoto && !urlRegex.test(req.body.coverPhoto)) {
      res.send({
        success: false,
        error: "Cover photo must be a valid URL.",
      });
    }

    // Update the object to contain the information we want
    const obj = {
      username: sessionUsername,
      name: req.body.name,
      affiliation: req.body.affiliation.toLowerCase(),
      bio: req.body.bio,
      interests: req.body.interests.toLowerCase(),
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
  db.getUserFeed(username, (data, err) => {
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
        error: "User not found, consider signing up.",
      });
    } else if (data) {
      // Else the user exists: check the password
      if (hash !== data.password) {
        res.send({
          success: false,
          error: "Username and password do not match."
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
  db.addFriendship(friend1, friend2, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        success: true,
        data: data.data
      });
    }
  });
});

/**
 * Get a list of user's friends
 */
router.get('/users/:username/friends', (req, res) => {
  // Friend the current user is friending
  const user = req.params.username;

  // Create the friendship in the database
  db.getFriendships(user, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        success: true,
        data: data
      });
    }
  });
});

/**
 * Get specific friend
 */
router.get('/users/:username/friends/:friendUsername', (req, res) => {
  // Friend the current user is friending
  const user = req.params.username;
  const friend = req.params.friendUsername;

  // Create the friendship in the database
  db.getFriend(user, friend, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        success: true,
        data: data
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
        error: checkErr,
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
            error: addErr,
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
            error: deleteErr,
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
        error: addErr,
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
 * Get all comments for status
 */
router.get('/users/:username/statuses/:statusID/comments', (req, res) => {
  const statusID = req.params.statusID;

  // Get all comments of a status using ID
  db.getComments(statusID, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        error: err,
      });
    } else {
      res.send({
        success: true,
        data: data
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
        error: err,
      });
    } else {
      res.send({
        success: true,
      });
    }
  });
});


/**
 * Create a new invite
 */
router.post('/users/:inviter/chats/:roomID/invite/:receiver', (req, res) => {
  // Get the status and liker
  const sender = req.params.inviter;
  const receiver = req.params.receiver;
  const room = req.params.roomID;
  
  // Create an invite with sender, receiver, and room        
  db.createInvite(sender, receiver, room, (data, err) => {
    if (err) {
      res.send({
        success: false,
        error: err,
      });
    } else {
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
 * Gets all invites for a particular user
 */
router.get('/users/:username/invites', (req, res) => {
  const username = req.params.username;

  // Get all invites of a user using username
  db.getInvites(username, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
        data: data
      });
    }
  });
});

/**
 * Deletes an invite for a particular user/room after they accept it
 */
router.post('/users/:receiver/chats/:roomID/deleteInvite', (req, res) => {
  const receiver = req.params.receiver;
  const roomID = req.params.roomID;

  // Deletes an invite using the reveier of invite and room invited to
  db.deleteInvite(receiver, roomID, (success, err) => {
    if (err || !success) {
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
 * Gets all messages for a particular room
 */
router.get('/users/:username/chats/:roomID/messages', (req, res) => {
  const username = req.params.username;
  const room = req.params.roomID;

  // Gets messages based on username and room
  db.getMessages(username, room, (data, err) => {
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
        data: data
      });
    }
  });
});

/**
 * Creates a message for a room
 */
router.post('/users/:username/chats/:roomID/newMessage/:message', (req, res) => {
  const username = req.params.username;
  const room = req.params.roomID;
  const body = req.params.message;

  // Creates message with username, body, and room
  db.createMessage(username, body, room, (success, err) => {
    if (err || !success) {
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
 * Gets all chats for a user
 */
router.get('/users/:username/chats', (req, res) => {
  const username = req.params.username;

  // Get all chats of a user using username
  db.getChats(username, (data, err) => {
    console.log("Data");
    console.log(data);
    if (err || !data) {
      res.send({
        success: false,
        err: err,
      });
    } else {
      res.send({
        success: true,
        data: data
      });
    }
  });
});

/**
 * Creates a createUserChatRelationship
 */
router.post('/users/:username/chats/:roomID/newUserChatRelationship', (req, res) => {
  const username = req.params.username;
  const roomID = req.params.roomID;

  // Creates a user chat relationship
  db.createUserChatRelationship(username, roomID, (success, err) => {
    if (err || !success) {
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
