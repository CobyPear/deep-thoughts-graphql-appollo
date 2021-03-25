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
        me: async(_, __, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts friends')

                return userData
            }

            throw new AuthenticationError('Not logged in');
        },
        thoughts: async(_, { username }) => {
            const params = username ? { username } : {}
            return Thought.find(params).sort({ createdAt: -1 })
        },
        thought: async(_, { _id }) => {
            return Thought.findOne({ _id })
        },
        users: async() => {
            return User.find({})
                .select('-__v -password')
                .populate('thoughts friends')
        },
        user: async(_, { username }) => {
            return User.findOne({ username: username })
                .select('-__v -password')
                .populate('thoughts friends')
        }
    },
    Mutation: {
        addUser: async(_, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return { token, user }
        },
        login: async(_, { email, password }) => {
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
        },
        addThought: async(_, args, context) => {
            if (context.user) {
                const { _id, username } = context.user
                const thought = await Thought.create({
                    ...args,
                    username: username
                })

                await User.findOneAndUpdate({ _id: _id }, { $push: { thoughts: thought._id } }, { new: true })

                return thought
            }

            throw new AuthenticationError('Please log in')
        },
        addReaction: async(_, { thoughtId, reactionBody}, context) => {
            if (context.user) {
                const { username } = context.user

                const updatedThought = await Thought.findOneAndUpdate({ _id: thoughtId }, { $push: { reactions: { reactionBody, username: username } } }, { new: true })

                return updatedThought
            }

            throw new AuthenticationError('Please log in')
        },
        addFriend: async(_, { friendId }, context) => {
            if (context.user) {
                const { username, _id } = context.user


                const updatedUser = await User.findOneAndUpdate({ _id: _id }, { $addToSet: { friends: friendId } }, { new: true })
                .populate('friends')

                return updatedUser
            }

            throw new AuthenticationError('Please log in')
        }
    }
}

module.exports = resolvers