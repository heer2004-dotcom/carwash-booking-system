const express = require('express');
const { getPackages, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPackages).post(protect, admin, createPackage);
router.route('/:id').put(protect, admin, updatePackage).delete(protect, admin, deletePackage);

module.exports = router;
