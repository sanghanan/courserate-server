const courseResolvers = require("./courses");
const userResolvers = require("./users");
const reviewResolvers = require("./reviews");
module.exports = {
  Course: {
    voteCount: (parent) => parent.votes.length,
    reviewCount: (parent) => parent.reviews.length,
  },
  Query: {
    ...courseResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
};
