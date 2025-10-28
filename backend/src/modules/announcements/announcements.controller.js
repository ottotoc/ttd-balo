const { PrismaClient } = require('@prisma/client')
const asyncHandler = require('../../common/asyncHandler')
const { success } = require('../../common/response')
const { NotFoundError, BadRequestError } = require('../../common/errors')

const prisma = new PrismaClient()

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Public
 */
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { position: 'asc' },
  })

  return success(res, {
    announcements,
  })
})

/**
 * @desc    Get active announcements (for frontend)
 * @route   GET /api/announcements/active
 * @access  Public
 */
const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { position: 'asc' },
  })

  return success(res, {
    announcements,
  })
})

/**
 * @desc    Get announcement by ID
 * @route   GET /api/announcements/:id
 * @access  Admin
 */
const getAnnouncementById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const announcement = await prisma.announcement.findUnique({
    where: { id: parseInt(id) },
  })

  if (!announcement) {
    throw new NotFoundError('Announcement not found')
  }

  return success(res, {
    announcement,
  })
})

/**
 * @desc    Create announcement
 * @route   POST /api/announcements
 * @access  Admin
 */
const createAnnouncement = asyncHandler(async (req, res) => {
  const { text, active, position } = req.body

  if (!text) {
    throw new BadRequestError('Text is required')
  }

  const announcement = await prisma.announcement.create({
    data: {
      text,
      active: active !== undefined ? active : true,
      position: position !== undefined ? position : 0,
    },
  })

  return success(res, {
    announcement,
  }, 201)
})

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Admin
 */
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { text, active, position } = req.body

  const existing = await prisma.announcement.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('Announcement not found')
  }

  const announcement = await prisma.announcement.update({
    where: { id: parseInt(id) },
    data: {
      ...(text !== undefined && { text }),
      ...(active !== undefined && { active }),
      ...(position !== undefined && { position }),
    },
  })

  return success(res, {
    announcement,
  })
})

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Admin
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params

  const existing = await prisma.announcement.findUnique({
    where: { id: parseInt(id) },
  })

  if (!existing) {
    throw new NotFoundError('Announcement not found')
  }

  await prisma.announcement.delete({
    where: { id: parseInt(id) },
  })

  return success(res, {
    message: 'Announcement deleted successfully',
  })
})

module.exports = {
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}

