const mongoose = require('mongoose');

const packingIssueNoteSchema = new mongoose.Schema({
    issueNumber: {
        type: String,
        required: true,
        unique: true
    },
    recipient: {
        type: String,
        required: true
    },
    items: [{
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PackingMaterial',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    issueDate: {
        type: Date,
        default: Date.now
    },
    remarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('PackingIssueNote', packingIssueNoteSchema);
