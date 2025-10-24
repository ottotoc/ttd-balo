const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');
const { BadRequestError, NotFoundError } = require('../../common/errors');

// ========== CATEGORIES ==========
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { position: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  success(res, categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, imageUrl, position } = req.body;

  if (!name) {
    throw new BadRequestError('Name is required');
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      imageUrl,
      position: position || 0,
    },
  });

  success(res, category, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  success(res, category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.category.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Category deleted successfully' });
});

// ========== BRANDS ==========
const getBrands = asyncHandler(async (req, res) => {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  success(res, brands);
});

const createBrand = asyncHandler(async (req, res) => {
  const { name, slug, imageUrl } = req.body;

  if (!name) {
    throw new BadRequestError('Name is required');
  }

  const brand = await prisma.brand.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      imageUrl,
    },
  });

  success(res, brand, 201);
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const brand = await prisma.brand.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  success(res, brand);
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.brand.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Brand deleted successfully' });
});

// ========== TAGS ==========
const getTags = asyncHandler(async (req, res) => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  success(res, tags);
});

const createTag = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;

  if (!name) {
    throw new BadRequestError('Name is required');
  }

  const tag = await prisma.tag.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    },
  });

  success(res, tag, 201);
});

const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const tag = await prisma.tag.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  success(res, tag);
});

const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.tag.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Tag deleted successfully' });
});

// ========== BANNERS ==========
const getBanners = asyncHandler(async (req, res) => {
  const { position, active } = req.query;

  const where = {};
  if (position) where.position = position;
  if (active !== undefined) where.active = active === 'true';

  const banners = await prisma.banner.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  success(res, banners);
});

const createBanner = asyncHandler(async (req, res) => {
  const { title, imageUrl, link, position, active, order } = req.body;

  if (!imageUrl) {
    throw new BadRequestError('Image URL is required');
  }

  const banner = await prisma.banner.create({
    data: {
      title,
      imageUrl,
      link,
      position: position || 'hero',
      active: active !== false,
      order: order || 0,
    },
  });

  success(res, banner, 201);
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const banner = await prisma.banner.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  success(res, banner);
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.banner.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Banner deleted successfully' });
});

// ========== BLOG POSTS ==========
const getBlogPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, published } = req.query;

  const where = {};
  if (published !== undefined) {
    where.published = published === 'true';
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.blogPost.count({ where }),
  ]);

  paginated(res, items, total, pageNum, limitNum);
});

const getBlogPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    throw new NotFoundError('Blog post not found');
  }

  success(res, post);
});

const createBlogPost = asyncHandler(async (req, res) => {
  const { title, slug, excerpt, content, coverUrl, published } = req.body;

  if (!title) {
    throw new BadRequestError('Title is required');
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      excerpt,
      content,
      coverUrl,
      published: published || false,
    },
  });

  success(res, post, 201);
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const post = await prisma.blogPost.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  success(res, post);
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.blogPost.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Blog post deleted successfully' });
});

module.exports = {
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Brands
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  // Tags
  getTags,
  createTag,
  updateTag,
  deleteTag,
  // Banners
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  // Blog
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};

