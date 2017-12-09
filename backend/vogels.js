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
  hashKey: "keyword",
  timestamps: true,
  schema: {
    keyword: Joi.string(),
    image: Joi.string().allow(null).allow("").optional(),
    content: Joi.string(),
    user: Joi.string(),
    receiver: Joi.string().allow(null).allow("").optional(),
    likesCount: Joi.number(),
    type: Joi.string(),
  },
  tableName: "statuses",
});

// Create the above tables
vogels.createTables((err) => {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables have been created');
  }
});

// // Sample object
// const obj = {
//   username: "ccabo",
//   name: "Cameron Cabo",
//   password: "password",
//   bio: "This is my bio",
//   interests: "interest1, interest2",
//   affiliation: "affilation1, affiliation2",
//   profilePicture: "",
//   coverPhoto: "",
// };
//
// // Add the object to the users table
// User.create(obj, (err, user) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

// Create an object storing all the tables
const tables = {
  User,
  Status,
};

module.exports = tables;
