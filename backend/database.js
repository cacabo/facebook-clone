// Import the keyvaluestore
const keyvaluestore = require('./keyvaluestore.js');
const uuid = require('uuid-v4');

// Create the usersTable
const users = new keyvaluestore('usersTable');
users.init(() => {});

// Create the friendRelationshipTable
const friendships = new keyvaluestore('friendshipsTable');
friendships.init(() => {});

// Create the status table
const statuses = new keyvaluestore('statusTable');
statuses.init(() => {});

// Create comments table
const comments = new keyvaluestore('commentsTable');
comments.init(() => {});

// Create chats table
const chats = new keyvaluestore('chatsTable');
chats.init(() => {});

// Create userChatRelationship table
const userChats = new keyvaluestore('userChatsTable');
userChats.init(() => {});

// Create messages table
const messages = new keyvaluestore('messagesTable');
messages.init(() => {});

// Create likes table
const likes = new keyvaluestore('likesTable');
likes.init(() => {});


/**
 * Get a user with the specified username
 */
function getUser(username, callback) {
  users.get(username, (err, data) => {
    if (err || !data) {
      // If there was an issue getting the data
      callback(null, "User not found: " + err);
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


/**
 * Create a friendship. friend1 is adding, and friend2 is being added
 * TODO After fixing error with range query, we need to create friendships
 *      and add them to the friendshipsTable
 */
function createFriendship(friend1, friend2, callback) {
  // Check if any of friends are null
  if (!friend1 || !friend2) {
    callback(null, "One of the friends are null.");
  } else {
    // Check if friend2 doesn't exist
    users.get(friend2, (err, data) => {
      if(err) {
        callback(null, "There was an error looking for friend:" + err);
      } else if(!data) {
        callback(null, "The friend you want to add does not exist.");
      }
    });

    // Check if the friendship already exists
    friendships.getPrefix(friend1, (err, data) => {
      // Check for errors in getting prefix set
      if (err) {
        callback(null, "Error looking for friendship:" + err);
      } else if(data) {
        console.log("reached data exists");

        // Go through data and see if it is friendship between 1 and 2
        data.forEach((friendRelationship) => {
          if (friendRelationship) {
            console.log(friendRelationship);
            if (friendRelationship.value.user2 === friend2) {
              callback(null, "The friendship already exists.");
            }
          }
        });
      }
    });

    // // Friendship for user that is adding
    // const friendship1Object = {
    //   "user1": friend1,
    //   "user2": friend2,
    //   "createdAt": Date.now(),
    // };
    //
    // // Friendship for user that is being added
    // const friendship2Object = {
    //   "user1": friend2,
    //   "user2": friend1,
    //   "createdAt": Date.now(),
    // };
    //
    // // Find the key for the friendship
    // const key1 = friend1 + ":" + uuid();
    // const key2 = friend2 + ":" + uuid();
    //
    // // Put the friendship into the database
    // friendships.put(key1, JSON.stringify(friendship1Object), (err, data) => {
    //   if (err || !data) {
    //     callback(null, "Failed to create friendship: " + err);
    //   } else {
    //     // If adding the first relation was a success
    //     friendships.put(key2, JSON.stringify(friendship2Object), (err2, data2) => {
    //       if (err2 || !data2) {
    //         callback(null, "Failed to create friendship: " + err);
    //       } else {
    //         callback({ success: true }, null);
    //       }
    //     });
    //   }
    // });
  }
}

/**
 * Adds a Like object to the likesTable and updates the likeCount in the status
 */
function addLike(liker, status, callback) {
  if (!liker || !status) {
    callback(null, "Either the liker or status is null.");
  } else {
    // Check that the status exists
    statuses.get(status, (err, data) => {
      if (err || !data) {
        if (err) {
          callback(null, "There was an error looking up status: " + err);
        } else {
          callback(null, "Status does not exist.");
        }
      } else {
        // Create like object
        const likeObject = {
          status: status,
          liker: liker,
        };

        const key = status + ":" + uuid();
        // Put like object in table
        likes.put(key, JSON.stringify(likeObject), (errLike, dataLike) =>  {
          if(errLike || !dataLike) {
            callback(null, "There was an error adding like to the table.");
          } else {
            // noice
            const oldStatus = JSON.parse(data[0].value);

            // Increase likesCount by 1
            oldStatus.likesCount = parseInt(oldStatus.likesCount, 10) + 1;

            // Update likes count of status in table
            statuses.update(status, data[0].inx, oldStatus, (err3, data3) => {
              if(err3 || !data3) {
                callback(null, "There was an error updating likes count.");
              } else{
                callback({success: true}, null);
              }
            });
          }
        });
      }
    });
  }
}

// function getMessages(user, callback) {
//   messages.get(user.username, (err, messageData) => {
//     if (err || !messageData) {

//     }
//   });
// }

// Create the database object to export
const database = {
  createUser: createUser,
  getUser: getUser,
  createFriendship: createFriendship,
  addLike: addLike
};

module.exports = database;
