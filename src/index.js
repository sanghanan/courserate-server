require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const PORT = process.env.PORT || 5000;

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req) => req,
});

const options = {
  port: PORT,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
};

const startServer = async () => {
  let connection;
  try {
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log("Database connected");
    server.start(options, ({ port }) =>
      console.log(`Server started at http://localhost:${port}.`)
    );
    return connection;
  } catch (err) {
    console.log(err);
  }
};

startServer();

module.exports = startServer;
