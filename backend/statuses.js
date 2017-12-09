// Import the user table
const { Status, User } = require('./vogels.js');
const uuid = require('uuid-v4');
const async = require('async');

/**
 * Create a status
 */
function createStatus(content, receiver, user, callback) {
  // Ensure inputs are valid
  if (!content) {
    callback(null, "Content must be populated");
  } else if (!user) {
    callback(null, "User must be populated");
  } else {
    const obj = {
      content,
      receiver,
      user,
      type: "STATUS",
      commentsCount: 0,
      likesCount: 0,
      id: uuid(),
    };

    // Put the status in to the database
    Status.create(obj, (err, data) => {
      if (err || !data) {
        callback(null, "Failed to put status in database.");
      } else {
        callback(data, null);
      }
    });
  }
}

/**
 * Get all statuses in the table
 */
function getStatuses(callback) {
  Status
    .scan()
    .loadAll()
    .exec((err, data) => {
      // Prune out the status data
      const statuses = data.Items.map(item => item.attrs);

      // Get the userData for each status
      async.each(statuses, (status, keysCallback) => {
        User.get(status.user, (userErr, userData) => {
          if (userErr || !userData) {
            callback(userErr, null);
          } else {
            // Find the user object
            const userObj = userData.attrs;

            // Delete unneeded info
            delete userObj.password;
            delete userObj.affiliation;
            delete userObj.interests;
            delete userObj.bio;
            delete userObj.coverPhoto;

            // Update the status object
            status.userData = userObj;
            keysCallback();
          }
        });
      }, (asyncErr) => {
        if (asyncErr) {
          // If there is an error with the async operation
          callback(asyncErr, null);
        } else {
          // Sort the statuses
          statuses.sort((a, b) => {
            const aCreatedAt = new Date(a.createdAt);
            const bCreatedAt = new Date(b.createdAt);
            return bCreatedAt - aCreatedAt;
          });

          // Return the statuses to the user
          callback(err, statuses);
        }
      });
    });
}

/**
 * Get a single status based on the passed in ID
 */
function getStatus(username, id, callback) {
  // Error checking
  if (!id) {
    callback(null, "Status ID must be well-defined");
  } else if (!username) {
    callback(null, "Username must be well-defined");
  } else {
    // If the id is properly formatted
    Status.get(id, (err, statusData) => {
      if (err || !statusData) {
        callback(null, "Status not found");
      } else {
        // Find the status information from the data
        const status = statusData.attrs;

        // Find the user of the status
        User.get(status.user, (userErr, userData) => {
          if (userErr || !userData) {
            callback(null, "Failed to retrieve status information.");
          } else {
            // Parse for the user data as an object
            const userDataObj = userData.attrs;

            // Remove unnecessary fields
            delete userDataObj.password;
            delete userDataObj.bio;
            delete userDataObj.coverPhoto;
            delete userDataObj.interests;
            delete userDataObj.affiliation;

            // Put the user information into the status object
            status.userData = userDataObj;

            // Return the status
            callback(status, null);
          }
        });
      }
    });
  }
}

// Create an object to store the helper functions
const statuses = {
  createStatus,
  getStatuses,
  getStatus,
};

// Export the object
module.exports = statuses;
