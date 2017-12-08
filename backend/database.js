// Import the keyvaluestore
var keyvaluestore = require('./keyvaluestore.js');
const uuid = require('uuid-v4');

// Create the usersTable
var users = new keyvaluestore('usersTable');
users.init(() => {});

// Create the friendRelationshipTable
var friendships = new keyvaluestore('friendshipsTable');
friendships.init(() => {});

// Create the status table
var statuses = new keyvaluestore('statusTable');
statuses.init(() => {});

// Create comments table
var comments = new keyvaluestore('commentsTable');
comments.init(() => {});

// Create chats table
var chats = new keyvaluestore('chatsTable');
chats.init(() => {});

// Create userChatRelationship table
var userChats = new keyvaluestore('userChatsTable');
userChats.init(() => {});

// Create messages table
var messages = new keyvaluestore('messagesTable');
messages.init(() => {});

// Get a user with the specified username
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

// Create a new user
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

// Create friendship
function createFriendship(friend1, friend2, callback) {
  console.log("reached1");
  // Check if any of friends are null
  if (!friend1 || !friend2) {
    console.log("reached2");
    callback(null, "One of the friends are null.");
  } else {
    console.log("reached");
    // Check if friend2 doesn't exist
    users.get(friend2, (err, data) => {
      if(err) {
        callback(null, "There was an error looking for friend:" + err);
      } else if(!data) {
        callback(null, "The friend you want to add does not exist.");
      }
    });

    console.log(friend2);

    // Check if the friendship already exists
    friendships.getPrefix(friend1, (err, data) => {
      console.log("get prefix reached");
      if (err) {
        console.log(err);
        console.log("error in prefix search reached");
        callback(null, "Error looking for friendship:" + err);
      } else if(data) {
        console.log("reached data exists");
        // Go through data and see if it is friendship between 1 and 2
        for(var i in data) {
          if(i) {
            console.log(i);
          }
        }
        callback(null, "The friendship already exists.");
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

// Create the database object to export
const database = {
  createUser: createUser,
  getUser: getUser,
  createFriendship: createFriendship,
};

module.exports = database;
