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
 * Interest and affiliation helper
 */
function affiliationInterestHelper(err, data, callback) {
  if (err) {
    // If there is an issue with loading all affiliations
    callback(null, err.message);
  } else {
    // Create a hashmap from affilaitions to arrays of users with that
    // affiliation
    const affiliationGroups = {};
    data.Items.map(item => {
      const existing = affiliationGroups[item.attrs.affiliation];
      if (!existing) {
        affiliationGroups[item.attrs.affiliation] = [item.attrs.username];
      } else {
        affiliationGroups[item.attrs.affiliation].push(item.attrs.username);
      }
    });

    // Get the list of affiliations
    const affiliations = Object.keys(affiliationGroups);

    // Construct a map to keep track of all unique (user, user) pairs
    const userMap = {};
    affiliations.map(affiliation => {
      // Get the list of users with the given affiliation
      const users = affiliationGroups[affiliation];
      if (users.length > 1) {
        users.map(user1 => {
          users.map(user2 => {
            // Index alphabetically by username
            if (user1 !== user2) {
              if (user1 < user2) {
                userMap[user1 + "\t" + user2] = true;
              } else {
                userMap[user2 + "\t" + user1] = true;
              }
            }
          });
        });
      }
    });

    // Reduce all of the pairs into one string
    const string = Object.keys(userMap).reduce(format, "");
    callback(string, null);
  }
}

/**
 * Function to get all affiliation pairs
 */
function getAffiliations(callback) {
  // Load all affiliations
  Affiliation.scan().loadAll().exec((err, data) => {
    affiliationInterestHelper(err, data, callback);
  });
}

/**
 * Function to get all interests pairs
 */
function getInterests(callback) {
  // Load all interests
  Interest.scan().loadAll().exec((err, data) => {
    affiliationInterestHelper(err, data, callback);
  });
}

/**
 * Aggregeate the mapreduce data
 */
function aggregate(callback) {
  // Retrive the friend data
  getFriends((friendData, friendErr) => {
    if (friendErr) {
      // If there was an error with the friend data
      callback(null, friendErr);
    } else {
      // Retrieve the affiliation data
      getAffiliations((affiliationData, affiliationErr) => {
        if (affiliationErr) {
          // If there was an error with the affiliation data
          callback(null, affiliationErr);
        } else {
          // Retrieve all interests data
          getInterests((interestData, interestErr) => {
            if (interestErr) {
              // If there was an error with the interest data
              callback(null, interestErr);
            } else {
              // Aggregate all of the found data into one string
              const aggregatedData = friendData + affiliationData + interestData;
              callback(aggregatedData, null);
            }
          });
        }
      });
    }
  });
}

// Create an object to store the helper functions
const mapreduce = {
  getData: aggregate,
};

// Export the object
module.exports = mapreduce;
