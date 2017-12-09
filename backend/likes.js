// Import the likes table
const { Like, Status } = require('./schema.js');
const uuid = require('uuid-v4');

/**
 * Check if the user has already liked the status
 * TODO
 */
function checkLike(liker, statusUser, statusID, callback) {

}

/**
 * Adds a Like object to the likesTable and updates the likeCount in the status
 */
function addLike(liker, statusUser, statusID, callback) {
  if (!liker || !status) {
    callback(null, "Either the liker or status is null.");
  } else {
    // Check that the status exists, query using statusID
    Status
    .query(statusUser)
    .where('id').equals(statusID)
    .exec((err, data) => {
      // Status is not found or there is an error
      if (err || !data) {
        if (err) {
          callback(null, "There was an error looking up status: " + err);
        } else {
          callback(null, "Status does not exist.");
        }
      } else {
        // Status object that is being liked
        const statusObject = data.Items[0].attrs;

        // Create like object
        const likeObject = {
          status: statusID,
          id: uuid(),
          liker: liker,
        };

        // Put Like object in table
        Like.create(likeObject, (errLike, dataLike) =>  {
          if(errLike || !dataLike) {
            callback(null, "There was an error adding like to the table.");
          } else {
            // Old Status Object
            const oldStatus = statusObject;

            // Increase likesCount by 1
            oldStatus.likesCount = parseInt(oldStatus.likesCount, 10) + 1;

            // Update likes count of status in table
            Status.update(oldStatus, (updateErr, updateData) => {
              if(updateErr || !updateData) {
                callback(null, "There was an error updating likes count.");
              } else{
                callback({success: true}, null);
              }
            });
          }
        });
      }
    });
  }
}

/**
 * Deletes Like object from the likesTable and updates likeCount in the status
 */
function deleteLike(liker, statusUser, statusID, callback) {
  if (!liker || !status) {
    callback(null, "Either the liker or status is null.");
  } else {
    Status
    .query(statusUser)
    .where('id').equals(statusID)
    .exec((err, data) => {
      // Status is not found or there is an error
      if (err || !data) {
        if (err) {
          callback(null, "There was an error looking up status: " + err);
        } else {
          callback(null, "Status does not exist.");
        }
      } else {
        // Status object that is being disliked
        const statusObject = data.Items[0].attrs;

        // Find like object and delete like
        Like
        .query(statusID)
        .where('liker').equals(liker)
        .exec((likeErr, likeData) => {
          // Like is not found or there is an error
          if (likeErr || !likeData) {
            if (likeErr) {
              callback(null, "There was an error finding the like: " + err);
            } else {
              callback(null, "Like does not exist");
            }
          } else {
            // Like object for the status by the current liker
            const likeObject = likeData.Items[0].attrs;
            console.log(likeObject);
          }
        });
      }
    });
  }
}

// Create an object to store the helper functions
const likes = {
  addLike,
  checkLike,
  deleteLike,
};

// Export the object
module.exports = likes;
