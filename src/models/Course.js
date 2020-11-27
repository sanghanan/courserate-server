const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  title: String,
  username: String,
  website: String,
  link: String,
  username: String,
  createdAt: String,
  cost: Number,
  skills: [String],
  level: String,
  reviews: [],
  votes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("Course", courseSchema);
