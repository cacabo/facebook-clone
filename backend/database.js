// Import the keyvaluestore
var keyvaluestore = require('./keyvaluestore.js');

// Create the usersTable
var users = new keyvaluestore('usersTable');
users.init(function(err, data){});

// Get a user with the specified username
var get_user = function(username, callback) {
  users.get(username, function(err, data) {
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

// Create the database object to export
const database = {
  getUser: get_user,
};

module.exports = database;
