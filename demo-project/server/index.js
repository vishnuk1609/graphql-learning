const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const PORT = 8000;
const logger = require("morgan");

const { USERS } = require("./user");
const { TODO } = require("./todo");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }

      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => USERS.find((user) => user.id === todo.id),
      },
      Query: {
        getTodos: () => TODO,
        getAllUsers: () => USERS,
        getUser: (parent, { id }) => USERS.find((user) => user.id === id),
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());
  app.use(logger("dev"));

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

startServer();
