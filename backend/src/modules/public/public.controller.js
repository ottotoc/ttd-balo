const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');

// Get public categories (for navigation)
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { position: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: { products: { where: { published: true } } },
      },
    },
  });

  success(res, categories);
});

// Get public brands
const getBrands = asyncHandler(async (req, res) => {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: { products: { where: { published: true } } },
      },
    },
  });

  success(res, brands);
});

// Get public tags
const getTags = asyncHandler(async (req, res) => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  success(res, tags);
});

// Get public banners
const getBanners = asyncHandler(async (req, res) => {
  const { position } = req.query;

  const where = { active: true };
  if (position) where.position = position;

  const banners = await prisma.banner.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  success(res, banners);
});

// Get published blog posts
const getBlogPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  paginated(res, items, total, pageNum, limitNum);
});

// Get single blog post
const getBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    throw new NotFoundError('Blog post not found');
  }

  success(res, post);
});

module.exports = {
  getCategories,
  getBrands,
  getTags,
  getBanners,
  getBlogPosts,
  getBlogPost,
};

