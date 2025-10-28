const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../../common/asyncHandler')
const { success } = require('../../common/response')
const { NotFoundError, BadRequestError } = require('../../common/errors')

const prisma = new PrismaClient()

/**
 * @desc    Get all TikTok videos
 * @route   GET /api/tiktok-videos
 * @access  Admin
 */
const getTikTokVideos = asyncHandler(async (req, res) => {
  const videos = await prisma.tikTokVideo.findMany({
    orderBy: { position: 'asc' },
  })

  return success(res, {
    videos,
  })
})

/**
 * @desc    Get active TikTok videos (for frontend, max 3)
 * @route   GET /api/tiktok-videos/active
 * @access  Public
 */
const getActiveTikTokVideos = asyncHandler(async (req, res) => {
  const videos = await prisma.tikTokVideo.findMany({
    where: { active: true },
    orderBy: { position: 'asc' },
    take: 3, // Only get 3 videos
  })

  return success(res, {
    videos,
  })
})

/**
 * @desc    Get TikTok video by ID
 * @route   GET /api/tiktok-videos/:id
 * @access  Admin
 */
const getTikTokVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const video = await prisma.tikTokVideo.findUnique({
    where: { id: parseInt(id) },
  })

  if (!video) {
    throw new NotFoundError('TikTok video not found')
  }

  return success(res, {
    video,
  })
})

/**
 * @desc    Create TikTok video
 * @route   POST /api/tiktok-videos
 * @access  Admin
 */
const createTikTokVideo = asyncHandler(async (req, res) => {
  const { title, videoUrl, thumbnailUrl, description, active, position } = req.body

  if (!title || !videoUrl) {
    throw new BadRequestError('Title and video URL are required')
  }

  const video = await prisma.tikTokVideo.create({
    data: {
      title,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
      description: description || null,
      active: active !== undefined ? active : true,
      position: position !== undefined ? position : 0,
    },
  })

  return success(res, {
    video,
  }, 201)
})

/**
 * @desc    Update TikTok video
 * @route   PUT /api/tiktok-videos/:id
 * @access  Admin
 */
const updateTikTokVideo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, videoUrl, thumbnailUrl, description, active, position } = req.body

  const existing = await prisma.tikTokVideo.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('TikTok video not found')
  }

  const video = await prisma.tikTokVideo.update({
    where: { id: parseInt(id) },
    data: {
      ...(title !== undefined && { title }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      ...(description !== undefined && { description }),
      ...(active !== undefined && { active }),
      ...(position !== undefined && { position }),
    },
  })

  return success(res, {
    video,
  })
})

/**
 * @desc    Delete TikTok video
 * @route   DELETE /api/tiktok-videos/:id
 * @access  Admin
 */
const deleteTikTokVideo = asyncHandler(async (req, res) => {
  const { id } = req.params

  const existing = await prisma.tikTokVideo.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('TikTok video not found')
  }

  await prisma.tikTokVideo.delete({
    where: { id: parseInt(id) },
  })

  return success(res, {
    message: 'TikTok video deleted successfully',
  })
})

module.exports = {
  getTikTokVideos,
  getActiveTikTokVideos,
  getTikTokVideoById,
  createTikTokVideo,
  updateTikTokVideo,
  deleteTikTokVideo,
}

