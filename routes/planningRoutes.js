const express = require('express');
const router = express.Router();
const { saveRecipe, getRecipe, calculateRequirements, getProducibleQuantities } = require('../controllers/planningController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/recipes')
    .post(protect, admin, saveRecipe);

router.route('/recipes/:id')
    .get(protect, getRecipe);

router.route('/calculate')
    .post(protect, calculateRequirements);

router.route('/producible')
    .get(protect, getProducibleQuantities);

module.exports = router;
