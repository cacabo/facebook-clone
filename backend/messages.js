// Import the user table
const { Message, UserChatRelationship } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');


/**
 * Create a message
 */
 function createMessage(username, body, room, callback) {
   if (!username) {
    callback(null, "Username must be populated");
  } else if (!body) {
    callback(null, "Body must be populated");
  } else if (!room) {
    callback(null, "Room must be populated");
  } else {
    // Create message object
    const messageObject = {
     id: uuid(),
     username: username,
     body: body,
     room: room,
   };

		//Put the message in to the database
		Message.create(messageObject, (err, data) => {
      console.log(data);
      if (err || !data) {
        callback(null, "Failed to put message in database.");
      } else {
        callback(data, null);
      }
    });
	}
}

/**
 * Get all messages for a room
 */
 function getMessages(username, room, callback) {
	// Error checking on the room name
  if (!room || room.length === 0) {
    callback(null, "Room must be well-defined");
  }

  // Query for the messages
  Message
  .query(room)
  .loadAll()
  .exec((err, data) => {
    if (err || !data) {
      callback(null, err);
    } else {
        // Prune out the message data
        const messages = data.Items.map(item => {
          const message = item.attrs;
          // message.roomData = roomObj;
          return message;
        });

        // Get the recipient name
        async.each(messages, (message, keysCallback) => {
          if (message.receiver) {
            Message.get(message.receiver, (receiverErr, receiverData) => {
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

          // Sort the messages
          messages.sort((a, b) => {
            const aCreatedAt = new Date(a.createdAt);
            const bCreatedAt = new Date(b.createdAt);
            return bCreatedAt - aCreatedAt;
          });

          // Return the messages to the user
          callback(messages, err);
        });
      }
    });
}

// Create an object to store the helper functions
const messages = {
  createMessage,
  getMessages,
};

// Export the object
module.exports = messages;
