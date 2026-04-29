const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const RawMaterial = require('./models/RawMaterial');

const fixUnits = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await RawMaterial.updateMany(
            { uom: { $regex: /^unit$/i } },
            { $set: { uom: 'kg' } }
        );

        console.log(`Successfully updated ${result.modifiedCount} materials to 'kg'.`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing units:', error);
        process.exit(1);
    }
};

fixUnits();
