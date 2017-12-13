// // Import the user table
// const { Chat, UserChatRelationship, User } = require('./schema.js');
// const uuid = require('uuid-v4');
// const async = require('async');

// // This file uses both Chat and UserChatRelationship Models
// // Chat is analogous to User here so don't use User

// /**
//  * Create a chat
//  */
// function createChat(creator, title, room, callback) {
// 	if (!creator) {
// 		callback(null, "Creator must be populated");
// 	} else if (!title) {
// 		callback(null, "Title must be populated");
// 	} else if (!room) {
// 		callback(null, "Room must be populated");
// 	} else {
//     // Create chat object
// 		const chatObject = {
// 			creator: receiver,
// 			title: title,
// 			room: room,
// 		};

// 		//Put the chat in to the database
// 		Chat.create(chatObject, (err, data) => {
// 			if (err || !data) {
//         callback(null, "Failed to put chat in database.");
// 			} else {
// 				callback(data, null);
// 			}
// 		});
// 	}
// }

// /*
// * TODO create function to add UserChatRel
// * Must call this for the creator automatically and anyone in the future added to the chat
// */

// /**
//  * Get a user with the specified room
//  */
// function getChat(room, callback) {
//   // Ensure the username is properly formatted
//   if (!room || room.length === 0) {
//     callback(null, "Room must be well-defined.");
//   }

//   // Find the user in the database
//   Chat.get(room, (err, data) => {
//     if (err || !data) {
//       // If there was an issue getting the data
//       callback(null, "Chat with room \"" + room + "\" not found.");
//     } else {
//       // Return the value without error
//       callback(data.attrs, null);
//     }
//   });
// }

// /**
//  * Update a user based on the passed in information
//  * TODO error checking
//  */
// function updateChat(updatedChat, callback) {
//   // Find the room from the updated chat object
//   const room = updatedChat.room;

//   // Find the chat in the database
//   Chat.get(room, (err, oldChatData) => {
//     if (err || !oldChatData) {
//       callback(null, "Chat not found");
//     } else {
//       // Isolate the old user object
//       const oldChat = oldChatData.attrs;

//       // Update the user's fields
//       oldChat.title = updatedChat.title;
//       oldUser.bio = updatedChat.bio;

//       // Put the updated user into the database
//       User.update(oldUser, (updateErr, updatedData) => {
//         if (updateErr || !updatedData) {
//           callback(null, "Failed to update user");
//         } else {
//           callback(updatedData, null);
//         }
//       });
//     }
//   });
// }


// // Create an object to store the helper functions
// const invites = {
//   createChat,
//   getChat,
// };

// // Export the object
// module.exports = invites;
