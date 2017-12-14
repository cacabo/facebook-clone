const users = require('./users');
const statuses = require('./statuses');
const likes = require('./likes');
const comments = require('./comments');

const invites = require('./invites');
const messages = require('./messages');
const userChatRelationship = require('./userChatRelationship');
const friendships = require('./friendships');
const mapreduce = require('./mapreduce');

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
  getNewsfeedStatuses: statuses.getNewsfeedStatuses,
  getUserFeed: statuses.getUserFeed,
  addLike: likes.addLike,
  deleteLike: likes.deleteLike,
  checkLike: likes.checkLike,
  getComments: comments.getComments,
  addComment: comments.addComment,
  addFriendship: friendships.addFriendship,
  getFriendships: friendships.getFriendships,
  getFriend: friendships.getFriend,
  createInvite: invites.createInvite,
  getInvites: invites.getInvites,
  deleteInvite: invites.deleteInvite,
  getChats: userChatRelationship.getChats,
  createUserChatRelationship: userChatRelationship.createUserChatRelationship,
  getMessages: messages.getMessages,
  createMessage: messages.createMessage,
  getData: mapreduce.getData,
};

module.exports = database;
