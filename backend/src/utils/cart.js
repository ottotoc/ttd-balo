const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/database');

// Get or create cart for current request (guest or user)
async function getOrCreateCart(req, res) {
  // If user is authenticated, find/create cart by userId
  if (req.user) {
    let cart = await prisma.cart.findFirst({
      where: { userId: Number(req.user.sub) },
      include: { 
        items: { 
          include: { 
            product: { 
              include: { images: true, category: true, brand: true } 
            }, 
            variant: true 
          } 
        } 
      },
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: Number(req.user.sub) },
        include: { 
          items: { 
            include: { 
              product: { 
                include: { images: true, category: true, brand: true } 
              }, 
              variant: true 
            } 
          } 
        },
      });
    }
    
    return cart;
  }

  // Guest cart - use sessionId cookie
  let sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  let cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: { 
      items: { 
        include: { 
          product: { 
            include: { images: true, category: true, brand: true } 
          }, 
          variant: true 
        } 
      } 
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: { 
        items: { 
          include: { 
            product: { 
              include: { images: true, category: true, brand: true } 
            }, 
            variant: true 
          } 
        } 
      },
    });
  }

  return cart;
}

// Merge guest cart into user cart when user logs in
async function mergeGuestCart(sessionId, userId) {
  const guestCart = await prisma.cart.findFirst({
    where: { sessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    return;
  }

  let userCart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!userCart) {
    // Convert guest cart to user cart
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId, sessionId: null },
    });
  } else {
    // Merge items
    for (const item of guestCart.items) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });
  }
}

module.exports = { getOrCreateCart, mergeGuestCart };

