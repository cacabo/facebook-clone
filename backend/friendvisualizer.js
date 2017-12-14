const { User, Affiliation, Interest, Status } = require('./schema.js');
const async = require('async');
const uuid = require('uuid');
const users = require('./users');
const friendships = require('./friendships');

function getVisualizer(user, callback) {
  // Current user node
  const userObj = user;

  // Get all friendships
  friendships.getFriendships(user, (dataFriends, errFriends) => {
    const allFriends = dataFriends.map(item => {
      const friend = item.userData;
      return friend;
    });
    console.log(allFriends);
    callback(allFriends, null);
  });
}

// Create an object to store the helper functions
const friendvisualizer = {
  getVisualizer,
};

// Export the object
module.exports = friendvisualizer;
