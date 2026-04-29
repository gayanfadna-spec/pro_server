const express = require('express');
const router = express.Router();
const {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    getFinishedGoods,
    createFinishedGood,
    updateFinishedGood,
    deleteFinishedGood,
    getDashboardStats,
    getPackingMaterials,
    createPackingMaterial,
    updatePackingMaterial,
    deletePackingMaterial,
    importRawMaterials,
    importPackingMaterials,
    importFinishedGoods
} = require('../controllers/inventoryController');

const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Stats Route
router.get('/stats', getDashboardStats);

// Raw Materials Routes
router.route('/raw-materials').get(getRawMaterials).post(protect, admin, createRawMaterial);
router.route('/raw-materials/import').post(protect, admin, upload.single('file'), importRawMaterials);
router.route('/raw-materials/:id').put(protect, admin, updateRawMaterial).delete(protect, admin, deleteRawMaterial);

// Finished Goods Routes
router.route('/finished-goods').get(getFinishedGoods).post(protect, admin, createFinishedGood);
router.route('/finished-goods/import').post(protect, admin, upload.single('file'), importFinishedGoods);
router.route('/finished-goods/:id').put(protect, admin, updateFinishedGood).delete(protect, admin, deleteFinishedGood);

// Packing Materials Routes
router.route('/packing-materials').get(getPackingMaterials).post(protect, admin, createPackingMaterial);
router.route('/packing-materials/import').post(protect, admin, upload.single('file'), importPackingMaterials);
router.route('/packing-materials/:id').put(protect, admin, updatePackingMaterial).delete(protect, admin, deletePackingMaterial);

module.exports = router;
