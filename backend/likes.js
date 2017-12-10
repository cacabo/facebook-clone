// Import the likes table
const { Like, Status } = require('./schema.js');
const uuid = require('uuid-v4');

/**
 * Check if the user has already liked the status
 * TODO: confused how to check between like is non existent or there was an error checking database
 */
function checkLike(liker, statusUser, statusID, callback) {
  // Check if either liker or status is null
  if (!liker || !statusID) {
    callback(null, "Either the liker or status is null.");
  } else {
    // Query for like. If like exists, return data, if not return null;
    Like
      .query(statusID)
      .where('liker').equals(liker)
      .exec((err, data) => {
        if(err || !data) {
          // Error handling
          callback(null, "There was an error, or like has not happened: " + err.message);
        } else if (data.Items.length !== 0) {
          // A like exists and we must delete
          callback(data, null);
        } else {
          // Here we must add like
          callback(null, "Like does not exist.");
        }
      });
  }
}

/**
 * Adds a Like object to the likesTable and updates the likeCount in the status
 */
function addLike(liker, statusUser, statusID, callback) {
  // Error checking
  if (!liker || !statusUser || !statusID) {
    callback(null, "Liker, status, and statusID must be populated.");
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

          // Create the like object to be put in the database
          const likeObject = {
            statusID: statusID,
            id: uuid(),
            liker: liker,
          };

          // Put Like object in database
          Like.create(likeObject, (errLike, dataLike) =>  {
            if (errLike || !dataLike) {
              callback(null, "There was an error adding like to the table: " + errLike.message);
            } else {
              // Increase likesCount by 1
              statusObject.likesCount = parseInt(statusObject.likesCount, 10) + 1;

              // Update likes count of status in table
              Status.update(statusObject, (updateErr, updateData) => {
                if (updateErr || !updateData) {
                  callback(null, "There was an error updating likes count.");
                } else{
                  callback(updateData, null);
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
  if (!liker || !statusUser || !statusID) {
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

        // Find like object and delete it from the likes database
        Like
          .query(statusID)
          .where('liker').equals(liker)
          .exec((likeErr, likeData) => {
            // Like is not found or there is an error
            if (likeErr || !likeData) {
              if (likeErr) {
                callback(null, "There was an error finding the like: " + likeErr);
              } else {
                callback(null, "Like does not exist");
              }
            } else {
              // Like object for the status by the current liker
              const likeObject = likeData.Items[0].attrs;
              
              // Destroy the object in the database
              Like.destroy(likeObject.statusID, likeObject.liker, (deleteErr) => {
                if (deleteErr) {
                  callback(null, "Error trying to delete like: " + deleteErr.message);
                } else {
                  // Old status object
                  const oldStatus = statusObject;

                  // Decrement status's likeCount
                  statusObject.likesCount = parseInt(oldStatus.likesCount, 10) - 1;

                  // Update the status object to reflect the new likes count
                  Status.update(oldStatus, (updateErr, updateData) => {
                    if (updateErr || !updateData) {
                      callback(null, "There was an error updating likes count.");
                    } else{
                      callback(updateData, null);
                    }
                  });
                }
              });
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
