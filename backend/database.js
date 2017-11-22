// Import the keyvaluestore
var keyvaluestore = require('./keyvaluestore.js');

// Create the usersTable
var users = new keyvaluestore('usersTable');
users.init(function(err, data){});
