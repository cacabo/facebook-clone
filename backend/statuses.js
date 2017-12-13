// Import the user table
const { Status, User, StatusReceiver, Friendship } = require('./schema.js');
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
        if (obj.receiver) {
          // Create the status receiver object
          const statusReceiver = {
            receiver: obj.receiver,
            id: data.attrs.id,
            user: obj.user,
          };

          // This allows for easy lookup of statuses for which a given user
          // is the receiver.
          StatusReceiver.create(statusReceiver, (receiverErr, receiverData) => {
            if (receiverErr || !receiverData) {
              callback(null, "Failed to create status receiver entry.");
            } else {
              // Send the data back if successful
              callback(data, null);
            }
          });
        } else {
          // Send the data back if there is no receiver
          callback(data, null);
        }
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
            delete userObj.createdAt;

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
          // Get the recipient name
          async.each(statuses, (status, keysCallback) => {
            if (status.receiver) {
              User.get(status.receiver, (userErr, userData) => {
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
                  status.receiverData = userObj;
                  keysCallback();
                }
              });
            } else {
              keysCallback();
            }
          }, (asyncErr2) => {
            if (asyncErr2) {
              callback(asyncErr2, null);
            }

            // Sort the statuses
            statuses.sort((a, b) => {
              const aCreatedAt = new Date(a.createdAt);
              const bCreatedAt = new Date(b.createdAt);
              return bCreatedAt - aCreatedAt;
            });

            // Return the statuses to the user
            callback(err, statuses);
          });
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
    Status
      .query(username)
      .where('id').equals(id)
      .exec((err, data) => {
        // Find the status in the data
        const status = data.Items[0].attrs;

        // Find the user of the status
        User.get(status.user, (userErr, userData) => {
          if (userErr || !userData) {
            callback(null, "Failed to retrieve user information.");
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

            // Find the receiver of the status if there is one
            if (status.receiver) {
              if (status.receiver === status.user) {
                status.receiverData = status.userData;
                callback(status, null);
              } else {
                User.get(status.receiver, (receiverErr, receiverData) => {
                  if (receiverErr || !receiverData) {
                    callback(null, receiverErr.message);
                  } else {
                    // Parse for the user data as an object
                    const receiverDataObj = receiverData.attrs;

                    // Remove unnecessary fields
                    delete receiverDataObj.password;
                    delete receiverDataObj.bio;
                    delete receiverDataObj.coverPhoto;
                    delete receiverDataObj.interests;
                    delete receiverDataObj.affiliation;

                    // Put the user information into the status object
                    status.receiverData = receiverDataObj;

                    // Return the status
                    callback(status, null);
                  }
                });
              }
            } else {
              // Return the status
              callback(status, null);
            }
          }
        });
      });
  }
}

/**
 * Get all statuses by a user
 * TODO perform a range query for the specific statuses we want
 */
function getUserStatuses(username, callback) {
  // Error checking on the username
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined");
  }

  // Check that the user exists
  User.get(username, (userErr, userData) => {
    if (userErr || !userData) {
      callback(null, "User not found.");
    }

    // Store the user object
    const userObj = userData.attrs;

    // Delete unneeded info
    delete userObj.password;
    delete userObj.affiliation;
    delete userObj.interests;
    delete userObj.bio;
    delete userObj.coverPhoto;

    // Else, query for the statuses
    Status
      .query(username)
      .loadAll()
      .exec((err, data) => {
        if (err || !data) {
          callback(null, err);
        } else {
          // Prune out the status data
          const statuses = data.Items.map(item => {
            const status = item.attrs;
            status.userData = userObj;
            return status;
          });

          // Get the recipient name
          async.each(statuses, (status, keysCallback) => {
            if (status.receiver) {
              User.get(status.receiver, (receiverErr, receiverData) => {
                if (receiverErr || !receiverData) {
                  callback(receiverErr, null);
                } else {
                  // Find the user object
                  const receiverObj = userData.attrs;

                  // Delete unneeded info
                  delete receiverObj.password;
                  delete receiverObj.affiliation;
                  delete receiverObj.interests;
                  delete receiverObj.bio;
                  delete receiverObj.coverPhoto;

                  // Update the status object
                  status.receiverData = receiverObj;
                  keysCallback();
                }
              });
            } else {
              keysCallback();
            }
          }, (asyncErr) => {
            if (asyncErr) {
              callback(asyncErr, null);
            }

            // Sort the statuses
            statuses.sort((a, b) => {
              const aCreatedAt = new Date(a.createdAt);
              const bCreatedAt = new Date(b.createdAt);
              return bCreatedAt - aCreatedAt;
            });

            // Return the statuses to the user
            callback(statuses, err);
          });
        }
      });
  });
}

function getNewsfeedStatuses(user, callback) {
  if (!user) {
    callback(null, "User is null.");
  } else {
    const statusMap = {};
    getUserStatuses(user, (data1, err1) => {
      // noice
      Friendship
        .query(user)
        .loadAll()
        .exec((err, data) => {
          // Error finding friendships
          if (err || !data) {
            callback(null, "There was an error finding friendships: " + err);
          } else {
            // Get all friendships, and clean data
            const friendships = data.Items.map(item => (item.attrs));

            // For each friendship, find other friend
            async.each(friendships, (friendship, keysCallback) => {
              // Find the user who wrote the comment
              const user2 = friendship.user2;


              // Find all of user2's statuses
            }, (asyncErr) => {
              if (asyncErr) {
                // If there is an error with the async operation
                callback(null, asyncErr);
              } else {
                // Sort the friendships in alphabetical order of name
                friendships.sort((a, b) => (
                  (a && a.name) ? (a.name.localeCompare(b.name)) : (-1)
                ));

                // Return the comments to the user
                callback(friendships, err);
              }
            });
          }
        });
      });
  }
}

// Create an object to store the helper functions
const statuses = {
  createStatus,
  getStatuses,
  getStatus,
  getUserStatuses,
  getNewsfeedStatuses,
};

// Export the object
module.exports = statuses;
