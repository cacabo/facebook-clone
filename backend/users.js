// Import the user table
const { User, Affiliation, Interest, Status } = require('./schema.js');
const async = require('async');
const uuid = require('uuid');

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
      !user.birthday ||
      !user.password ||
      !user.confirmPassword) {
    callback(null, "All fields must be populated");
  } else {
    // Ensure the username is properly formatted: no whitespace and only
    // letters, numbers, periods, or underscores
    const usernameRegex = /^[a-z0-9.\-_]+$/;
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
          user.name = (user.firstName + " " + user.lastName).toLowerCase();
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
 * Helper function to handle a change in affiliation
 */
function changeAffiliation(oldAffiliation, user, callback) {
  if (oldAffiliation === user.affiliation) {
    callback(true, null);
  } else {
    // Remove the old affiliation from the database if there is one
    if (oldAffiliation) {
      // Destroy the existing affiliation from the database
      Affiliation.destroy(oldAffiliation, user.username, (destroyErr) => {
        if (destroyErr) {
          callback(false, destroyErr.message);
        } else {
          if (user.affiliation) {
            // Add the updated affiliation
            Affiliation.create({
              affiliation: user.affiliation,
              username: user.username,
            }, (affiliationErr, affiliationData) => {
              // If there was an issue adding the affiliation to the database
              if (affiliationErr || !affiliationData) {
                callback(false, affiliationErr.message);
              } else {
                callback(true, null);
              }
            });
          } else {
            callback(true, null);
          }
        }
      });
    } else if (user.affiliation) {
      // Add the updated affiliation
      Affiliation.create({
        affiliation: user.affiliation,
        username: user.username,
      }, (affiliationErr, affiliationData) => {
        // If there was an issue adding the affiliation to the database
        if (affiliationErr || !affiliationData) {
          callback(false, affiliationErr.message);
        } else {
          callback(true, null);
        }
      });
    } else {
      callback(true, null);
    }
  }
}

/**
 * Helper function to handle a change in interests
 */
function changeInterests(oldInterests, user, callback) {
  if (oldInterests === user.interests) {
    // If there are no changes, then there are no updates in the DB to make
    callback(true, null);
  } else {
    // Parse the old interests
    const oldInterestsStrings = oldInterests.split(', ');

    // Created a formatted array of interests to be removed from the DB
    const oldInterestsArr = oldInterestsStrings.map(interest => ({
      interest: interest,
      username: user.username,
    }));

    // Destroy the old interests from the database
    async.each(oldInterestsArr, (interest, keysCallback) => {
      Interest.destroy(interest, (destroyErr) => {
        if (destroyErr) {
          callback(false, destroyErr.message);
          return;
        }
        keysCallback();
      });
    }, asyncErr => {
      if (asyncErr) {
        callback(false, asyncErr);
      } else {
        // Find the new interests
        const newInterestsStrings = user.interests.split(', ');

        // Created a formatted array of interests to be added to the DB
        const interestsArr = newInterestsStrings.map(interest => ({
          interest: interest,
          username: user.username,
        }));

        // Put the interests in the DB
        Interest.create(interestsArr, (err, interests) => {
          if (err || !interests) {
            callback(false, "Failed to add interests to database.");
          } else {
            callback(true, interests);
          }
        });
      }
    });
  }
}

/**
 * Update a user based on the passed in information
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

      // Also save the old information
      const oldAffiliation = oldUser.affiliation;
      const oldInterests = oldUser.interests;
      const oldProfilePicture = oldUser.profilePicture;
      const oldCoverPhoto = oldUser.coverPhoto;
      const oldBio = oldUser.bio;

      // Update the user's fields
      oldUser.name = updatedUser.name.toLowerCase();
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
          // Handle changing affiliations in the database
          changeAffiliation(oldAffiliation, oldUser, (affiliationSuccess, affiliationErr) => {
            if (!affiliationSuccess) {
              callback(null, affiliationErr);
            } else {
              // Handle changing interests in the database
              changeInterests(oldInterests, oldUser, (interestsSuccess, interestsErr) => {
                if (!interestsSuccess) {
                  // If there was an error adding the interests to the array
                  callback(null, interestsErr);
                } else {
                  // Object for statuses to be added
                  const statuses = [];

                  // Compare changes in profile picture
                  if (oldUser.profilePicture !== oldProfilePicture && oldUser.profilePicture) {
                    const status = {
                      id: uuid(),
                      image: oldUser.profilePicture,
                      content: "",
                      user: oldUser.username,
                      receiver: null,
                      likesCount: 0,
                      commentsCount: 0,
                      type: "UPDATE_PROFILE_PICTURE",
                    };
                    statuses.push(status);
                  }

                  // Compare changes in cover photo
                  if (oldUser.coverPhoto !== oldCoverPhoto && oldUser.coverPhoto) {
                    const status = {
                      id: uuid(),
                      image: oldUser.coverPhoto,
                      content: "",
                      user: oldUser.username,
                      receiver: null,
                      likesCount: 0,
                      commentsCount: 0,
                      type: "UPDATE_COVER_PHOTO",
                    };
                    statuses.push(status);
                  }

                  // Compare changes in bio
                  if (oldUser.bio !== oldBio) {
                    const status = {
                      id: uuid(),
                      image: "",
                      content: oldUser.bio,
                      user: oldUser.username,
                      receiver: null,
                      likesCount: 0,
                      commentsCount: 0,
                      type: "UPDATE_BIO",
                    };
                    statuses.push(status);
                  }

                  // Create the statuses in the database
                  Status.create(statuses, (statusErr, statusData) => {
                    if (statusErr || !statusData) {
                      callback(null, "Failed to post related statuses.");
                    } else {
                      // If everything went as planned
                      callback(updatedData, null);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

/**
 * Get all users with the passed in affiliation
 */
function affiliationUsers(affiliation, callback) {
  // Error checking on the prefix
  if (!affiliation) {
    callback(null, "Affiliation must be defined.");
  }

  // Query for the users we want by name
  Affiliation
    .query(affiliation)
    .loadAll()
    .exec((err, data) => {
      if (err) {
        callback(null, err.message);
      } else {
        // Glean the usernames of all users from the database
        const usernames = data.Items.map(user => (user.attrs.username));

        // Maintain an array for users
        const users = [];

        // Load the user data for each user
        async.each(usernames, (username, keysCallback) => {
          User.get(username, (userErr, userData) => {
            if (userErr || !userData) {
              callback(null, userErr);
            } else {
              // Create a user object with the relevant info
              const user = {
                username: userData.attrs.username,
                name: userData.attrs.name,
                profilePicture: userData.attrs.profilePicture,
              };

              // Put the object into the array
              users.push(user);
              keysCallback();
            }
          });
        }, asyncErr => {
          if (asyncErr) {
            callback(null, asyncErr);
          } else {
            callback(users, null);
          }
        });
      }
    });
}

/**
 * Search for users by a prefix
 */
function searchUsers(prefix, callback) {
  // Error checking on the prefix
  if (!prefix) {
    callback(null, "Prefix must be defined.");
  }

  // Query for the users we want by name
  User
    .scan()
    .where('name').beginsWith(prefix.toLowerCase())
    .attributes(['name', 'username', 'profilePicture'])
    .exec((err, data) => {
      if (err) {
        callback(null, err.message);
      } else {
        callback(data.Items, null);
      }
    });
}

// Create an object to store the helper functions
const users = {
  getUser,
  createUser,
  updateUser,
  searchUsers,
  affiliationUsers,
};

// Export the object
module.exports = users;
