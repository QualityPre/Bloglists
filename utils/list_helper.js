const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach((blog) => {
    total += blog.likes
  })
  return total
}

const favouriteBlog = (blogs) => {
  let highest = 0
  function BlogObj(title, author, likes) {
    this.title = title
    this.author = author
    this.likes = likes
  }
  let faveBlog = {}
  blogs.forEach((blog) => {
    if (blog.likes > highest) {
      highest = blog.likes
      console.log(highest)
      faveBlog = new BlogObj(blog.title, blog.author, blog.likes)
    }
  })
  return faveBlog
}

module.exports = { totalLikes, favouriteBlog }
