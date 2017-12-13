const { Invite, User } = require('./schema.js');
const uuid = require('uuid-v4');
const async = require('async');


/**
 * Create an invite
 */
 function createInvite(sender, receiver, room, callback) {
   if (!sender) {
    callback(null, "Sender must be populated");
  } else if (!receiver) {
    callback(null, "Receiver must be populated");
  } else if (!room) {
    callback(null, "Room must be populated");
  } else {
    // Create invite object
    const inviteObject = {
     id: uuid(),
     username: receiver,
     sender: sender,
     body: sender + " invited you to join " + room,
     room: room,
   };

		//Put the invite in to the database
		Invite.create(inviteObject, (err, data) => {
			if (err || !data) {
        callback(null, "Failed to put invite in database.");
      } else {
        callback(data, null);
      }
    });
	}
}

/**
 * Get all invites for a user
 */
 function getInvites(username, callback) {
	// Error checking on the username
  if (!username || username.length === 0) {
    callback(null, "Username must be well-defined");
  }

  // Else, query for the invites
  Invite
  .query(username)
  .loadAll()
  .exec((err, data) => {
    if (err || !data) {
      callback(null, err);
    } else {
        // Prune out the invite data
        const invites = data.Items.map(item => {
          const invite = item.attrs;
          return invite;
        });

        // Get the recipient name
        async.each(invites, (invite, keysCallback) => {
          if (invite.receiver) {
            Invite.get(invite.receiver, (receiverErr, receiverData) => {
              if (receiverErr || !receiverData) {
                callback(receiverErr, null);
              } else {
                // Find the user object
                const receiverObj = userData.attrs;

                // Delete unneeded info
                delete receiverObj.password;
                delete receiverObj.affiliation;
                delete receiverObj.interests;
                delete receiverObj.bio;
                delete receiverObj.coverPhoto;

                // Update the invite object
                invite.receiverData = receiverObj;
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
          invites.sort((a, b) => {
            const aCreatedAt = new Date(a.createdAt);
            const bCreatedAt = new Date(b.createdAt);
            return bCreatedAt - aCreatedAt;
          });

          // Return the invites to the user
          callback(invites, err);
        });
}
});
}

/**
 * Deletes Invite object from the invites table
 * To be used after a user accepts an invitation
 */
 function deleteInvite(username, room, callback) {
  // Check that the user exists
  User.get(username, (userErr, userData) => {
    if (userErr || !userData) {
      callback(null, "User not found.");
    }

    // Deletes the invitation associated with user and the room
    Invite
    .destroy(username, room, (deleteErr) => {
      if (deleteErr) {
        callback(false, "Error trying to delete like: " + deleteErr.message);
      } else {
        callback(true, null);
      }
    });
  });
}

// Create an object to store the helper functions
const invites = {
  createInvite,
  getInvites,
  deleteInvite,
};

// Export the object
module.exports = invites;
