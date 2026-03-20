const IssueNote = require('../models/IssueNote');
const RawMaterial = require('../models/RawMaterial');

// @desc    Get all Issue Notes
// @route   GET /api/issue-notes
const getIssueNotes = async (req, res) => {
    try {
        const notes = await IssueNote.find({}).populate('items.material', 'name sku');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new Issue Note
// @route   POST /api/issue-notes
const createIssueNote = async (req, res) => {
    try {
        const { issueNumber, recipient, items, issueDate, remarks } = req.body;

        // Check if enough stock exists for all items
        for (const item of items) {
            const material = await RawMaterial.findById(item.material);
            if (!material) {
                return res.status(404).json({ message: `Material not found: ${item.material}` });
            }
            if (material.currentQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${material.name}. Available: ${material.currentQuantity}, Requested: ${item.quantity}`
                });
            }
        }

        const issueNote = new IssueNote({
            issueNumber,
            recipient,
            items,
            issueDate,
            remarks
        });

        const savedNote = await issueNote.save();

        // Update Raw Material inventory (decrement)
        for (const item of items) {
            await RawMaterial.findByIdAndUpdate(
                item.material,
                { $inc: { currentQuantity: -item.quantity } }
            );
        }

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getIssueNotes,
    createIssueNote
};
