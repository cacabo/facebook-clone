const users = require('./users');

/**
 * Get all statuses in the table
 * TODO sort chronologically
 */
function getStatuses(callback) {
  // statuses.scanKeys((err, values) => {
  //   if (err || !values) {
  //     callback(null, "Failed to retrieve keys.");
  //   } else {
  //     // Construct a status array
  //     const statusArr = [];
  //
  //     // Iterate over the keys in the statuses array
  //     async.each(values, (value, keysCallback) => {
  //       // Find the username associated with the key
  //       const keyword = value.key;
  //
  //       // Find the status with the given key
  //       statuses.get(keyword, (statusErr, statusData) => {
  //         if (statusErr || !statusData) {
  //           // If we failed to retrieve data
  //           callback(null, "An error occured: " + statusErr);
  //         } else {
  //           // Get the status object
  //           const status = JSON.parse(statusData[0].value);
  //
  //           // Get the status's user's info
  //           users.get(status.user, (userErr, userData) => {
  //             if (userErr || !userData) {
  //               callback(null, "Failed to retrieve status information.");
  //             } else {
  //               // Parse for the user data as an object
  //               const userDataObj = JSON.parse(userData[0].value);
  //
  //               // Remove unnecessary fields
  //               delete userDataObj.password;
  //               delete userDataObj.bio;
  //               delete userDataObj.coverPhoto;
  //               delete userDataObj.updatedAt;
  //               delete userDataObj.interests;
  //               delete userDataObj.affiliation;
  //
  //               // Put the user information into the status object
  //               status.userData = userDataObj;
  //
  //               // Push the status onto the array
  //               statusArr.push(status);
  //
  //               // Alert that the async call is done
  //               keysCallback();
  //             }
  //           });
  //         }
  //       });
  //     }, (asyncErr) => {
  //       if (asyncErr) {
  //         // If there is an error with the async operation
  //         callback(null, asyncErr);
  //       } else {
  //         // Sort the staus array
  //         statusArr.sort((a, b) => {
  //           return b.createdAt - a.createdAt;
  //         });
  //
  //         // Send the statuses to the user
  //         callback({ statusArr }, null);
  //       }
  //     });
  //   }
  // });
}

/**
 * Get a single status based on the passed in ID
 */
function getStatus(id, callback) {
  // if (!id || id.length === 0) {
  //   callback(null, "Status ID must be well-defined");
  // } else {
  //   statuses.get(id, (err, statusData) => {
  //     if (err || !statusData) {
  //       callback(null, "Status not found");
  //     } else {
  //       // Find the status information from the data
  //       const status = JSON.parse(statusData[0].value);
  //
  //       // Find the user of the status
  //       users.get(status.user, (userErr, userData) => {
  //         if (userErr || !userData) {
  //           callback(null, "Failed to retrieve status information.");
  //         } else {
  //           // Parse for the user data as an object
  //           const userDataObj = JSON.parse(userData[0].value);
  //
  //           // Remove unnecessary fields
  //           delete userDataObj.password;
  //           delete userDataObj.bio;
  //           delete userDataObj.coverPhoto;
  //           delete userDataObj.updatedAt;
  //           delete userDataObj.interests;
  //           delete userDataObj.affiliation;
  //
  //           // Put the user information into the status object
  //           status.userData = userDataObj;
  //
  //           // Return the status
  //           callback(status, null);
  //         }
  //       });
  //     }
  //   });
  // }
}

/**
 * Create a status
 * TODO find the key
 */
function createStatus(content, receiver, user, callback) {
  // // Data validation
  // if (!content) {
  //   callback(null, "Content must be populated");
  // } else if (!user) {
  //   callback(null, "User must be populated");
  // } else {
  //   /**
  //    * TODO find the key-- based on the inx? Unique ID?
  //    */
  //   const obj = {
  //     content,
  //     receiver,
  //     user,
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     type: "STATUS",
  //     commentsCount: 0,
  //     likesCount: 0,
  //   };
  //
  //   // Find a unique key identifier
  //   const key = obj.user + ":" + uuid();
  //
  //   // Put the status in to the database
  //   statuses.put(key, JSON.stringify(obj), (err, data) => {
  //     if (err || !data) {
  //       callback(null, "Failed to put status in database.");
  //     } else {
  //       callback({ inx: data, key }, null);
  //     }
  //   });
  // }
}

/**
 * Get all statuses by a user
 * TODO perform a range query for the specific statuses we want
 */
function getUserStatuses(username, callback) {
  // if (!username || username.length === 0) {
  //   callback(null, "Username must be well-defined");
  // } else {
  //   users.getPrefix(username + ":", (err, data) => {
  //     if (err || !data) {
  //       callback(null, err);
  //     } else {
  //       callback(data, null);
  //     }
  //   });
  // }
}

/**
 * Create a friendship. friend1 is adding, and friend2 is being added
 * TODO After fixing error with range query, we need to create friendships
 *      and add them to the friendshipsTable
 */
function createFriendship(friend1, friend2, callback) {
  // // Check if any of friends are null
  // if (!friend1 || !friend2) {
  //   callback(null, "One of the friends are null.");
  // } else {
  //   // Check if friend2 doesn't exist
  //   users.get(friend2, (err, data) => {
  //     if(err) {
  //       callback(null, "There was an error looking for friend:" + err);
  //     } else if(!data) {
  //       callback(null, "The friend you want to add does not exist.");
  //     }
  //   });
  //
  //   // Check if the friendship already exists
  //   friendships.getPrefix(friend1, (err, data) => {
  //     // Check for errors in getting prefix set
  //     if (err) {
  //       callback(null, "Error looking for friendship:" + err);
  //     } else if(data) {
  //       console.log("reached data exists");
  //
  //       // Go through data and see if it is friendship between 1 and 2
  //       data.forEach((friendRelationship) => {
  //         if (friendRelationship) {
  //           console.log(friendRelationship);
  //           if (friendRelationship.value.user2 === friend2) {
  //             callback(null, "The friendship already exists.");
  //           }
  //         }
  //       });
  //     }
  //   });
  //
  //   // // Friendship for user that is adding
  //   // const friendship1Object = {
  //   //   "user1": friend1,
  //   //   "user2": friend2,
  //   //   "createdAt": Date.now(),
  //   // };
  //   //
  //   // // Friendship for user that is being added
  //   // const friendship2Object = {
  //   //   "user1": friend2,
  //   //   "user2": friend1,
  //   //   "createdAt": Date.now(),
  //   // };
  //   //
  //   // // Find the key for the friendship
  //   // const key1 = friend1 + ":" + uuid();
  //   // const key2 = friend2 + ":" + uuid();
  //   //
  //   // // Put the friendship into the database
  //   // friendships.put(key1, JSON.stringify(friendship1Object), (err, data) => {
  //   //   if (err || !data) {
  //   //     callback(null, "Failed to create friendship: " + err);
  //   //   } else {
  //   //     // If adding the first relation was a success
  //   //     friendships.put(key2, JSON.stringify(friendship2Object), (err2, data2) => {
  //   //       if (err2 || !data2) {
  //   //         callback(null, "Failed to create friendship: " + err);
  //   //       } else {
  //   //         callback({ success: true }, null);
  //   //       }
  //   //     });
  //   //   }
  //   // });
  // }
}

/**
 * Adds a Like object to the likesTable and updates the likeCount in the status
 */
function addLike(liker, status, callback) {
  // if (!liker || !status) {
  //   callback(null, "Either the liker or status is null.");
  // } else {
  //   // Check that the status exists
  //   statuses.get(status, (err, data) => {
  //     if (err || !data) {
  //       if (err) {
  //         callback(null, "There was an error looking up status: " + err);
  //       } else {
  //         callback(null, "Status does not exist.");
  //       }
  //     } else {
  //       // Create like object
  //       const likeObject = {
  //         status: status,
  //         liker: liker,
  //       };
  //
  //       const key = status + ":" + uuid();
  //       // Put like object in table
  //       likes.put(key, JSON.stringify(likeObject), (errLike, dataLike) =>  {
  //         if(errLike || !dataLike) {
  //           callback(null, "There was an error adding like to the table.");
  //         } else {
  //           // noice
  //           const oldStatus = JSON.parse(data[0].value);
  //
  //           // Increase likesCount by 1
  //           oldStatus.likesCount = parseInt(oldStatus.likesCount, 10) + 1;
  //
  //           // Update likes count of status in table
  //           statuses.update(status, data[0].inx, oldStatus, (err3, data3) => {
  //             if(err3 || !data3) {
  //               callback(null, "There was an error updating likes count.");
  //             } else{
  //               callback({success: true}, null);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
}

// function getMessages(user, callback) {
//   messages.get(user.username, (err, messageData) => {
//     if (err || !messageData) {

//     }
//   });
// }

// Create the database object to export
const database = {
  getUser: users.getUser,
  createUser: users.createUser,
  updateUser: users.updateUser,
  getStatuses: getStatuses,
  getStatus: getStatus,
  getUserStatuses: getUserStatuses,
  createStatus: createStatus,
  createFriendship: createFriendship,
  addLike: addLike,
};

module.exports = database;
