// Import the friends table
const { User, Friendship } = require('./schema.js');
const uuid = require('uuid-v4');

/**
 * Create a friendship. friend1 is adding, and friend2 is being added
 * TODO After fixing error with range query, we need to create friendships
 *      and add them to the friendshipsTable
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
            "id": uuid(),
            "user1": friend1,
            "user2": friend2,
          };

          // Friendship for user that is being added
          const friendship2Object = {
            "id": uuid(),
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
                  callback({ success: true }, null);
                }
              });
            }
          });
        }
      });
  }
}

// Create an object to store the helper functions
const friendships = {
  addFriendship,
};

// Export the object
module.exports = friendships;
