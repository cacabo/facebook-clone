// Import the user table
const { User } = require('./schema.js');

/**
 * Get a user with the specified username
 */
function getUser(username, callback) {
  // Ensure the username is properly formatted
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined.");
  }

  // Find the user in the database
  User.get(username, (err, data) => {
    if (err || !data) {
      // If there was an issue getting the data
      callback(null, "User with username \"" + username + "\" not found.");
    } else {
      // Return the value without error
      callback(data.attrs, null);
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
      User.get(user.username, (userNotFound, userData) => {
        if (userNotFound || !userData) {
          // Remove the confirm password
          delete user.confirmPassword;

          // Update the name
          user.name = user.firstName + " " + user.lastName;
          delete user.firstName;
          delete user.lastName;

          // Add the user to the database
          User.create(user, (err, data) => {
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
 * Update a user based on the passed in information
 * TODO error checking
 */
function updateUser(updatedUser, callback) {
  // Find the username from the updated user object
  const username = updatedUser.username;

  // Find the user in the database
  User.get(username, (err, oldUserData) => {
    if (err || !oldUserData) {
      callback(null, "User not found");
    } else {
      // Isolate the old user object
      const oldUser = oldUserData.attrs;

      // Update the user's fields
      oldUser.name = updatedUser.name;
      oldUser.affiliation = updatedUser.affiliation;
      oldUser.bio = updatedUser.bio;
      oldUser.interests = updatedUser.interests;
      oldUser.profilePicture = updatedUser.profilePicture;
      oldUser.coverPhoto = updatedUser.coverPhoto;
      oldUser.updatedAt = Date.now();

      // Put the updated user into the database
      User.update(oldUser, (updateErr, updatedData) => {
        if (updateErr || !updatedData) {
          callback(null, "Failed to update user");
        } else {
          callback(updatedData, null);
        }
      });
    }
  });
}

// Create an object to store the helper functions
const users = {
  getUser,
  createUser,
  updateUser,
};

// Export the object
module.exports = users;
