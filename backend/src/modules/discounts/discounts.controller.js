const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');
const { BadRequestError, NotFoundError } = require('../../common/errors');

// Validate discount code
const validateDiscount = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;

  if (!code) {
    throw new BadRequestError('Discount code is required');
  }

  const discount = await prisma.discount.findUnique({
    where: { code },
    include: {
      products: { include: { product: true } },
      categories: { include: { category: true } },
    },
  });

  if (!discount) {
    throw new NotFoundError('Invalid discount code');
  }

  if (!discount.active) {
    throw new BadRequestError('This discount code is no longer active');
  }

  const now = new Date();
  
  if (discount.startAt && discount.startAt > now) {
    throw new BadRequestError('This discount code is not yet valid');
  }

  if (discount.endAt && discount.endAt < now) {
    throw new BadRequestError('This discount code has expired');
  }

  if (discount.usageLimit && discount.used >= discount.usageLimit) {
    throw new BadRequestError('This discount code has reached its usage limit');
  }

  if (discount.minOrder && cartTotal < Number(discount.minOrder)) {
    throw new BadRequestError(
      `Minimum order of ${discount.minOrder} VND required for this discount`
    );
  }

  success(res, {
    valid: true,
    discount: {
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minOrder: discount.minOrder,
      products: discount.products.map(p => p.product),
      categories: discount.categories.map(c => c.category),
    },
  });
});

// Get all discounts (Admin)
const getDiscounts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, active } = req.query;

  const where = {};
  if (active !== undefined) {
    where.active = active === 'true';
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.discount.findMany({
      where,
      include: {
        products: { include: { product: { select: { id: true, name: true } } } },
        categories: { include: { category: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.discount.count({ where }),
  ]);

  paginated(res, items, total, pageNum, limitNum);
});

// Create discount (Admin)
const createDiscount = asyncHandler(async (req, res) => {
  const {
    code,
    type,
    value,
    minOrder,
    startAt,
    endAt,
    usageLimit,
    active,
    productIds,
    categoryIds,
  } = req.body;

  if (!code || !type || value === undefined) {
    throw new BadRequestError('Code, type, and value are required');
  }

  if (!['PERCENT', 'FIXED'].includes(type)) {
    throw new BadRequestError('Type must be PERCENT or FIXED');
  }

  if (type === 'PERCENT' && (value < 0 || value > 100)) {
    throw new BadRequestError('Percent value must be between 0 and 100');
  }

  const discount = await prisma.discount.create({
    data: {
      code: code.toUpperCase(),
      type,
      value,
      minOrder: minOrder ? parseFloat(minOrder) : null,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      active: active !== false,
      products: productIds?.length ? {
        create: productIds.map(id => ({ productId: parseInt(id) })),
      } : undefined,
      categories: categoryIds?.length ? {
        create: categoryIds.map(id => ({ categoryId: parseInt(id) })),
      } : undefined,
    },
    include: {
      products: { include: { product: true } },
      categories: { include: { category: true } },
    },
  });

  success(res, discount, 201);
});

// Update discount (Admin)
const updateDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { productIds, categoryIds, ...updateData } = req.body;

  // Update basic fields
  const discount = await prisma.discount.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      products: { include: { product: true } },
      categories: { include: { category: true } },
    },
  });

  success(res, discount);
});

// Delete discount (Admin)
const deleteDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.discount.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Discount deleted successfully' });
});

module.exports = {
  validateDiscount,
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};

