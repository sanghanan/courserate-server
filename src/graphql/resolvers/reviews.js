const { UserInputError, AuthenticationError } = require("apollo-server");
const Course = require("../../models/Course");
const Review = require("../../models/Review");
const User = require("../../models/User");
const { checkAuth } = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    createReview: async (_, { courseId, pros, cons }, context) => {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        const review = new Review({
          pros,
          cons,
          username,
          course: courseId,
          createdAt: new Date().toISOString(),
        });
        await review.save();
        course.reviews.push(review);
        await course.save();
        return course.populate("reviews").execPopulate();
      } else throw new UserInputError("Course not found");
    },
    editReview: async (_, { courseId, reviewId, pros, cons }, context) => {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        let review = await Review.findById(reviewId);
        if (review && review.username === username) {
          review.pros = pros;
          review.cons = cons;
          await review.save();
          return course.populate("reviews").execPopulate();
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else throw new UserInputError("Course not found");
    },
    deleteReview: async (_, { courseId, reviewId }, context) => {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        const review = await Review.findById(reviewId);
        if (review) {
          if (review.username === username) {
            const index = course.reviews.indexOf(review.id);
            await review.delete();
            course.reviews.splice(index, 1);
            await course.save();
            return course.populate("reviews").execPopulate();
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        }
        throw new UserInputError("Review does not exist");
      } else throw new UserInputError("Course not found");
    },
  },
};
