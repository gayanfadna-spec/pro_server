const RawMaterial = require('../models/RawMaterial');
const FinishedGood = require('../models/FinishedGood');
const PackingMaterial = require('../models/PackingMaterial');

// === RAW MATERIALS ===

// @desc    Get all raw materials
// @route   GET /api/inventory/raw-materials
const getRawMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({});
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create raw material
// @route   POST /api/inventory/raw-materials
const createRawMaterial = async (req, res) => {
    try {
        const material = new RawMaterial(req.body);
        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update raw material
// @route   PUT /api/inventory/raw-materials/:id
const updateRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMaterial = await RawMaterial.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete raw material
// @route   DELETE /api/inventory/raw-materials/:id
const deleteRawMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMaterial = await RawMaterial.findByIdAndDelete(id);
        if (!deletedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// === PACKING MATERIALS ===

// @desc    Get all packing materials
// @route   GET /api/inventory/packing-materials
const getPackingMaterials = async (req, res) => {
    try {
        const materials = await PackingMaterial.find({});
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create packing material
// @route   POST /api/inventory/packing-materials
const createPackingMaterial = async (req, res) => {
    try {
        const material = new PackingMaterial(req.body);
        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update packing material
// @route   PUT /api/inventory/packing-materials/:id
const updatePackingMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMaterial = await PackingMaterial.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete packing material
// @route   DELETE /api/inventory/packing-materials/:id
const deletePackingMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMaterial = await PackingMaterial.findByIdAndDelete(id);
        if (!deletedMaterial) return res.status(404).json({ message: 'Material not found' });
        res.json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// === FINISHED GOODS ===

// @desc    Get all finished goods
// @route   GET /api/inventory/finished-goods
const getFinishedGoods = async (req, res) => {
    try {
        const goods = await FinishedGood.find({});
        res.json(goods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create finished good
// @route   POST /api/inventory/finished-goods
const createFinishedGood = async (req, res) => {
    try {
        const good = new FinishedGood(req.body);
        const savedGood = await good.save();
        res.status(201).json(savedGood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update finished good
// @route   PUT /api/inventory/finished-goods/:id
const updateFinishedGood = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGood = await FinishedGood.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedGood) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedGood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete finished good
// @route   DELETE /api/inventory/finished-goods/:id
const deleteFinishedGood = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete associated recipe first
        const Recipe = require('../models/Recipe');
        await Recipe.deleteOne({ finishedGoodId: id });

        const deletedGood = await FinishedGood.findByIdAndDelete(id);
        if (!deletedGood) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/inventory/stats
const getDashboardStats = async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find({});
        const finishedGoods = await FinishedGood.find({});
        const packingMaterials = await PackingMaterial.find({});

        res.json({
            rawMaterialCount: rawMaterials.length,
            finishedGoodCount: finishedGoods.length,
            packingMaterialCount: packingMaterials.length,
            rawMaterials,
            finishedGoods,
            packingMaterials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
    deletePackingMaterial
};
