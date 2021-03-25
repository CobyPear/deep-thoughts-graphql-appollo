const { User, Thought } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')

// a resolver function can accept up to 4 parameters in the following order:
// parent: used for nested resolvers
// args: values passed into the query or mutation request as params
// context: for example, if we need to access a logged in user's status or API access token
// info: extra info about the operation's current state.

const resolvers = {
    Query: {
        me: async = (_, args) => {
            const userData = await User.findOne({})
            .select('-__v -password')
            .populate('thoughts friends')

            return userData
        },
        thoughts: async (_, { username }) => {
            const params = username ? { username } : {}
            return Thought.find(params).sort({ createdAt: -1 })
        },
        thought: async (_, { _id }) => {
            return Thought.findOne({ _id })
        },
        users: async () => {
            return User.find({})
            .select('-__v -password')
            .populate('thoughts friends')
        },
        user: async (_, { username }) => {
            return User.findOne({ username: username })
            .select('-__v -password')
            .populate('thoughts friends')
        }
    },
    Mutation: {
        addUser: async (_, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            
            return { token, user }
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email })
            
            if (!user) {
                throw new AuthenticationError('Incorrect credentials, check email or password')
            }
            
            const correctPw = await user.isCorrectPassword(password)
            
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials, check your password')
            }
            
            const token = signToken(user)
            return { token, user }
        }
    }
}

module.exports = resolvers