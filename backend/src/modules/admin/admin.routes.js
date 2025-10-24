const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Brands
router.get('/brands', adminController.getBrands);
router.post('/brands', adminController.createBrand);
router.put('/brands/:id', adminController.updateBrand);
router.delete('/brands/:id', adminController.deleteBrand);

// Tags
router.get('/tags', adminController.getTags);
router.post('/tags', adminController.createTag);
router.put('/tags/:id', adminController.updateTag);
router.delete('/tags/:id', adminController.deleteTag);

// Banners
router.get('/banners', adminController.getBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);

// Blog posts
router.get('/blog', adminController.getBlogPosts);
router.get('/blog/:slug', adminController.getBlogPost);
router.post('/blog', adminController.createBlogPost);
router.put('/blog/:id', adminController.updateBlogPost);
router.delete('/blog/:id', adminController.deleteBlogPost);

module.exports = router;

