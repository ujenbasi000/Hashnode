const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const connectDB = require("../../../server/config/db");

const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { graphqlUploadExpress } = require("graphql-upload");
const CookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

// CORS configuration
const corsOptions = {
  origin: true,
  credentials: true,
};

connectDB();

async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      // cors: cors(corsOptions),
      context: async ({ req, res }) => {
        return { req, res };
      },
    });

    await server.start();

    app.use(CookieParser());
    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app, cors: corsOptions });

    await new Promise((resolve) => app.listen({ port: 5000 }, resolve));

    console.log(
      `🚀 Server ready at http://localhost:5000${server.graphqlPath}`
    );
  } catch (err) {
    console.log("Error: ", err);
  }
}

startApolloServer(typeDefs, resolvers);

module.exports = {
  api: {
    bodyParser: false,
  },
};
