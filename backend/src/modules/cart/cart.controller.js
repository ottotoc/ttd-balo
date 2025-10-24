const prisma = require('../../config/database');
const asyncHandler = require('../../common/asyncHandler');
const { success } = require('../../common/response');
const { BadRequestError, NotFoundError } = require('../../common/errors');
const { getOrCreateCart } = require('../../utils/cart');

// Get current cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req, res);
  
  // Calculate totals
  let subtotal = 0;
  const itemsWithDetails = cart.items.map(item => {
    const itemTotal = Number(item.price) * item.quantity;
    subtotal += itemTotal;
    return {
      ...item,
      itemTotal,
    };
  });

  success(res, {
    ...cart,
    items: itemsWithDetails,
    subtotal,
  });
});

// Add item to cart
const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  if (!productId) {
    throw new BadRequestError('Product ID is required');
  }

  if (quantity < 1) {
    throw new BadRequestError('Quantity must be at least 1');
  }

  const cart = await getOrCreateCart(req, res);

  // Get product details
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { variants: true },
  });

  if (!product || !product.published) {
    throw new NotFoundError('Product not found');
  }

  // Determine price and stock
  let price = product.price;
  let availableStock = product.stock;

  if (variantId) {
    const variant = product.variants.find(v => v.id === parseInt(variantId));
    if (!variant) {
      throw new NotFoundError('Variant not found');
    }
    price = variant.price || product.price;
    availableStock = variant.stock;
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: parseInt(productId),
      variantId: variantId ? parseInt(variantId) : null,
    },
  });

  let item;

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    
    if (newQuantity > availableStock) {
      throw new BadRequestError(`Only ${availableStock} items available in stock`);
    }

    item = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        product: { include: { images: true } },
        variant: true,
      },
    });
  } else {
    // Create new cart item
    if (quantity > availableStock) {
      throw new BadRequestError(`Only ${availableStock} items available in stock`);
    }

    item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        variantId: variantId ? parseInt(variantId) : null,
        quantity,
        price,
      },
      include: {
        product: { include: { images: true } },
        variant: true,
      },
    });
  }

  success(res, item, 201);
});

// Update cart item quantity
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new BadRequestError('Quantity must be at least 1');
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: parseInt(id) },
    include: { product: true, variant: true },
  });

  if (!item) {
    throw new NotFoundError('Cart item not found');
  }

  // Check stock
  const availableStock = item.variant ? item.variant.stock : item.product.stock;
  if (quantity > availableStock) {
    throw new BadRequestError(`Only ${availableStock} items available in stock`);
  }

  const updated = await prisma.cartItem.update({
    where: { id: parseInt(id) },
    data: { quantity },
    include: {
      product: { include: { images: true } },
      variant: true,
    },
  });

  success(res, updated);
});

// Remove item from cart
const removeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.cartItem.delete({
    where: { id: parseInt(id) },
  });

  success(res, { message: 'Item removed from cart' });
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req, res);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  success(res, { message: 'Cart cleared' });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};

