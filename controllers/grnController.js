const GRN = require('../models/GRN');
const RawMaterial = require('../models/RawMaterial');

// @desc    Get all GRNs
// @route   GET /api/grn
const getGRNs = async (req, res) => {
    try {
        const grns = await GRN.find({}).populate('items.material', 'name sku').sort({ updatedAt: -1 });
        res.json(grns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new GRN
// @route   POST /api/grn
const createGRN = async (req, res) => {
    try {
        const { grnNumber, supplier, items, receivedDate, remarks } = req.body;

        const grn = new GRN({
            grnNumber,
            supplier,
            items,
            receivedDate,
            remarks
        });

        const savedGRN = await grn.save();

        // Update Raw Material inventory
        for (const item of items) {
            await RawMaterial.findByIdAndUpdate(
                item.material,
                { $inc: { currentQuantity: item.quantity } }
            );
        }

        res.status(201).json(savedGRN);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getGRNs,
    createGRN
};
