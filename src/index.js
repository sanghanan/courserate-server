require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req) => req,
});

server.use(cookieParser());

const options = {
  port: PORT,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
  cors: {
    credentials: true,
    origin: ["http://localhost:3000", "https://courserate.netlify.app/"],
  },
};

const startServer = async () => {
  let connection;
  try {
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
