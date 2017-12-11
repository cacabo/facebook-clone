// Import libraries
const vogels = require('vogels');
const Joi = require('joi');

// Configure AWS
vogels.AWS.config.loadFromPath('./config.json');

// Define a schema for user chat
const Chat = vogels.define("Chat", {
  hashKey: "room",
  timestamps: true,
  schema: {
    creator: Joi.string(),
    title: Joi.string(),
    room: Joi.string(),
  },
  tableName: "chats",
});

// Define a schema for user chat realtionships
const UserChatRelationship = vogels.define("UserChatRelationship", {
  hashKey: "username",
  rangeKey: "room",
  timestamps: true,
  schema: {
    username: Joi.string(),
    title: Joi.string(),
    room: Joi.string(),
  },
  tableName: "userChatRelationship",
});

// Define a schema for messages
const Message = vogels.define("Message", {
  hashKey: "room",
  rangeKey: "id",
  timestamps: true,
  schema: {
    id: Joi.string(),
    username: Joi.string(),
    body: Joi.string(),
    room: Joi.string(),
  },
  tableName: "messages",
});

// Define a schema for invites
const Invite = vogels.define("Invite", {
  hashKey: "username",
  rangeKey: "room",
  timestamps: true,
  schema: {
    id: Joi.string(),
    username: Joi.string(),
    sender: Joi.string(),
    body: Joi.string(),
    room: Joi.string(),
  },
  tableName: "invites",
});

// Define the schema for users
const User = vogels.define("User", {
  hashKey: "username",
  timestamps: true,
  schema: {
    username: Joi.string(),
    name: Joi.string(),
    password: Joi.string(),
    bio: Joi.string().allow(null),
    interests: Joi.string().allow(null).allow("").optional(),
    affiliation: Joi.string().allow(null).allow("").optional(),
    profilePicture: Joi.string().allow(null).allow("").optional(),
    coverPhoto: Joi.string().allow(null).allow("").optional(),
  }
});

// Define a schema for statuses
const Status = vogels.define("Status", {
  hashKey: "user",
  rangeKey: "id",
  timestamps: true,
  schema: {
    id: Joi.string(),
    image: Joi.string().allow(null).allow("").optional(),
    content: Joi.string(),
    user: Joi.string(),
    receiver: Joi.string().allow(null).allow("").optional(),
    likesCount: Joi.number(),
    commentsCount: Joi.number(),
    type: Joi.string(),
  },
  tableName: "statuses",
});

// Define a schema for likes
const Like = vogels.define("Like", {
  hashKey: "statusID",
  rangeKey: "liker",
  timestamps: true,
  schema: {
    statusID: Joi.string(),
    id: Joi.string(),
    liker: Joi.string(),
  },
  tableName: "likes",
});

// Define a schema for comments
const Comment = vogels.define("Comment", {
  hashKey: "statusID",
  rangeKey: "id",
  timestamps: true,
  schema: {
    statusID: Joi.string(),
    id: Joi.string(),
    commenter: Joi.string(),
    comment: Joi.string(),
  },
  tableName: "comments",
});

// Create the above tables
vogels.createTables((err) => {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables have been created');
  }
});

// Create an object storing all the tables
const tables = {
  User,
  Status,
  Like,
  Comment,
  Invite,
  Message,
};

module.exports = tables;
