const express = require('express');
const router = express.Router();
const { getPackingGRNs, createPackingGRN } = require('../controllers/packingGRNController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPackingGRNs)
    .post(protect, admin, createPackingGRN);

module.exports = router;
