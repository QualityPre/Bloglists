const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/userModel')

// get all existing users

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.json(users)
})

// Adding a new user

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // check if username length and password length is greater than 3 characters
  if (username.length < 4 || password.length < 4) {
    return response.status(400).json({
      error: 'Password and username must be greater than 3 characters long',
    })
  }
  // check if user is unique
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
