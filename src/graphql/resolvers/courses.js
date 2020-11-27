const { AuthenticationError, UserInputError } = require("apollo-server");
const Course = require("../../models/Course");
const { checkAuth } = require("../../util/checkAuth");
const User = require("../../models/User");
const url = require("url");
const { validateCourseInput } = require("../../util/validators");
const Review = require("../../models/Review");
const mongoose = require("mongoose");

module.exports = {
  Query: {
    async courses() {
      try {
        const courses = await Course.find({})
          .populate({ path: "reviews" })
          .sort({ createdAt: -1 });
        console.log(courses);
        return courses;
      } catch (err) {
        console.log(err);
      }
    },
    async course(_, { courseId }) {
      try {
        let course = await Course.findById(courseId);
        course = await course.populate("reviews").execPopulate();
        if (course) {
          return course;
        } else {
          throw new Error("Course not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createCourse(
      _,
      { title, link, cost, level, skills, pros, cons },
      context
    ) {
      const user = await checkAuth(context);
      const { errors, valid } = validateCourseInput(
        title,
        link,
        cost,
        level,
        skills
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        title,
        link,
        cost,
        level,
        skills,
        website: url.parse(link).hostname,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        pros,
        cons,
        username: user.username,
        createdAt: new Date().toISOString(),
        course: course._id,
      });
      course.reviews.push(review);
      await course.save();
      await review.save();
      return course;
    },
    async editCourse(
      _,
      { courseId, title, link, cost, level, skills },
      context
    ) {
      const user = await checkAuth(context);
      const { errors, valid } = validateCourseInput(
        title,
        link,
        cost,
        level,
        skills
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      try {
        let course = await Course.findById(courseId);
        if (user.username === course.username) {
          course.title = title;
          course.link = link;
          course.level = level;
          course.cost = cost;
          course.skills = skills;
          course.save();
          course = await course.populate("reviews").execPopulate();
          return course;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteCourse(_, { courseId }, context) {
      const user = await checkAuth(context);
      try {
        const course = await Course.findById(courseId);
        if (user.username === course.username) {
          await course.delete();
          return "Course deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async voteCourse(_, { courseId }, context) {
      const { username } = await checkAuth(context);
      const course = await Course.findById(courseId);
      if (course) {
        if (course.votes.find((vote) => vote.username === username)) {
          //course already voted
          course.votes = course.votes.filter(
            (vote) => vote.username !== username
          );
        } else {
          //Not voted, vote course
          course.votes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await course.save();
        return course;
      } else throw new UserInputError("Course Not Found");
    },
  },
};
