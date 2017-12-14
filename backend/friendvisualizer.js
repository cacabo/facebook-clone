const { User, Affiliation, Interest, Status, Friendship } = require('./schema.js');
const async = require('async');
const uuid = require('uuid');
const users = require('./users');
const friendships = require('./friendships');

function getVisualizer(user, callback) {
  // Get the current user
  User.get(user, (userNotFound, userData) => {
    if (userNotFound || !userData) {
      callback(null, "User does not exist.");
    } else {
      // Object of current user (node)
      const userObj = userData.attrs;

      // Get rid of unnecessary data
      delete userObj.password;
      delete userObj.createdAt;
      delete userObj.updatedAt;

      // Get all friendships
      friendships.getFriendships(user, (dataFriends, errFriends) => {
        // Clean data to only have list of friend objects
        if(errFriends || !dataFriends) {
          callback(null, "There was an error finding friends.");
        } else {
          const allFriends = dataFriends.map(item => {
            const friend = item.userData;
            // Get rid of unnecessary data
            delete friend.password;
            delete friend.createdAt;
            delete friend.updatedAt;
            return friend;
          });

          // Go through all friends, and get friends of friends that have same affiliation as original user
          async.forEach(allFriends, (friend, keysCallback) => {
            friendships.getFriendships(friend.username, (dataSecondFriends, errSecondFriends) => {
              if(errSecondFriends || !dataSecondFriends) {
                callback(null, "There was an error finding friends of friends");
              } else {
                // List of friends of friend
                const allSecondFriends = dataSecondFriends.map(item => {
                  const secondfriend = item.userData;

                  delete secondfriend.password;
                  delete secondfriend.createdAt;
                  delete secondfriend.updatedAt;
                  secondfriend.friends = [];
                  return secondfriend;
                });

                const affiliatedFriends = [];
                allSecondFriends.forEach( (secondfriend) => {
                  if (secondfriend.affiliation === userObj.affiliation
                  && secondfriend.username !== userObj.username) {
                    affiliatedFriends.push(secondfriend);
                  }
                });
                friend.friends = affiliatedFriends;
                keysCallback();
              }
            });
          }, (asyncErr) => {
            if(asyncErr) {
              callback(null, "There was an error with async.");
            } else {
              userObj.friends = allFriends;
              callback(userObj, null);
            }
          });
        }
      });
    }
  });
}

// Create an object to store the helper functions
const friendvisualizer = {
  getVisualizer,
};

// Export the object
module.exports = friendvisualizer;
