// Socket.IO client for real-time updates
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create socket connection
const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false, // Manual connection control
});

// Connection status
let isConnected = false;

socket.on('connect', () => {
  if (import.meta.env.DEV) {
    console.log('Socket connected:', socket.id);
  }
  isConnected = true;
});

socket.on('disconnect', () => {
  if (import.meta.env.DEV) {
    console.log('Socket disconnected');
  }
  isConnected = false;
});

socket.on('connect_error', (error) => {
  // Keep error logging for production debugging
  console.error('Socket connection error:', error);
});

// Helper functions
export const socketClient = {
  connect: () => {
    if (!isConnected) {
      socket.connect();
    }
  },
  
  disconnect: () => {
    if (isConnected) {
      socket.disconnect();
    }
  },
  
  isConnected: () => isConnected,
  
  // Join rooms
  joinOrder: (orderId) => {
    socket.emit('join:order', orderId);
  },
  
  leaveOrder: (orderId) => {
    socket.emit('leave:order', orderId);
  },
  
  joinProduct: (productId) => {
    socket.emit('join:product', productId);
  },
  
  leaveProduct: (productId) => {
    socket.emit('leave:product', productId);
  },
  
  // Event listeners
  onStockUpdate: (callback) => {
    socket.on('stock.update', callback);
    return () => socket.off('stock.update', callback);
  },
  
  onOrderStatus: (callback) => {
    socket.on('order.status', callback);
    return () => socket.off('order.status', callback);
  },
  
  // Generic event listener
  on: (event, callback) => {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  },
  
  off: (event, callback) => {
    socket.off(event, callback);
  },
};

export default socketClient;

