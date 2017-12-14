// Import the comments table
const { Friendship, Affiliation, Interest } = require('./schema.js');

/**
 * Reducer helper function
 */
function format(acc, item) {
  return acc + item + "\n";
}

/**
 * Function to get all user pairs from friendships
 */
function getFriends(callback) {
  Friendship.scan().loadAll().exec((err, data) => {
    if (err) {
      callback(null, err.message);
    } else {
      // Construct a map to remove duplicates in the data
      const friendMap = {};
      data.Items.map(item => {
        // Isolate the two friends from the object
        const friend1 = item.attrs.user1;
        const friend2 = item.attrs.user2;

        // Place them in the object in alphabetical order
        if (friend1 < friend2) {
          friendMap[friend1 + "\t" + friend2] = true;
        } else {
          friendMap[friend2 + "\t" + friend1] = true;
        }
      });

      // Format the data for mapreduce in a string
      const string = Object.keys(friendMap).reduce(format, "");
      callback(string, null);
    }
  });
}

/**
 * Function to get all affiliation pairs
 */
function getAffiliations(callback) {
  Affiliation.scan().loadAll().exec((err, data) => {
    if (err) {
      callback(null, err.message);
    } else {
      const affiliationGroups = {};
      data.Items.map(item => {
        const existing = affiliationGroups[item.attrs.affiliation];
        if (!existing) {
          affiliationGroups[item.attrs.affiliation] = [item.attrs.username];
        } else {
          affiliationGroups[item.attrs.affiliation].push(item.attrs.username);
        }
      });
      const affiliations = Object.keys(affiliationGroups);
      const userMap = {};
      affiliations.map(affiliation => {
        const users = affiliationGroups[affiliation];
        if (users.length > 1) {
          users.map(user1 => {
            users.map(user2 => {
              if (user1 !== user2) {
                if (user1 < user2) {
                  userMap[user1 + "," + user2] = true;
                } else {
                  userMap[user2 + "," + user1] = true;
                }
              }
            });
          });
        }
      });
      callback(userMap, null);
    }
  });
}

// Create an object to store the helper functions
const mapreduce = {
  getData: getAffiliations,
};

// Export the object
module.exports = mapreduce;
