const users = require('./users');
const statuses = require('./statuses');
const likes = require('./likes');
const comments = require('./comments');
const friendships = require('./friendships');

// Create the database object to export
const database = {
  getUser: users.getUser,
  createUser: users.createUser,
  updateUser: users.updateUser,
  searchUsers: users.searchUsers,
  affiliationUsers: users.affiliationUsers,
  createStatus: statuses.createStatus,
  getStatuses: statuses.getStatuses,
  getStatus: statuses.getStatus,
  getUserStatuses: statuses.getUserStatuses,
  addLike: likes.addLike,
  deleteLike: likes.deleteLike,
  checkLike: likes.checkLike,
  getComments: comments.getComments,
  addComment: comments.addComment,
  addFriendship: friendships.addFriendship,
  getFriendships: friendships.getFriendships,
  getFriend: friendships.getFriend,
};

module.exports = database;
