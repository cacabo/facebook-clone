const { UserStatus } = require('./schema.js');
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

		//Put the user in to the online database
		UserStatus
    .create(userOnlineObject, (err, data) => {
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
    callback(data, error);
  });
}

/**
 * Deletes user online status object
 */
 function deleteUserStatus(username, callback) {
  UserStatus
  .destroy(username, (deleteErr) => {
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
