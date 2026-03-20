const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const RawMaterial = require('./models/RawMaterial');
const FinishedGood = require('./models/FinishedGood');
const Recipe = require('./models/Recipe');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedUsers = async () => {
    try {
        // Clear all collections to ensure a completely fresh start
        await User.deleteMany({});
        await RawMaterial.deleteMany({});
        await FinishedGood.deleteMany({});
        await Recipe.deleteMany({});
        console.log('Cleared all existing data (Users, Materials, Products, Recipes)');

        const users = [
            {
                name: 'System Admin',
                username: 'admin',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Regular User',
                username: 'user',
                password: 'password123',
                role: 'user',
            }
        ];

        for (const user of users) {
            await User.create(user);
        }
        console.log('Admin and User seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
