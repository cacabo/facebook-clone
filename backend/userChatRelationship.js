// Import the user table
const { UserChatRelationship } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');

/**
 * Create a UserChatRelationship
 */
function createUserChatRelationship(username, room, callback) {
	if (!username) {
		callback(null, "Username must be populated");
	} else if (!room) {
		callback(null, "Room must be populated");
	} else {
    // Create relsationship object
		const relObject = {
			username: username,
			title: title,
			room: room,
		};

		//Put the relationship in to the database
		UserChatRelationship.create(relObject, (err, data) => {
			if (err || !data) {
        callback(null, "Failed to put UserChatRelationship in database.");
			} else {
				callback(data, null);
			}
		});
	}
}

/**
 * Get all chats that a user is a part of
 */
function getChats(username, callback) {
  // Error checking on the username
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined");
  }

  // Query for the chats
  UserChatRelationship
    .query(username)
    .loadAll()
    .exec((err, data) => {
      if (err || !data) {
        callback(null, err);
      } else {
        // Prune out the chat data
        const chats = data.Items.map(item => {
          const chat = item.attrs;
          return chat;
        });

        // Get the recipient name
        async.each(chats, (chat, keysCallback) => {
          if (chat.receiver) {
            UserChatRelationship.get(chat.receiver, (receiverErr, receiverData) => {
              if (receiverErr || !receiverData) {
                callback(receiverErr, null);
              } else {
                keysCallback(); 
              }
            });
          } else {
            keysCallback();
          }
        }, (asyncErr) => {
          if (asyncErr) {
            callback(asyncErr, null);
          }

          // Sort the chats
          chats.sort((a, b) => {
            const aCreatedAt = new Date(a.createdAt);
            const bCreatedAt = new Date(b.createdAt);
            return bCreatedAt - aCreatedAt;
          });

          // Return the chats to the user
          callback(chats, err);
        });
      }
    });
}

/**
 * Deletes Chat object from the chats table
 * To be used when a user leaves a chat
 */
function deleteUserChatRelationship(username, room, callback) {
  // Check that the user exists
  User.get(username, (userErr, userData) => {
    if (userErr || !userData) {
      callback(null, "User not found.");
    }

    // Deletes the realtionship associated with user and the room
    UserChatRelationship
      .destroy(username, room, (deleteErr) => {
        if (deleteErr) {
          callback(false, "Error trying to delete user chat relationship: " + deleteErr.message);
        } else {
          callback(true, null);
        }
    });
  });
}

// Create an object to store the helper functions
const userChatRelationship = {
  createUserChatRelationship,
  getChats,
  deleteUserChatRelationship,
};

// Export the object
module.exports = userChatRelationship;
