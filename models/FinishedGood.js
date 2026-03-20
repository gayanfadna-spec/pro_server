const mongoose = require('mongoose');

const finishedGoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
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

module.exports = mongoose.model('FinishedGood', finishedGoodSchema);
