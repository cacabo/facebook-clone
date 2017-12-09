// Import the user table
const { Status } = require('./vogels.js');
const uuid = require('uuid-v4');

/**
 * Create a status
 * TODO find the key
 */
function createStatus(content, receiver, user, callback) {
  // Ensure inputs are valid
  if (!content) {
    callback(null, "Content must be populated");
  } else if (!user) {
    callback(null, "User must be populated");
  } else {
    const obj = {
      content,
      receiver,
      user,
      type: "STATUS",
      commentsCount: 0,
      likesCount: 0,
      id: uuid(),
    };

    // Put the status in to the database
    Status.create(obj, (err, data) => {
      if (err || !data) {
        callback(null, "Failed to put status in database.");
      } else {
        callback(data, null);
      }
    });
  }
}

/**
 * Get all statuses in the table
 * TODO sort chronologically
 */
function getStatuses(callback) {
  Status
    .scan()
    .loadAll()
    .exec((err, data) => {
      const statuses = data.Items;
      statuses.sort((a, b) => {
        const aCreatedAt = new Date(a.createdAt);
        const bCreatedAt = new Date(b.createdAt);
        return aCreatedAt - bCreatedAt;
      });
      callback(err, data.Items);
    });
}

// Create an object to store the helper functions
const statuses = {
  createStatus,
  getStatuses,
};

// Export the object
module.exports = statuses;
