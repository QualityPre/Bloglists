const blogsRouter = require('express').Router()
const Blog = require('../models/blogModel')
const logger = require('../utils/logger')

//login token
const jwt = require('jsonwebtoken')

//user
const User = require('../models/userModel')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  // const user = await User.findById(body.userId)

  if (!user) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }
  if (!body.likes) {
    body.likes = 0
  }

  if (!body.comments) {
    body.comments = []
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: user._id,
  })

  const savedBlog = await blog.save()
  logger.info(`added ${blog.title} to the blog list`)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  logger.info(`blog linked to user ${user.username}`)
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // blog can only be deleted by the user
  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //blog.user ===user.id

  if ((blog.user.toString(), user.id.toString())) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Unauthorized' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog)
})

module.exports = blogsRouter
