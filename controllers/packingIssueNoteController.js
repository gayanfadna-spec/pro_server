const PackingIssueNote = require('../models/PackingIssueNote');
const PackingMaterial = require('../models/PackingMaterial');

// @desc    Get all Packing Issue Notes
// @route   GET /api/packing-issue-notes
const getPackingIssueNotes = async (req, res) => {
    try {
        const notes = await PackingIssueNote.find({}).populate('items.material', 'name sku uom').sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new Packing Issue Note
// @route   POST /api/packing-issue-notes
const createPackingIssueNote = async (req, res) => {
    try {
        const { issueNumber, recipient, items, issueDate, remarks } = req.body;

        const note = new PackingIssueNote({
            issueNumber,
            recipient,
            items,
            issueDate,
            remarks
        });

        const savedNote = await note.save();

        // Update Packing Material inventory (decrease quantity)
        for (const item of items) {
            await PackingMaterial.findByIdAndUpdate(
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
    getPackingIssueNotes,
    createPackingIssueNote
};
