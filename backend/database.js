const users = require('./users');
const userStatuses = require('./userStatuses');
const statuses = require('./statuses');
const likes = require('./likes');
const comments = require('./comments');

const invites = require('./invites');
const messages = require('./messages');
const userChatRelationship = require('./userChatRelationship');
const chats = require('./chats');
const friendships = require('./friendships');
const friendvisualizer = require('./friendvisualizer');
const mapreduce = require('./mapreduce');
const friendRecommendations = require('./friendRecommendations');

// Create the database object to export
const database = {
  getUser: users.getUser,
  createUser: users.createUser,
  updateUser: users.updateUser,
  searchUsers: users.searchUsers,
  addUserOnline: userStatuses.addUserOnline,
  getAllUserStatus: userStatuses.getAllUserStatus,
  deleteUserStatus: userStatuses.deleteUserStatus,
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
  createChat: chats.createChat,
  deleteChat: chats.deleteChat,
  getChat: chats.getChat,
  updateChat: chats.updateChat,
  getChats: userChatRelationship.getChats,
  createUserChatRelationship: userChatRelationship.createUserChatRelationship,
  deleteUserChatRelationship: userChatRelationship.deleteUserChatRelationship,
  getMessages: messages.getMessages,
  createMessage: messages.createMessage,
  getVisualizer: friendvisualizer.getVisualizer,
  getData: mapreduce.getData,
  getRecommendations: friendRecommendations.getRecommendations,
};

module.exports = database;
