const { UserInputError, AuthenticationError } = require("apollo-server");
const Course = require("../../models/Course");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    createReview: async (_, { courseId, pros, cons }, context) => {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        course.reviews.unshift({
          pros,
          cons,
          username,
          createdAt: new Date().toISOString(),
        });
        await course.save();
        return course;
      } else throw new UserInputError("Course not found");
    },
    deleteReview: async (_, { courseId, reviewId }, context) => {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        const reviewIndex = course.reviews.findIndex((c) => c.id === reviewId);
        if (course.reviews[reviewIndex]) {
          course.reviews.splice(reviewIndex, 1);
          await course.save();
          return course;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else throw new UserInputError("Post not found");
    },
  },
};
