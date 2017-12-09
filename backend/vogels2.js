const vogels = require('vogels');
const Joi = require('joi');
vogels.AWS.config.loadFromPath('./config.json');

var User = vogels.define("User", {
  hashKey: "username",
  timestamps: true,
  schema: {
    username: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string(),
    bio: Joi.string().allow(null),
    interests: Joi.string().allow(null).allow("").optional(),
    affiliation: Joi.string().allow(null).allow("").optional(),
    profilePicture: Joi.string().allow(null).allow("").optional(),
    coverPhoto: Joi.string().allow(null).allow("").optional(),
  }
});

var Status = vogels.define("Status", {
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    image: Joi.string(),
    content: Joi.string(),
    user: Joi.string(),
    receiver: Joi.string(),
    likesCount: Joi.number(),
    type: Joi.string(),
  }
});

var Message = vogels.define("Message", {
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    user: Joi.string(),
    room: Joi.string(),
  }
});

var Friendship = vogels.define("Friendship", {
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    user1: Joi.string(),
    user2: Joi.string(),
  }
});

var Comment = vogels.define("Comment", {
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    content: Joi.string(),
    user: Joi.string(),
  }
});

var Chat = vogels.define("Chat", {
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    users: Joi.array(),
  }
});

var UserChat = vogels.define("UserChat", {
  hashKey: "keyword",
  timestamps: false,
  schema: {
    keyword: Joi.string(),
    chatID: Joi.string(),
  }
});

vogels.createTables((err) => {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables have been created');
  }
});

// const obj = {
//   username: "ccabo",
//   firstName: "Cameron",
//   lastName: "Cabo",
//   bio: "This is my bio",
//   interests: "interest1, interest2",
//   affiliation: "affilation1, affiliation2",
//   profilePicture: "",
//   coverPhoto: "",
// };
//
// Table.create(obj, (err, user) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

const tables = {
  User,
  Status,
  Message,
  Friendship,
  Comment,
  Chat,
  UserChat,
};

module.exports = tables;
