const express = require('express');
const router = express.Router();
const publicController = require('./public.controller');

// Public catalog data
router.get('/categories', publicController.getCategories);
router.get('/brands', publicController.getBrands);
router.get('/tags', publicController.getTags);
router.get('/banners', publicController.getBanners);
router.get('/blog', publicController.getBlogPosts);
router.get('/blog/:slug', publicController.getBlogPost);

module.exports = router;

