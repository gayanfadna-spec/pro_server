const mongoose = require('mongoose');

const fgDispatchSchema = new mongoose.Schema({
    dispatchId: {
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
        quantityDispatched: {
            type: Number,
            required: true
        }
    }],
    customer: {
        type: String,
        required: true
    },
    dispatchDate: {
        type: Date,
        default: Date.now
    },
    remarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FGDispatch', fgDispatchSchema);
