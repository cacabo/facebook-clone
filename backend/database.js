// Import the keyvaluestore
const keyvaluestore = require('./keyvaluestore.js');
const async = require('async');
const uuid = require('uuid-v4');

// Create users table and initialize it
const users = new keyvaluestore('users');
users.init(() => {});

// Create statuses table and initialize it
const statuses = new keyvaluestore('statuses');
statuses.init(() => {});

/**
 * TODO create other tables as per the sample data
 */

/**
 * Get all statuses in the table
 * TODO sort chronologically
 */
function getStatuses(callback) {
  statuses.scanKeys((err, values) => {
    if (err || !values) {
      callback(null, "Failed to retrieve keys.");
    } else {
      // Construct a status array
      const statusArr = [];

      // Iterate over the keys in the statuses array
      async.each(values, (value, keysCallback) => {
        // Find the username associated with the key
        const keyword = value.key;

        // Find the status with the given key
        statuses.get(keyword, (statusErr, statusData) => {
          if (statusErr || !statusData) {
            // If we failed to retrieve data
            callback(null, "An error occured: " + statusErr);
          } else {
            // Get the status object
            const status = JSON.parse(statusData[0].value);

            // Get the status's user's info
            users.get(status.user, (userErr, userData) => {
              if (userErr || !userData) {
                callback(null, "Failed to retrieve status information.");
              } else {
                // Parse for the user data as an object
                const userDataObj = JSON.parse(userData[0].value);

                // Put the user information into the status object
                status.userData = userDataObj;

                // Push the status onto the array
                statusArr.push(status);

                // Alert that the async call is done
                keysCallback();
              }
            });
          }
        });
      }, (asyncErr) => {
        if (asyncErr) {
          // If there is an error with the async operation
          callback(null, asyncErr);
        } else {
          // Send the statuses to the user
          callback({ statusArr }, null);
        }
      });
    }
  });
}

/**
 * Get a single status based on the passed in ID
 */
function getStatus(id, callback) {
  if (!id || id.length === 0) {
    callback(null, "Status ID must be well-defined");
  } else {
    statuses.get(id, (err, data) => {
      if (err || !data) {
        callback(null, "Status not found");
      } else {
        callback(data, null);
      }
    });
  }
}

/**
 * Create a status
 * TODO find the key
 */
function createStatus(content, receiver, user, callback) {
  // Data validation
  if (!content) {
    callback(null, "Content must be populated");
  } else if (!user) {
    callback(null, "User must be populated");
  } else {
    /**
     * TODO find the key-- based on the inx? Unique ID?
     */
    const obj = {
      content,
      receiver,
      user,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "STATUS",
      commentsCount: 0,
      likesCount: 0,
    };

    // Find a unique key identifier
    const key = obj.user + ":" + uuid();

    // Put the status in to the database
    statuses.put(key, JSON.stringify(obj), (err, data) => {
      if (err || !data) {
        callback(null, "Failed to put status in database.");
      } else {
        callback({ inx: data, key }, null);
      }
    });
  }
}

/**
 * Get all statuses by a user
 * TODO perform a range query for the specific statuses we want
 */
function getUserStatuses(username, callback) {
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined");
  }

  console.log(username);
  callback(null, "Not yet implemented");
}

/**
 * Get a user with the specified username
 */
function getUser(username, callback) {
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined");
  }

  users.get(username, (err, data) => {
    if (err || !data) {
      // If there was an issue getting the data
      callback(null, "User not found");
    } else {
      // Find the value in the returned data
      var value = JSON.parse(data[0].value);

      // Return the value without error
      callback(value, null);
    }
  });
}

/**
 * Create a new user
 */
function createUser(user, callback) {
  // Perform error checking
  if (!user.username ||
      !user.firstName ||
      !user.lastName ||
      !user.password ||
      !user.confirmPassword) {
    callback(null, "All fields must be populated");
  } else {
    // Ensure the username is properly formatted: no whitespace and only
    // letters, numbers, periods, or underscores
    const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
    const validUsername = usernameRegex.test(user.username);

    // Throw an error if the username is invalid
    if (!validUsername) {
      callback(null, "Username can only contain letters, numbers, periods, hyphens, and underscores.");
    } else if (user.password !== user.confirmPassword) {
      callback(null, "Passwords must match");
    } else if (user.username.length < 2) {
      callback(null, "Username must be at least two characters long.");
    } else if (user.username.length > 30) {
      callback(null, "Username must be less than or equal to 30 characters long.");
    } else if (user.firstName.length > 40) {
      callback(null, "First name must be less than or equal to 40 characters long.");
    } else if (user.lastName.length > 40) {
      callback(null, "Last name must be less than or equal to 40 characters long.");
    } else if (user.password.length < 6) {
      callback(null, "Password must be at least 6 characters long.");
    } else {
      // Fields are properly formatted
      // Check if the user already exists
      users.get(user.username, (userNotFound, userData) => {
        if (userNotFound || !userData) {
          // Remove the confirm password
          delete user.confirmPassword;

          // Initialize timestamps
          user.createdAt = Date.now();
          user.updatedAt = Date.now();

          // Put the user into the table
          const username = user.username;
          users.put(username, JSON.stringify(user), (err, data) => {
            if (err || !data) {
              callback(null, "Failed to create user: " + err);
            } else {
              callback(data, null);
            }
          });
        } else {
          callback(null, "Username already taken.");
        }
      });
    }
  }
}

// Create the database object to export
const database = {
  createUser: createUser,
  getUser: getUser,
  getStatuses: getStatuses,
  getStatus: getStatus,
  getUserStatuses: getUserStatuses,
  createStatus: createStatus,
};

module.exports = database;
