const { AuthenticationError, UserInputError } = require("apollo-server");
const Course = require("../../models/Course");
const checkAuth = require("../../util/checkAuth");
const User = require("../../models/User");
const url = require("url");

module.exports = {
  Query: {
    async courses() {
      try {
        const courses = await Course.find({}).sort({ createdAt: -1 });
        return courses;
      } catch (err) {
        console.log(err);
      }
    },
    async course(_, { courseId }) {
      try {
        const course = await Course.findById(courseId);
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
    async createCourse(_, { title, link, cost, level, skills }, context) {
      const user = await checkAuth(context);
      if (title.trim() === "") {
        throw new UserInputError("Course title must not be empty");
      }
      const newCourse = new Course({
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
      const course = await newCourse.save();
      return course;
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
