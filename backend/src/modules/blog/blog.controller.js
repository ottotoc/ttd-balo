const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../../common/asyncHandler')
const { success } = require('../../common/response')
const { NotFoundError, BadRequestError } = require('../../common/errors')

const prisma = new PrismaClient()

/**
 * @desc    Get all blog posts (admin)
 * @route   GET /api/blog
 * @access  Admin
 */
const getAllBlogPosts = asyncHandler(async (req, res) => {
  const { published } = req.query

  const where = {}
  if (published !== undefined) {
    where.published = published === 'true'
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return success(res, {
    posts,
    total: posts.length,
  })
})

/**
 * @desc    Get published blog posts (public)
 * @route   GET /api/blog/published
 * @access  Public
 */
const getPublishedBlogPosts = asyncHandler(async (req, res) => {
  const { limit } = req.query

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    ...(limit && { take: parseInt(limit) }),
  })

  return success(res, {
    posts,
  })
})

/**
 * @desc    Get blog post by slug
 * @route   GET /api/blog/:slug
 * @access  Public
 */
const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post) {
    throw new NotFoundError('Blog post not found')
  }

  // Only show unpublished posts to admins
  if (!post.published && req.user?.role !== 'ADMIN') {
    throw new NotFoundError('Blog post not found')
  }

  return success(res, {
    post,
  })
})

/**
 * @desc    Get blog post by ID
 * @route   GET /api/blog/id/:id
 * @access  Admin
 */
const getBlogPostById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  })

  if (!post) {
    throw new NotFoundError('Blog post not found')
  }

  return success(res, {
    post,
  })
})

/**
 * @desc    Create blog post
 * @route   POST /api/blog
 * @access  Admin
 */
const createBlogPost = asyncHandler(async (req, res) => {
  const { title, slug, excerpt, content, coverUrl, published } = req.body

  if (!title || !slug) {
    throw new BadRequestError('Title and slug are required')
  }

  // Check if slug already exists
  const existing = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (existing) {
    throw new BadRequestError('Slug already exists')
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      coverUrl: coverUrl || null,
      published: published !== undefined ? published : false,
    },
  })

  return success(res, {
    post,
  }, 201)
})

/**
 * @desc    Update blog post
 * @route   PUT /api/blog/:id
 * @access  Admin
 */
const updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, slug, excerpt, content, coverUrl, published } = req.body

  const existing = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('Blog post not found')
  }

  // Check if slug is being changed and if it conflicts
  if (slug && slug !== existing.slug) {
    const slugExists = await prisma.blogPost.findUnique({
      where: { slug },
    })
    if (slugExists) {
      throw new BadRequestError('Slug already exists')
    }
  }

  const post = await prisma.blogPost.update({
    where: { id: parseInt(id) },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(published !== undefined && { published }),
    },
  })

  return success(res, {
    post,
  })
})

/**
 * @desc    Delete blog post
 * @route   DELETE /api/blog/:id
 * @access  Admin
 */
const deleteBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params

  const existing = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('Blog post not found')
  }

  await prisma.blogPost.delete({
    where: { id: parseInt(id) },
  })

  return success(res, {
    message: 'Blog post deleted successfully',
  })
})

module.exports = {
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
}

