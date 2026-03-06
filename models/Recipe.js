const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    finishedGoodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FinishedGood',
        required: true,
        unique: true,
    },
    batchSize: {
        type: Number,
        default: 1,
    },
    ingredients: [{
        rawMaterialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RawMaterial',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    packaging: [{
        packingMaterialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PackingMaterial',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    notes: String
}, {
    timestamps: true,
});

module.exports = mongoose.model('Recipe', recipeSchema);
