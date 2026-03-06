const express = require('express');
const router = express.Router();
const { getGRNs, createGRN } = require('../controllers/grnController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getGRNs)
    .post(protect, createGRN);

module.exports = router;
