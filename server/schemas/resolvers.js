const { User, Thought } = require('../models')

// a resolver function can accept up to 4 parameters in the following order:
// parent: used for nested resolvers
// args: values passed into the query or mutation request as params
// context: for example, if we need to access a logged in user's status or API access token
// info: extra info about the operation's current state.

const resolvers = {
    Query: {
        thoughts: async (_, { username }) => {
            const params = username ? { username } : {}
            return Thought.find(params).sort({ createdAt: -1 })
        },
        thought: async (_, { _id }) => {
            return Thought.findOne({ _id })
        }
    }
}

module.exports = resolvers