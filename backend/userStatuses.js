const { UserStatus, User } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');

/**
 * Create a user online status
 */
function addUserOnline(username, callback) {
  if (!username) {
    callback(null, "Username must be populated");
  } else {
    // Create status object
    const userOnlineObject = {
      id: uuid(),
      username: username,
    };

		// Put the user in to the online database
    UserStatus.create(userOnlineObject, (err, data) => {
      if (err || !data) {
        callback(null, "Failed to put user status in database.");
      } else {
        callback(data, null);
      }
    });
  }
}

/**
 * Get a user currently logged in
 */
function getAllUserStatus(callback) {
  // Find the user in the database
  UserStatus
  .scan()
  .loadAll()
  .exec((error, data) => {
    if (error || !data) {
      callback(null, error.message);
    }
    // Find the list of usernames
    const onlineUsers = data.Items.map(item => ({ username: item.attrs.username }));
    console.log(onlineUsers);

    // Asyncronously pull user data for each
    async.each(onlineUsers, (user, keysCallback) => {
      User.get(user, (userErr, userData) => {
        if (userErr) {
          callback(null, userErr.message);
        } else {
          const userObj = userData.attrs;
          delete userObj.password;
          delete userObj.birthday;
          delete userObj.bio;
          delete userObj.coverPhoto;
          delete userObj.interests;
          delete userObj.affiliation;
          delete userObj.updatedAt;
          delete userObj.createdAt;
          user.userData = userObj;
          keysCallback();
        }
      });
    }, asyncErr => {
      if (asyncErr) {
        callback(null, asyncErr);
      } else {
        // Return the recommendations to the user
        callback(onlineUsers, null);
      }
    });
  });
}

/**
 * Deletes user online status object
 */
function deleteUserStatus(username, callback) {
  UserStatus.destroy(username, (deleteErr) => {
    if (deleteErr) {
      callback(false, "Error trying to delete user status: " + deleteErr.message);
    } else {
      callback(true, null);
    }
  });
}

// Create an object to store the helper functions
const userStatuses = {
  addUserOnline,
  getAllUserStatus,
  deleteUserStatus,
};

// Export the object
module.exports = userStatuses;
