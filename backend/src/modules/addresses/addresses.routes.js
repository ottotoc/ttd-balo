const express = require('express');
const router = express.Router();
const addressesController = require('./addresses.controller');

// Public routes - no authentication required
router.get('/provinces', addressesController.getProvinces);
router.get('/provinces/:provinceCode/districts', addressesController.getDistricts);
router.get('/districts/:districtCode/wards', addressesController.getWards);

module.exports = router;

