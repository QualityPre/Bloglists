const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const logger = require('./utils/logger')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')

// Routes
const blogsRouter = require('./controllers/blogsController')
const usersRouter = require('./controllers/usersController')
const loginRouter = require('./controllers/loginController')

const url = config.MONGODB_URI
logger.info('connecting to', url)

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

// mounted routes

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app
