const { gql } = require('apollo-server-express')

// Create type definitions
const typeDefs = gql`
    type Query {
        helloWorld: String
    }
`

module.exports = typeDefs