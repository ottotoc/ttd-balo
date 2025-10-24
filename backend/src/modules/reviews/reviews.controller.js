const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');
const { BadRequestError, NotFoundError } = require('../../common/errors');

// Get reviews for a product
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where = {
    productId: parseInt(productId),
    approved: true,
  };

  const [items, total, avgRating] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.review.count({ where }),
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      avgRating: avgRating._avg.rating || 0,
    },
  });
});

// Create review
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check if user already reviewed this product
  if (req.user) {
    const existing = await prisma.review.findFirst({
      where: {
        productId: parseInt(productId),
        userId: Number(req.user.sub),
      },
    });

    if (existing) {
      throw new BadRequestError('You have already reviewed this product');
    }
  }

  const review = await prisma.review.create({
    data: {
      productId: parseInt(productId),
      userId: req.user ? Number(req.user.sub) : null,
      rating,
      comment,
      approved: false, // Requires admin approval
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  success(res, review, 201);
});

// Get all reviews (Admin)
const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, approved } = req.query;

  const where = {};
  if (approved !== undefined) {
    where.approved = approved === 'true';
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.review.count({ where }),
  ]);

  paginated(res, items, total, pageNum, limitNum);
});

// Approve review (Admin)
const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.update({
    where: { id: parseInt(id) },
    data: { approved: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  });

  success(res, review);
});

// Delete review (Admin)
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.review.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Review deleted successfully' });
});

module.exports = {
  getProductReviews,
  createReview,
  getAllReviews,
  approveReview,
  deleteReview,
};

