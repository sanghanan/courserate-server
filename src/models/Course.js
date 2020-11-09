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
  reviews: [
    {
      pros: [String],
      cons: [String],
      username: String,
      createdAt: String,
    },
  ],
  votes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Course", courseSchema);
