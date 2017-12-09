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
};

module.exports = tables;
