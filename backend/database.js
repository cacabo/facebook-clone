// Import the keyvaluestore
var keyvaluestore = require('./keyvaluestore.js');

// Create the usersTable
var users = new keyvaluestore('usersTable');
users.init(function(err, data){});

// Get a user with the specified username
var get_user = function(username, callback) {
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
var create_user = function(user, callback) {
  /**
   * TODO more error checking
   */
   if (user.password !== user.confirmPassword) {
     callback(null, "Passwords must match");
   } else {
     // Remove the confirm password
     delete user.confirmPassword;

     // Put the user into the table
     const username = user.username;
     users.put(username, JSON.stringify(user), (err, data) => {
       if (err || !data) {
         callback(null, "Failed to create user: " + err);
       } else {
         console.log(data);
         callback({success: true}, null);
       }
     });
   }
}

// Create the database object to export
const database = {
  createUser: create_user,
  getUser: get_user,
};

module.exports = database;
