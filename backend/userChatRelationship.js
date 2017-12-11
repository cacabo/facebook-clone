// Import the user table
const { UserChatRelationship, User } = require('./schema.js');
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
    // Create chat object
		const relObject = {
			username: receiver,
			title: title,
			room: room,
		};

		//Put the chat in to the database
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

  // Check that the user exists
  User.get(username, (userErr, userData) => {
    if (userErr || !userData) {
      callback(null, "User not found.");
    }

    // Store the user object
    const userObj = userData.attrs;

    // Delete unneeded info
    delete userObj.password;
    delete userObj.affiliation;
    delete userObj.interests;
    delete userObj.bio;
    delete userObj.coverPhoto;

    // Else, query for the invites
    UserChatRelationship
      .query(username)
      .loadAll()
      .exec((err, data) => {
        if (err || !data) {
          callback(null, err);
        } else {
          // Prune out the invite data
          const chats = data.Items.map(item => {
            const chat = item.attrs;
            chat.userData = userObj;
            return chat;
          });

          // Get the recipient name
          async.each(chats, (chat, keysCallback) => {
            if (chat.receiver) {
              UserChatRelationship.get(chat.receiver, (receiverErr, receiverData) => {
                if (receiverErr || !receiverData) {
                  callback(receiverErr, null);
                } else {
                  // Find the user object
                  const receiverObj = userData.attrs;

                  // Update the invite object
                  chat.receiverData = receiverObj;
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

            // Sort the invites
            chats.sort((a, b) => {
              const aCreatedAt = new Date(a.createdAt);
              const bCreatedAt = new Date(b.createdAt);
              return bCreatedAt - aCreatedAt;
            });

            // Return the invites to the user
            callback(chats, err);
          });
        }
      });
  });
}

/**
 * Deletes Invite object from the invites table
 * To be used after a user accepts an invitation
 */
function deleteUserChatRelationship(username, room, callback) {
  // Check that the user exists
  User.get(username, (userErr, userData) => {
    if (userErr || !userData) {
      callback(null, "User not found.");
    }

    // Deletes the invitation associated with user and the room
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
