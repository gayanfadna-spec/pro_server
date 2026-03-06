const mongoose = require('mongoose');

const packingGRNSchema = new mongoose.Schema({
    grnNumber: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
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
    receivedDate: {
        type: Date,
        default: Date.now
    },
    remarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('PackingGRN', packingGRNSchema);
