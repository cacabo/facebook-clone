// Import the user table
const { Chat, UserChatRelationship, User } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');

// This file uses both Chat and UserChatRelationship Models
// Chat is analogous to User here so don't use User

/**
 * Create a chat
 */
function createChat(title, room, callback) {
	if (!title) {
		callback(null, "Title must be populated");
	} else if (!room) {
		callback(null, "Room must be populated");
	} else {
    	// Create chat object
		const chatObject = {
			chatTitle: title,
			room: room,
			numUsers: 1,
		};

		//Put the chat in to the database
		Chat.create(chatObject, (err, data) => {
			if (err || !data) {
        callback(null, "Failed to put chat in database.");
			} else {
				callback(data, null);
			}
		});
	}
}

/*
* TODO create function to add UserChatRel
* Must call this for the creator automatically and anyone in the future added to the chat
*/

/**
 * Get a user with the specified room
 */
function getChat(room, callback) {
  // Ensure the username is properly formatted
  if (!room || room.length === 0) {
    callback(null, "Room must be well-defined.");
  }

  // Find the user in the database
  Chat.get(room, (err, data) => {
  	console.log("getChat reached chat.js")
    if (err || !data) {
      // If there was an issue getting the data
      callback(null, "Chat with room " + room + " not found.");
    } else {
      console.log("ehhhhhh");
      // Return the value without error
      callback(data, null);
    }
  });
}

/**
 * Update a chat based on the passed in information
 */
function updateChat(updatedChat, callback) {
  // Find the room from the updated chat object
  // Put the updated user into the database
  Chat.update(updatedChat, (updateErr, updatedData) => {
    if (updateErr || !updatedData) {
      callback(null, "Failed to update chat");
    } else {
      callback(updatedData, null);
    }
  });
}


// Create an object to store the helper functions
const invites = {
  createChat,
  getChat,
  updateChat,
};

// Export the object
module.exports = invites;
