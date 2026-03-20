const mongoose = require('mongoose');

const fgProductionSchema = new mongoose.Schema({
    productionId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FinishedGood',
            required: true
        },
        batchNumber: String,
        quantityProduced: {
            type: Number,
            required: true
        }
    }],
    productionDate: {
        type: Date,
        default: Date.now
    },
    remarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FGProduction', fgProductionSchema);
