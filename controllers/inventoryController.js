const RawMaterial = require('../models/RawMaterial');
const FinishedGood = require('../models/FinishedGood');
const PackingMaterial = require('../models/PackingMaterial');
const xlsx = require('xlsx');

// === RAW MATERIALS ===

// @desc    Get all raw materials
// @route   GET /api/inventory/raw-materials
const getRawMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({}).sort({ updatedAt: -1 });
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
        const materials = await PackingMaterial.find({}).sort({ updatedAt: -1 });
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
        const goods = await FinishedGood.find({}).sort({ updatedAt: -1 });
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

// @desc    Import raw materials from Excel
// @route   POST /api/inventory/raw-materials/import
const importRawMaterials = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let updatedCount = 0;
        let createdCount = 0;
        let skippedCount = 0;

        for (const row of data) {
            // Normalize keys to lowercase for easier mapping
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase().trim()] = row[key];
            });

            const code = normalizedRow.code?.toString().trim();
            const name = normalizedRow.name?.toString().trim();
            const finalQty = normalizedRow.finalqty || normalizedRow.quantity || normalizedRow.qty || 0;
            let uom = normalizedRow.uom?.toString().trim() || 'kg';
            
            // Force 'Unit' to 'kg' if found in the file
            if (uom.toLowerCase() === 'unit') uom = 'kg';

            if (!code || !name) {
                skippedCount++;
                continue;
            }

            const existingMaterial = await RawMaterial.findOne({ sku: code });

            if (existingMaterial) {
                existingMaterial.currentQuantity = Number(finalQty) || 0;
                existingMaterial.name = name; 
                existingMaterial.uom = uom; // Update UOM to file value or default 'kg'
                await existingMaterial.save();
                updatedCount++;
            } else {
                await RawMaterial.create({
                    sku: code,
                    name,
                    currentQuantity: Number(finalQty) || 0,
                    uom: uom,
                });
                createdCount++;
            }
        }

        res.json({
            message: 'Import completed successfully',
            updatedCount,
            createdCount,
            skippedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const importPackingMaterials = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let updatedCount = 0;
        let createdCount = 0;
        let skippedCount = 0;

        for (const row of data) {
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase().trim()] = row[key];
            });

            const code = normalizedRow.code?.toString().trim();
            const name = normalizedRow.name?.toString().trim();
            const finalQty = normalizedRow.finalqty || normalizedRow.quantity || normalizedRow.qty || 0;
            let uom = normalizedRow.uom?.toString().trim() || 'pcs';
            
            if (uom.toLowerCase() === 'unit') uom = 'pcs';

            if (!code || !name) {
                skippedCount++;
                continue;
            }

            const existingMaterial = await PackingMaterial.findOne({ sku: code });

            if (existingMaterial) {
                existingMaterial.currentQuantity = Number(finalQty) || 0;
                existingMaterial.name = name; 
                existingMaterial.uom = uom;
                await existingMaterial.save();
                updatedCount++;
            } else {
                await PackingMaterial.create({
                    sku: code,
                    name,
                    currentQuantity: Number(finalQty) || 0,
                    uom: uom,
                });
                createdCount++;
            }
        }

        res.json({
            message: 'Import completed successfully',
            updatedCount,
            createdCount,
            skippedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const importFinishedGoods = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let updatedCount = 0;
        let createdCount = 0;
        let skippedCount = 0;

        for (const row of data) {
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase().trim()] = row[key];
            });

            const code = normalizedRow.code?.toString().trim();
            const name = normalizedRow.name?.toString().trim();
            const category = normalizedRow.category?.toString().trim() || 'General';
            const price = normalizedRow.price || normalizedRow.unitprice || 0;
            const finalQty = normalizedRow.finalqty || normalizedRow.quantity || normalizedRow.qty || 0;
            const minStock = normalizedRow.minstock || normalizedRow.minqty || 0;

            if (!code || !name) {
                skippedCount++;
                continue;
            }

            const existingGood = await FinishedGood.findOne({ sku: code });

            if (existingGood) {
                existingGood.currentQuantity = Number(finalQty) || 0;
                existingGood.name = name; 
                existingGood.category = category;
                existingGood.unitPrice = Number(price) || existingGood.unitPrice;
                existingGood.minStockQty = Number(minStock) || existingGood.minStockQty;
                await existingGood.save();
                updatedCount++;
            } else {
                await FinishedGood.create({
                    sku: code,
                    name,
                    category,
                    unitPrice: Number(price) || 0,
                    currentQuantity: Number(finalQty) || 0,
                    minStockQty: Number(minStock) || 0
                });
                createdCount++;
            }
        }

        res.json({
            message: 'Import completed successfully',
            updatedCount,
            createdCount,
            skippedCount
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
    deletePackingMaterial,
    importRawMaterials,
    importPackingMaterials,
    importFinishedGoods
};
