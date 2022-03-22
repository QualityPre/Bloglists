const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.message })
  }

  logger.error(error.message)
  next(error)
}

const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request['token'] = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      request.user = null
    } else {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }
