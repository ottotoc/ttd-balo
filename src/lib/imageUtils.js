// Utility functions for handling image URLs
import { API_URL } from './api';

/**
 * Convert relative image URL to full URL
 * @param {string} imageUrl - Relative URL (e.g., "/uploads/filename.webp") or full URL
 * @param {string} version - Image version: 'web' (1920px), 'dashboard' (800px), 'thumbnail' (300px)
 * @returns {string} Full URL
 */
export function getImageUrl(imageUrl, version = 'web') {
  // Nếu không có URL, trả về null (để component tự xử lý placeholder)
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative path starts with /uploads, đây là ảnh từ backend
  // Format: /uploads/{category}/{filename} hoặc /uploads/{filename} (legacy)
  if (imageUrl.startsWith('/uploads/')) {
    // Parse path: /uploads/{category}/{filename} hoặc /uploads/{filename}
    const pathParts = imageUrl.replace('/uploads/', '').split('/');
    let category = '';
    let filename = '';
    
    // Check if first part is a known category
    const knownCategories = ['projects', 'blog', 'banners', 'general'];
    if (pathParts.length > 1 && knownCategories.includes(pathParts[0])) {
      // Có category: /uploads/{category}/{filename}
      category = pathParts[0];
      filename = pathParts.slice(1).join('/');
    } else {
      // Legacy format: /uploads/{filename} - không có category
      // Hoặc category không được nhận diện
      filename = pathParts.join('/');
      // Thử đoán category từ context (nếu có thể)
      // Nhưng tốt nhất là giữ nguyên format
    }
    
    const fileExt = filename.match(/\.(webp|jpg|jpeg|png|gif)$/i)?.[1]?.toLowerCase();
    const fileNameWithoutExt = filename.replace(/\.(webp|jpg|jpeg|png|gif)$/i, '');
    
    // Nếu đã có _dashboard hoặc _thumb trong tên, giữ nguyên (có thể đã có category)
    if (filename.includes('_dashboard') || filename.includes('_thumb')) {
      return `${API_URL}${imageUrl}`;
    }
    
    // Xác định URL cuối cùng dựa trên version
    const categoryPrefix = category ? `${category}/` : '';
    let finalUrl = imageUrl; // Mặc định dùng file gốc
    
    if (version === 'thumbnail') {
      // Thumbnail luôn là _thumb.jpg
      finalUrl = `/uploads/${categoryPrefix}${fileNameWithoutExt}_thumb.jpg`;
    } else if (version === 'dashboard') {
      // Dashboard version: ưu tiên _dashboard.webp, fallback về file gốc
      finalUrl = `/uploads/${categoryPrefix}${fileNameWithoutExt}_dashboard.webp`;
    } else {
      // Web version: ưu tiên .webp, nhưng fallback về file gốc nếu chưa có
      if (fileExt && fileExt !== 'webp') {
        // File gốc là .png/.jpg, thử dùng .webp version (nếu có)
        // Nếu không có sẽ fallback về file gốc trong onError handler
        finalUrl = `/uploads/${categoryPrefix}${fileNameWithoutExt}.webp`;
      } else if (!fileExt) {
        // Nếu không có extension, thêm .webp
        finalUrl = `/uploads/${categoryPrefix}${fileNameWithoutExt}.webp`;
      }
      // Nếu đã là .webp rồi, giữ nguyên
    }
    
    return `${API_URL}${finalUrl}`;
  }

  // If relative path starts with /images, đây là local asset - giữ nguyên
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  // Nếu path bắt đầu với / nhưng không phải /uploads hoặc /images, giữ nguyên
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // Otherwise, assume it's a filename from uploads (không có /uploads/ prefix)
  return `${API_URL}/uploads/${imageUrl}`;
}

/**
 * Get multiple image URLs
 * @param {Array} images - Array of image objects with url property
 * @returns {Array} Array of full URLs
 */
export function getImageUrls(images) {
  if (!images || !Array.isArray(images)) {
    return [];
  }
  return images.map(img => getImageUrl(img.url || img));
}

