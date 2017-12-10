// Import the comments table
const { Comment, Status } = require('./schema.js');
const uuid = require('uuid-v4');

/**
 * Adds a Comment object to the commentsTable and updates the commentCount in the status
 */
function addComment(commenter, comment, statusUser, statusID, callback) {
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

        // Create comment object
        const commentObject = {
          statusID: statusID,
          id: uuid(),
          commenter: commenter,
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

/**
 * Gets all comments of a user
 */
function getComments(statusID, callback) {
  // get comments
  Comment
    .query(statusID)
    .loadAll()
    .exec((err, data) => {
      // Comments not found or there is an error
      if(err || !data) {
        callback(null, "There was an error finding comments: " + err);
      } else {
        const comments = data.Items.map(item => ( item.attrs ));
        console.log(comments);
      }
    });
}
// Create an object to store the helper functions
const comments = {
  addComment,
  getComments,
};

// Export the object
module.exports = comments;
