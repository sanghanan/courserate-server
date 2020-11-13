const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  bio: String,
  count: {
    default: 0,
    type: Number,
  },
});

module.exports = model("User", userSchema);
