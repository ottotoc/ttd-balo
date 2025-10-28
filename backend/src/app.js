require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { PORT, CORS_ORIGIN } = require('./config/env');
const errorHandler = require('./common/errorHandler');

// Create Express app
const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

// Make io accessible in routes
app.set('io', io);

// Middlewares
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/cart', require('./modules/cart/cart.routes'));
app.use('/api/orders', require('./modules/orders/orders.routes'));
app.use('/api/discounts', require('./modules/discounts/discounts.routes'));
app.use('/api/reviews', require('./modules/reviews/reviews.routes'));
app.use('/api/announcements', require('./modules/announcements/announcements.routes'));
app.use('/api/tiktok-videos', require('./modules/tiktok/tiktok.routes'));
app.use('/api/blog', require('./modules/blog/blog.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));
app.use('/api/uploads', require('./modules/uploads/uploads.routes'));
app.use('/api', require('./modules/public/public.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Join room for order updates (for users tracking their orders)
  socket.on('join:order', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Client ${socket.id} joined order room: ${orderId}`);
  });

  // Join room for product updates (for users viewing a product)
  socket.on('join:product', (productId) => {
    socket.join(`product:${productId}`);
    console.log(`Client ${socket.id} joined product room: ${productId}`);
  });

  // Leave rooms
  socket.on('leave:order', (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  socket.on('leave:product', (productId) => {
    socket.leave(`product:${productId}`);
  });
});

// Broadcast helpers (can be used from controllers)
app.set('broadcastStockUpdate', (productId, variantId, stock) => {
  io.to(`product:${productId}`).emit('stock.update', {
    productId,
    variantId,
    stock,
  });
  // Also broadcast to all clients
  io.emit('stock.update', { productId, variantId, stock });
});

app.set('broadcastOrderUpdate', (orderId, status, paymentStatus) => {
  io.to(`order:${orderId}`).emit('order.status', {
    orderId,
    status,
    paymentStatus,
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎒 TTD Balo Backend API Server                     ║
║                                                       ║
║   Port:        ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║   CORS:        ${CORS_ORIGIN.join(', ')}               
║                                                       ║
║   Endpoints:                                          ║
║   • GET  /health                                      ║
║   • POST /api/auth/register                           ║
║   • POST /api/auth/login                              ║
║   • GET  /api/products                                ║
║   • GET  /api/cart                                    ║
║   • POST /api/orders                                  ║
║   • GET  /api/categories                              ║
║   • GET  /api/brands                                  ║
║   • GET  /api/banners                                 ║
║   • GET  /api/blog                                    ║
║                                                       ║
║   Socket.IO: Enabled                                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;

