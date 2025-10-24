const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success, paginated } = require('../../common/response');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../common/errors');
const { getOrCreateCart } = require('../../utils/cart');

// Create order from cart (checkout)
const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    shippingFee = 0,
    vatPercent = 10,
    discountCode,
    notes,
    bankRef,
  } = req.body;

  if (!shippingAddress) {
    throw new BadRequestError('Shipping address is required');
  }

  if (!paymentMethod || !['COD', 'BANK_TRANSFER'].includes(paymentMethod)) {
    throw new BadRequestError('Invalid payment method');
  }

  // Get cart
  const cart = await getOrCreateCart(req, res);
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: { include: { images: true } },
      variant: true,
    },
  });

  if (cartItems.length === 0) {
    throw new BadRequestError('Cart is empty');
  }

  // Calculate subtotal
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += Number(item.price) * item.quantity;
  });

  // Apply discount if provided
  let discountTotal = 0;
  if (discountCode) {
    const discount = await prisma.discount.findUnique({
      where: { code: discountCode },
      include: {
        products: true,
        categories: true,
      },
    });

    if (discount && discount.active) {
      const now = new Date();
      const isValid = 
        (!discount.startAt || discount.startAt <= now) &&
        (!discount.endAt || discount.endAt >= now) &&
        (!discount.usageLimit || discount.used < discount.usageLimit);

      if (isValid) {
        // Check minimum order
        if (!discount.minOrder || subtotal >= Number(discount.minOrder)) {
          // Filter eligible items
          const scopeProductIds = new Set(discount.products.map(p => p.productId));
          const scopeCategoryIds = new Set(discount.categories.map(c => c.categoryId));

          const eligibleItems = cartItems.filter(item => {
            if (scopeProductIds.size === 0 && scopeCategoryIds.size === 0) return true;
            return scopeProductIds.has(item.productId) || scopeCategoryIds.has(item.product.categoryId);
          });

          const eligibleTotal = eligibleItems.reduce((sum, item) => {
            return sum + (Number(item.price) * item.quantity);
          }, 0);

          if (discount.type === 'PERCENT') {
            discountTotal = Math.floor(eligibleTotal * discount.value / 100);
          } else {
            discountTotal = discount.value;
          }

          // Increment usage
          await prisma.discount.update({
            where: { id: discount.id },
            data: { used: { increment: 1 } },
          });
        }
      }
    }
  }

  // Calculate VAT and total
  const shippingFeeNum = Number(shippingFee);
  const vatAmount = Math.floor((subtotal - discountTotal + shippingFeeNum) * vatPercent / 100);
  const total = subtotal - discountTotal + shippingFeeNum + vatAmount;

  // Create order
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: req.user ? Number(req.user.sub) : null,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        bankRef: paymentMethod === 'BANK_TRANSFER' ? bankRef : null,
        shippingAddress,
        shippingFee: shippingFeeNum,
        vatPercent,
        vatAmount,
        subtotal,
        discountTotal,
        total,
        notes,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            sku: item.variant?.sku || item.product.sku,
            attributes: item.variant ? {
              color: item.variant.color,
              size: item.variant.size,
            } : null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  success(res, order, 201);
});

// Get user's orders
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const where = {};
  
  // Regular users can only see their own orders
  if (req.user.role !== 'ADMIN') {
    where.userId = Number(req.user.sub);
  }

  if (status) {
    where.status = status;
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.order.count({ where }),
  ]);

  paginated(res, items, total, pageNum, limitNum);
});

// Get single order
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: true,
      user: {
        select: { id: true, email: true, name: true, phone: true },
      },
    },
  });

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Regular users can only view their own orders
  if (req.user.role !== 'ADMIN' && order.userId !== Number(req.user.sub)) {
    throw new ForbiddenError('Access denied');
  }

  success(res, order);
});

// Update order status (Admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const validStatuses = [
    'PENDING',
    'AWAITING_CONFIRMATION',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
  ];

  if (!validStatuses.includes(status)) {
    throw new BadRequestError('Invalid status');
  }

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      status,
      adminNotes,
    },
    include: {
      items: true,
    },
  });

  // Emit socket event for realtime update
  const io = req.app.get('io');
  if (io) {
    io.emit('order.status', {
      orderId: order.id,
      status: order.status,
    });
  }

  success(res, order);
});

// Confirm payment (Admin only) - This is when stock is deducted
const confirmPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.paymentStatus === 'PAID') {
    throw new BadRequestError('Order already paid');
  }

  // Deduct stock in transaction
  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (item.variantId) {
        // Deduct from variant
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new NotFoundError(`Variant ${item.variantId} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${item.name}. Available: ${variant.stock}, Required: ${item.quantity}`
          );
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Emit stock update
        const io = req.app.get('io');
        if (io) {
          io.emit('stock.update', {
            productId: item.productId,
            variantId: item.variantId,
            stock: variant.stock - item.quantity,
          });
        }
      } else {
        // Deduct from product
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundError(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${item.name}. Available: ${product.stock}, Required: ${item.quantity}`
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        // Emit stock update
        const io = req.app.get('io');
        if (io) {
          io.emit('stock.update', {
            productId: item.productId,
            stock: product.stock - item.quantity,
          });
        }
      }
    }

    // Update order payment status
    await tx.order.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus: 'PAID',
        status: 'AWAITING_CONFIRMATION',
      },
    });
  });

  const updatedOrder = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });

  // Emit order status update
  const io = req.app.get('io');
  if (io) {
    io.emit('order.status', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
    });
  }

  success(res, updatedOrder);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  confirmPayment,
};

