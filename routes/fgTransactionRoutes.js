const express = require('express');
const router = express.Router();
const {
    logProduction,
    logDispatch,
    getProductions,
    getDispatches
} = require('../controllers/fgTransactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/production')
    .get(protect, getProductions)
    .post(protect, logProduction);

router.route('/dispatch')
    .get(protect, getDispatches)
    .post(protect, logDispatch);

module.exports = router;
