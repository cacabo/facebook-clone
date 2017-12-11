// Import the comments table
const { Comment, Status, User } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');

/**
 * Adds a Comment object to the commentsTable and updates the commentCount in the status
 */
function addComment(commenter, comment, statusUser, statusID, callback) {
  // Check that none of required fields are null
  if (!commenter || !comment || !statusUser || !statusID) {
    callback(null, "Either commenter, comment, statusUser, or statusID is invalid.");
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
        } else if (data.Items.length === 0) {
          callback(null, "The status does not exist.");
        } else {
          // Status object that is being liked
          const statusObject = data.Items[0].attrs;

          // Create comment object
          const commentObject = {
            statusID: statusID,
            id: uuid(),
            commenter: commenter,
            comment: comment,
          };

          // Put Comment object in table
          Comment.create(commentObject, (errComment, dataComment) =>  {
            if(errComment || !dataComment) {
              callback(null, "There was an error adding comment to the table: " + errComment.message);
            } else {
              // Old Status Object
              const oldStatus = statusObject;

              // Increase commentsCount by 1
              oldStatus.commentsCount = parseInt(oldStatus.commentsCount, 10) + 1;

              // Update comments count of status in table
              Status.update(oldStatus, (updateErr, updateData) => {
                if(updateErr || !updateData) {
                  callback(null, "There was an error updating comments count.");
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
 * Gets all comments of a user
 */
function getComments(statusID, callback) {
  if(!statusID) {
    callback(null, "StatusID is null.");
  } else {
    // Get comments
    Comment
      .query(statusID)
      .loadAll()
      .exec((err, data) => {
        // Comments not found or there is an error
        if(err || !data) {
          callback(null, "There was an error finding comments: " + err);
        } else {
          // Get all comments, and clean data
          const comments = data.Items.map(item => ( item.attrs ));

          // For each comment, find user who wrote it
          async.each(comments, (comment, keysCallback) => {
            User.get(comment.commenter, (userErr, userData) => {
              // Error finding user
              if (userErr || !userData) {
                callback(userErr, null);
              } else {
                // Find the user object
                const userObj = userData.attrs;

                // Delete unneeded info
                delete userObj.password;
                delete userObj.affiliation;
                delete userObj.interests;
                delete userObj.bio;
                delete userObj.coverPhoto;
                delete userObj.userData;
                delete userObj.createdAt;

                // Update the comment object
                comment.userData = userObj;
                keysCallback();
              }
            });
          }, (asyncErr) => {
            if (asyncErr) {
              // If there is an error with the async operation
              callback(asyncErr, null);
            } else {
              // Sort the comments
              comments.sort((a, b) => {
                const aCreatedAt = new Date(a.createdAt);
                const bCreatedAt = new Date(b.createdAt);
                return aCreatedAt - bCreatedAt;
              });

              // Return the comments to the user
              callback(err, comments);
            }
          });
        }
      });
  }
}
// Create an object to store the helper functions
const comments = {
  addComment,
  getComments,
};

// Export the object
module.exports = comments;
