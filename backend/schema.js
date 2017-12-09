// Import libraries
const vogels = require('vogels');
const Joi = require('joi');

// Configure AWS
vogels.AWS.config.loadFromPath('./config.json');

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
  hashKey: "status",
  rangeKey: "id",
  timestamps: true,
  schema: {
    status: Joi.string(),
    id: Joi.string(),
    liker: Joi.string(),
  },
  tableName: "likes",
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
};

module.exports = tables;
