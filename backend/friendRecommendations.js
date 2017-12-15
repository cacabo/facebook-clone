// Import the friends table
const { FriendRecommendation, User } = require('./schema.js');
const async = require('async');


function addRecommendation(username, newFriend, rank, callback) {
  if (!username) {
    callback(null, "Username must be populated");
  } else if (!newFriend) {
    callback(null, "New friend must be populated");
  } else if (!rank) {
    callback(null, "Rank must be populated");
  } else {
    // Create invite object
    const recommendationObject = {
     user: username,
     newFriend: newFriend,
     rank: rank,
   };

    //Put the invite in to the database
    FriendRecommendation
    .create(recommendationObject, (err, data) => {
      if (err || !data) {
        callback(null, "Failed to put invite in database.");
      } else {
        callback(data, null);
      }
    });
  }
} 

/**
 * Get recommendations for the passed in user
 */
function getRecommendations(username, callback) {
  // Query for recommendations for that user
  FriendRecommendation
    .query(username)
    .loadAll()
    .exec((err, data) => {
      if (err) {
        // If there was an error
        callback(null, err.message);
      } else {
        // Glean the list of recommendations
        const recommendations = data.Items.map(item => item.attrs);

        // Asyncronously pull user data for each
        async.each(recommendations, (rec, keysCallback) => {
          User.get(rec.newFriend, (userErr, userData) => {
            if (userErr) {
              callback(null, userErr.message);
            } else {
              const userObj = userData.attrs;
              delete userObj.password;
              delete userObj.birthday;
              delete userObj.bio;
              delete userObj.coverPhoto;
              delete userObj.interests;
              delete userObj.affiliation;
              delete userObj.updatedAt;
              delete userObj.createdAt;
              rec.userData = userObj;
              keysCallback();
            }
          });
        }, asyncErr => {
          if (asyncErr) {
            callback(null, asyncErr);
          } else {
            // Sort the recommendations by rank
            recommendations.sort((a, b) => (
              a.rank - b.rank
            ));

            // Return the recommendations to the user
            callback(recommendations, null);
          }
        });
      }
    });
}

// Create an object to store the helper functions
const friendRecommendations = {
  getRecommendations,
};

// Export the object
module.exports = friendRecommendations;
