const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');
const { NotFoundError, BadRequestError } = require('../../common/errors');

// Get all products with filters and search
const getProducts = asyncHandler(async (req, res) => {
  const { 
    q, 
    category, 
    brand, 
    tag,
    minPrice, 
    maxPrice, 
    featured,
    section, // NEW: filter by display section
    page = 1, 
    limit = 20,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const where = { published: true };

  // Search query
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDesc: { contains: q } },
      { longDesc: { contains: q } },
      { sku: { contains: q } },
    ];
  }

  // Filter by category
  if (category) {
    where.category = { slug: category };
  }

  // Filter by brand
  if (brand) {
    where.brand = { slug: brand };
  }

  // Filter by tag
  if (tag) {
    where.tags = {
      some: {
        tag: { slug: tag }
      }
    };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Filter featured
  if (featured === 'true') {
    where.featured = true;
  }

  // NEW: Filter by display section
  if (section) {
    where.displaySections = {
      contains: section
    };
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  const orderBy = {};
  orderBy[sort] = order === 'asc' ? 'asc' : 'desc';

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
        tags: { include: { tag: true } },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.product.count({ where }),
  ]);

  // Parse displaySections JSON for each product
  const itemsWithSections = items.map(item => ({
    ...item,
    displaySections: item.displaySections ? JSON.parse(item.displaySections) : []
  }));

  paginated(res, itemsWithSections, total, pageNum, limitNum);
});

// Get single product by slug
const getProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      variants: true,
      tags: { include: { tag: true } },
      reviews: {
        where: { approved: true },
        include: {
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product || !product.published) {
    throw new NotFoundError('Product not found');
  }

  // Calculate average rating
  const avgRating = await prisma.review.aggregate({
    where: { productId: product.id, approved: true },
    _avg: { rating: true },
    _count: true,
  });

  // Parse displaySections
  const productWithSections = {
    ...product,
    displaySections: product.displaySections ? JSON.parse(product.displaySections) : []
  };

  success(res, {
    ...productWithSections,
    avgRating: avgRating._avg.rating || 0,
    reviewCount: avgRating._count,
  });
});

// Create product (Admin only)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    sku,
    shortDesc,
    longDesc,
    price,
    salePrice,
    stock,
    categoryId,
    brandId,
    images,
    variants,
    tags,
    featured,
    displaySections, // NEW
  } = req.body;

  if (!name || !sku || !price || !categoryId || !brandId) {
    throw new BadRequestError('Missing required fields');
  }

  // Convert displaySections array to JSON string
  const sectionsJson = displaySections && Array.isArray(displaySections) 
    ? JSON.stringify(displaySections) 
    : null;

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      sku,
      shortDesc,
      longDesc,
      price,
      salePrice: salePrice || null,
      stock: stock || 0,
      categoryId,
      brandId,
      featured: featured || false,
      displaySections: sectionsJson,
      images: images ? {
        create: images.map((img, idx) => ({
          url: img.url,
          isPrimary: idx === 0,
          position: idx,
        }))
      } : undefined,
      variants: variants ? {
        create: variants
      } : undefined,
      tags: tags ? {
        create: tags.map(tagId => ({ tagId }))
      } : undefined,
    },
    include: {
      images: true,
      variants: true,
      tags: { include: { tag: true } },
    },
  });

  // Parse displaySections for response
  const productWithSections = {
    ...product,
    displaySections: product.displaySections ? JSON.parse(product.displaySections) : []
  };

  success(res, productWithSections, 201);
});

// Update product (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images, ...updateData } = req.body;

  // Convert displaySections array to JSON string if provided
  if (updateData.displaySections && Array.isArray(updateData.displaySections)) {
    updateData.displaySections = JSON.stringify(updateData.displaySections);
  }

  // Xử lý cập nhật images nếu có
  if (images && Array.isArray(images)) {
    // Xóa images cũ và tạo mới
    await prisma.productImage.deleteMany({
      where: { productId: parseInt(id) },
    });
    
    updateData.images = {
      create: images.map((img, idx) => ({
        url: img.url,
        isPrimary: idx === 0,
        position: idx,
      }))
    };
  }

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      images: true,
      variants: true,
      tags: { include: { tag: true } },
    },
  });

  // Parse displaySections for response
  const productWithSections = {
    ...product,
    displaySections: product.displaySections ? JSON.parse(product.displaySections) : []
  };

  success(res, productWithSections);
});

// Delete product (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if product exists first
  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingProduct) {
    return error(res, 'Product not found', 404);
  }

  await prisma.product.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
