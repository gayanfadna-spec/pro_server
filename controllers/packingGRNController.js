const PackingGRN = require('../models/PackingGRN');
const PackingMaterial = require('../models/PackingMaterial');

// @desc    Get all Packing GRNs
// @route   GET /api/packing-grn
const getPackingGRNs = async (req, res) => {
    try {
        const grns = await PackingGRN.find({}).populate('items.material', 'name sku uom');
        res.json(grns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new Packing GRN
// @route   POST /api/packing-grn
const createPackingGRN = async (req, res) => {
    try {
        const { grnNumber, supplier, items, receivedDate, remarks } = req.body;

        const grn = new PackingGRN({
            grnNumber,
            supplier,
            items,
            receivedDate,
            remarks
        });

        const savedGRN = await grn.save();

        // Update Packing Material inventory
        for (const item of items) {
            await PackingMaterial.findByIdAndUpdate(
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
    getPackingGRNs,
    createPackingGRN
};
