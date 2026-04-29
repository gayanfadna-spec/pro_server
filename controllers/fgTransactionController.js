const FGProduction = require('../models/FGProduction');
const FGDispatch = require('../models/FGDispatch');
const FinishedGood = require('../models/FinishedGood');

// @desc    Log FG Production
// @route   POST /api/fg-transactions/production
const logProduction = async (req, res) => {
    try {
        const { productionId, items, productionDate, remarks } = req.body;

        const production = new FGProduction({
            productionId,
            items,
            productionDate,
            remarks
        });

        const savedProduction = await production.save();

        // Increase FG stock for each item
        for (const item of items) {
            await FinishedGood.findByIdAndUpdate(
                item.product,
                { $inc: { currentQuantity: item.quantityProduced } }
            );
        }

        res.status(201).json(savedProduction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Log FG Dispatch
// @route   POST /api/fg-transactions/dispatch
const logDispatch = async (req, res) => {
    try {
        const { dispatchId, items, customer, dispatchDate, remarks } = req.body;

        // Check stock for all items first
        for (const item of items) {
            const fg = await FinishedGood.findById(item.product);
            if (!fg) return res.status(404).json({ message: `Finished Good not found: ${item.product}` });
            if (fg.currentQuantity < item.quantityDispatched) {
                return res.status(400).json({
                    message: `Insufficient stock for ${fg.name}. Available: ${fg.currentQuantity}, Requested: ${item.quantityDispatched}`
                });
            }
        }

        const dispatch = new FGDispatch({
            dispatchId,
            items,
            customer,
            dispatchDate,
            remarks
        });

        const savedDispatch = await dispatch.save();

        // Decrease FG stock for each item
        for (const item of items) {
            await FinishedGood.findByIdAndUpdate(
                item.product,
                { $inc: { currentQuantity: -item.quantityDispatched } }
            );
        }

        res.status(201).json(savedDispatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Production Records
// @route   GET /api/fg-transactions/production
const getProductions = async (req, res) => {
    try {
        const records = await FGProduction.find({}).populate('items.product', 'name sku').sort({ updatedAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dispatch Records
// @route   GET /api/fg-transactions/dispatch
const getDispatches = async (req, res) => {
    try {
        const records = await FGDispatch.find({}).populate('items.product', 'name sku').sort({ updatedAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    logProduction,
    logDispatch,
    getProductions,
    getDispatches
};
