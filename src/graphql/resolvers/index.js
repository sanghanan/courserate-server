const courseResolvers = require("./courses");
const userResolvers = require("./users");
module.exports = {
  Course: {
    voteCount: (parent) => parent.votes.length,
    reviewCount: (parent) => parent.reviews.length,
  },
  Query: {
    ...courseResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
  },
};
