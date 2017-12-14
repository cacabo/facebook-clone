// Import the friends table
const { FriendRecommendation, User } = require('./schema.js');
const async = require('async');

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
