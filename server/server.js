const express = require('express');
require('dotenv').config()
// apollo server
const { ApolloServer } = require('apollo-server-express')
const db = require('./config/connection');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
// middleware
const { authMiddleware } = require('./utils/auth')
const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in our schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

// integrate Apollo server with Express as middleware
server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});
