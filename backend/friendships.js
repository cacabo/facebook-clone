// Import the friends table
const { User, Friendship } = require('./schema.js');
const async = require('async');

/**
 * Create a friendship. friend1 is adding, and friend2 is being added
 */
function addFriendship(friend1, friend2, callback) {
  // Check if any of friends are null
  if (!friend1 || !friend2) {
    callback(null, "One of the friends are null.");
  } else {
    // Check if friend2 doesn't exist
    User.get(friend2, (err, data) => {
      if(err) {
        callback(null, "There was an error looking for friend:" + err);
      } else if(!data) {
        callback(null, "The friend you want to add does not exist.");
      }
    });

    // Check if the friendship already exists
    Friendship
      .query(friend1)
      .where('user2').equals(friend2)
      .exec((err, data) => {
        if (err) {
          // Check for errors in getting prefix set
          callback(null, "Error looking for friendship:" + err);
        } else if(data.Items.length !== 0) {
          // Friendship exists
          callback(null, "Friendship already exists.");
        } else {
          // Add Friendships to tables
          // Friendship for user that is adding
          const friendship1Object = {
            "user1": friend1,
            "user2": friend2,
          };

          // Friendship for user that is being added
          const friendship2Object = {
            "user1": friend2,
            "user2": friend1,
          };

          // Put the friendship into the database
          Friendship.create(friendship1Object, (err1, data1) => {
            if (err1 || !data1) {
              callback(null, "Failed to create first friendship: " + err1);
            } else {
              // If adding the first relation was a success
              Friendship.create(friendship2Object, (err2, data2) => {
                if (err2 || !data2) {
                  callback(null, "Failed to create second friendship: " + err2);
                } else {
                  callback({ success: true, data: data1 }, null);
                }
              });
            }
          });
        }
      });
  }
}

/**
 * Get all friendships
 */

function getFriendships(user, callback) {
  if (!user) {
    callback(null, "User is null.");
  } else {
    Friendship
      .query(user)
      .loadAll()
      .exec((err, data) => {
        // Error finding friendships
        if(err || !data) {
          callback(null, "There was an error finding friendships: " + err);
        } else {
          // Get all friendships, and clean data
          const friendships = data.Items.map(item => (item.attrs));

          // For each friendship, find other friend
          async.each(friendships, (friendship, keysCallback) => {
            // Find the user who wrote the comment
            const user2 = friendship.user2;

            // Find the user's information in the database
            User.get(user2, (userErr, userData) => {
              // Error finding user
              if (userErr || !userData) {
                callback(null, userErr);
              } else {
                // Find the user object
                const userObj = userData.attrs;

                // Delete unneeded info from the object
                delete userObj.password;
                delete userObj.affiliation;
                delete userObj.interests;
                delete userObj.bio;
                delete userObj.coverPhoto;
                delete userObj.userData;
                delete userObj.createdAt;

                // Update the friendship object
                friendship.userData = userObj;
                keysCallback();
              }
            });
          }, (asyncErr) => {
            if (asyncErr) {
              // If there is an error with the async operation
              callback(null, asyncErr);
            } else {
              // Sort the friendships in alphabetical order of name
              friendships.sort((a, b) => (
                a.name.localeCompare(b.name)
              ));

              // Return the comments to the user
              callback(friendships, err);
            }
          });
        }
      });
  }
}

// Create an object to store the helper functions
const friendships = {
  addFriendship,
  getFriendships,
};

// Export the object
module.exports = friendships;
