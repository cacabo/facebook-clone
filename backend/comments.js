// Import the comments table
const { Comment, Status, User } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');

/**
 * Adds a Comment object to the commentsTable and updates the commentCount in the status
 */
function addComment(commenter, comment, statusUser, statusID, callback) {
  // Check that none of required fields are null
  if (!commenter) {
    callback(null, "Commenter is invalid.");
  } else if (!comment) {
    callback(null, "Comment is invalid.");
  } else if (!statusUser) {
    callback(null, "StatusUser is invalid.");
  } else if (!statusID) {
    callback(null, "StatusID is invalid.");
  } else {
    // Query statuses to find the specfic status that is being commented on
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
          // If no status was found
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

          // Put comment object in table
          Comment.create(commentObject, (errComment, dataComment) =>  {
            if (errComment || !dataComment) {
              callback(null, "There was an error adding comment to the table: " + errComment.message);
            } else {
              // Old status object
              const oldStatus = statusObject;

              // Increase commentsCount by 1
              oldStatus.commentsCount = parseInt(oldStatus.commentsCount, 10) + 1;

              // Update comments count of status in table
              Status.update(oldStatus, (updateErr, updateData) => {
                if (updateErr || !updateData) {
                  callback(null, "There was an error updating comments count.");
                } else {
                  callback({success: true, data: dataComment}, null);
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
  if (!statusID) {
    callback(null, "StatusID is null.");
  } else {
    // Get comments associated with the status ID
    Comment
      .query(statusID)
      .loadAll()
      .exec((err, data) => {
        // Comments not found or there is an error
        if(err || !data) {
          callback(null, "There was an error finding comments: " + err);
        } else {
          // Get all comments, and clean data
          const comments = data.Items.map(item => (item.attrs));

          // For each comment, find user who wrote it
          async.each(comments, (comment, keysCallback) => {
            // Find the user who wrote the comment
            const user = comment.commenter;

            // Find the user's information in the database
            User.get(user, (userErr, userData) => {
              // Error finding user
              if (userErr || !userData) {
                callback(null, userErr);
              } else {
                // Find the user object
                const userObj = userData.attrs;

                // Delete unneeded info from the object
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
              callback(null, asyncErr);
            } else {
              // Sort the comments from earliest to latest
              comments.sort((a, b) => {
                const aCreatedAt = new Date(a.createdAt);
                const bCreatedAt = new Date(b.createdAt);
                return aCreatedAt - bCreatedAt;
              });

              // Return the comments to the user
              callback(comments, err);
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
