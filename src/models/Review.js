const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  pros: [String],
  cons: [String],
  username: String,
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  createdAt: String,
});

module.exports = model("Review", reviewSchema);
