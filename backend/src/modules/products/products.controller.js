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
  const { 
    images, 
    variants, 
    categoryId, 
    brandId,
    displaySections,
    ...restData 
  } = req.body;

  // Tạo updateData object, chỉ copy các field hợp lệ từ req.body
  const updateData = {};
  
  // Chỉ copy các field hợp lệ, loại bỏ categoryId, brandId, variants, images, displaySections
  const allowedFields = ['name', 'slug', 'sku', 'price', 'salePrice', 'stock', 'shortDesc', 'description', 'longDesc', 'featured', 'published'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (field === 'price' || field === 'salePrice') {
        updateData[field] = req.body[field] !== null ? parseFloat(req.body[field]) : null;
      } else if (field === 'stock') {
        updateData[field] = parseInt(req.body[field]);
      } else if (field === 'featured' || field === 'published') {
        updateData[field] = !!req.body[field];
      } else {
        updateData[field] = req.body[field];
      }
    }
  });

  // Convert displaySections array to JSON string if provided
  if (displaySections !== undefined) {
    if (Array.isArray(displaySections) && displaySections.length > 0) {
      updateData.displaySections = JSON.stringify(displaySections);
    } else {
      updateData.displaySections = null;
    }
  }

  // Xử lý categoryId và brandId - dùng connect thay vì truyền trực tiếp
  if (categoryId !== undefined && categoryId !== null) {
    updateData.category = {
      connect: { id: parseInt(categoryId) }
    };
  }

  if (brandId !== undefined && brandId !== null) {
    updateData.brand = {
      connect: { id: parseInt(brandId) }
    };
  }

  // Xử lý cập nhật images nếu có
  if (images && Array.isArray(images)) {
    // Xóa images cũ trước
    await prisma.productImage.deleteMany({
      where: { productId: parseInt(id) },
    });
    
    // Tạo images mới
    updateData.images = {
      create: images.map((img, idx) => ({
        url: img.url,
        isPrimary: idx === 0,
        position: idx,
      }))
    };
  }

  // Xử lý cập nhật variants nếu có - XỬ LÝ TRƯỚC KHI THÊM VÀO updateData
  let variantsToCreate = null;
  if (variants !== undefined) {
    // Xóa variants cũ trước
    await prisma.productVariant.deleteMany({
      where: { productId: parseInt(id) },
    });
    
    // Tạo variants mới nếu có
    if (Array.isArray(variants) && variants.length > 0) {
      variantsToCreate = {
        create: variants.map(v => ({
          color: v.color || null,
          size: v.size || null,
          sku: v.sku || null,
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock) || 0,
        }))
      };
    }
    // Nếu variants là mảng rỗng, chỉ cần deleteMany (đã làm ở trên)
  }

  // Tạo finalUpdateData - chỉ chứa các field hợp lệ
  const finalUpdateData = { ...updateData };
  
  // Đảm bảo loại bỏ hoàn toàn categoryId, brandId
  delete finalUpdateData.categoryId;
  delete finalUpdateData.brandId;
  
  // Thêm variants nếu đã được xử lý đúng cách
  if (variantsToCreate) {
    finalUpdateData.variants = variantsToCreate;
  }

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: finalUpdateData,
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
