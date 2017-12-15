<<<<<<< HEAD
const { User, Affiliation, Interest, Status, Friendship } = require('./schema.js');
=======
const { User } = require('./schema.js');
>>>>>>> dc3b7d3d883af65096f542f550880a9177ab7af8
const async = require('async');
const friendships = require('./friendships');

function getVisualizer(user, callback) {
<<<<<<< HEAD
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
=======
  // Error checking
  if (!user) {
    callback(null, "User must be logged in.");
  } else {
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
          if (errFriends || !dataFriends) {
            callback(null, "There was an error finding friends.");
          } else {
            const allFriends = dataFriends.map(item => {
              const friend = item.userData;

              // Format the object
              const friendObj = {
                name: friend.name,
                id: friend.username,
                data: {
                  affiliation: friend.affiliation,
                  birthday: friend.birthday,
                  bio: friend.bio,
                },
              };

              // Get rid of unnecessary data
              return friendObj;
            });

            // Go through all friends, and get friends of friends that have same affiliation as original user
            async.forEach(allFriends, (friend, keysCallback) => {
              friendships.getFriendships(friend.id, (dataSecondFriends, errSecondFriends) => {
                if (errSecondFriends || !dataSecondFriends) {
                  callback(null, "There was an error finding friends of friends");
                } else {
                  // List of friends of friend
                  const allSecondFriends = dataSecondFriends.map(item => {
                    const secondfriend = item.userData;

                    const friendObj = {
                      name: secondfriend.name,
                      id: secondfriend.username,
                      data: {
                        affiliation: secondfriend.affiliation,
                        birthday: secondfriend.birthday,
                        bio: secondfriend.bio,
                        profilePicture: secondfriend.profilePicture,
                      },
                    };

                    // Return the formatted friend object
                    return friendObj;
                  });

                  const affiliatedFriends = [];
                  allSecondFriends.forEach( (secondfriend) => {
                    if (secondfriend.data.affiliation === userObj.affiliation &&
                        secondfriend.id !== userObj.username) {
                      affiliatedFriends.push(secondfriend);
                    }
                  });
                  friend.children = affiliatedFriends;
                  keysCallback();
                }
              });
            }, (asyncErr) => {
              if (asyncErr) {
                callback(null, "There was an error with async.");
              } else {
                // Format the user data
                const data = {
                  id: userObj.username,
                  name: userObj.name,
                  children: allFriends,
                  data: {
                    affiliation: userObj.affiliation,
                    birthday: userObj.birthday,
                    bio: userObj.bio,
                    profilePicture: userObj.profilePicture,
                  }
                };

                // Return it to the user
                callback(data, null);
              }
            });
          }
        });
      }
    });
  }
>>>>>>> dc3b7d3d883af65096f542f550880a9177ab7af8
}

// Create an object to store the helper functions
const friendvisualizer = {
  getVisualizer,
};

// Export the object
module.exports = friendvisualizer;
