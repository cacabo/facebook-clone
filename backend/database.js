// Import the keyvaluestore
var keyvaluestore = require('./keyvaluestore.js');

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

// Create the database object to export
const database = {
  createUser: createUser,
  getUser: getUser,
};

module.exports = database;
