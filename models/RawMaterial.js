const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    uom: {
        type: String, // Unit of Measure
        required: true,
    },

    currentQuantity: {
        type: Number,
        default: 0,
    },
    minStockQty: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
