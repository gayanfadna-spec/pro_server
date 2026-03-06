const Recipe = require('../models/Recipe');
const FinishedGood = require('../models/FinishedGood');
const RawMaterial = require('../models/RawMaterial');
const PackingMaterial = require('../models/PackingMaterial');

// @desc    Create or Update Recipe
// @route   POST /api/planning/recipes
const saveRecipe = async (req, res) => {
    try {
        const { finishedGoodId, batchSize, ingredients, packaging, notes } = req.body;

        let recipe = await Recipe.findOne({ finishedGoodId });

        if (recipe) {
            recipe.batchSize = batchSize;
            recipe.ingredients = ingredients;
            recipe.packaging = packaging || [];
            recipe.notes = notes;
            await recipe.save();
        } else {
            recipe = await Recipe.create({ finishedGoodId, batchSize, ingredients, packaging: packaging || [], notes });
        }

        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Recipe by Finished Good ID
// @route   GET /api/planning/recipes/:id
const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ finishedGoodId: req.params.id })
            .populate('ingredients.rawMaterialId', 'name currentQuantity sku uom')
            .populate('packaging.packingMaterialId', 'name currentQuantity sku uom');

        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Calculate Requirements for production
// @route   POST /api/planning/calculate
const calculateRequirements = async (req, res) => {
    try {
        const { items } = req.body; // Array of { finishedGoodId, targetQuantity }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items list' });
        }

        const requirements = {};
        const breakdown = [];
        const runningStock = {}; // Track available stock as it gets consumed by preceding products

        for (const item of items) {
            const recipe = await Recipe.findOne({ finishedGoodId: item.finishedGoodId })
                .populate('ingredients.rawMaterialId')
                .populate('packaging.packingMaterialId')
                .populate('finishedGoodId', 'name sku');

            if (!recipe) continue;

            const multiplier = item.targetQuantity / recipe.batchSize;
            const productRequirements = {
                productId: recipe.finishedGoodId._id,
                productName: recipe.finishedGoodId.name,
                productSku: recipe.finishedGoodId.sku,
                targetQuantity: item.targetQuantity,
                ingredients: []
            };

            for (const ingredient of recipe.ingredients) {
                const material = ingredient.rawMaterialId;
                const needed = ingredient.quantity * multiplier;

                // Initialize running stock if not already tracked
                if (runningStock[material._id] === undefined) {
                    runningStock[material._id] = material.currentQuantity;
                }

                productRequirements.ingredients.push({
                    materialId: material._id,
                    name: material.name,
                    sku: material.sku,
                    uom: material.uom,
                    quantity: needed,
                    available: runningStock[material._id],
                    type: 'raw_material'
                });

                // Update running stock - subtract needed from current availability for next product
                runningStock[material._id] -= needed;

                if (requirements[material._id]) {
                    requirements[material._id].requiredQuantity += needed;
                } else {
                    requirements[material._id] = {
                        _id: material._id,
                        name: material.name,
                        sku: material.sku,
                        uom: material.uom,
                        currentQuantity: material.currentQuantity,
                        requiredQuantity: needed,
                        type: 'raw_material'
                    };
                }
            }

            // Handle Packaging Materials
            for (const pack of recipe.packaging || []) {
                const material = pack.packingMaterialId;
                if (!material) continue;

                const needed = pack.quantity * multiplier;

                if (runningStock[material._id] === undefined) {
                    runningStock[material._id] = material.currentQuantity;
                }

                productRequirements.ingredients.push({
                    materialId: material._id,
                    name: material.name,
                    sku: material.sku,
                    uom: material.uom,
                    quantity: needed,
                    available: runningStock[material._id],
                    type: 'packing_material'
                });

                runningStock[material._id] -= needed;

                if (requirements[material._id]) {
                    requirements[material._id].requiredQuantity += needed;
                } else {
                    requirements[material._id] = {
                        _id: material._id,
                        name: material.name,
                        sku: material.sku,
                        uom: material.uom,
                        currentQuantity: material.currentQuantity,
                        requiredQuantity: needed,
                        type: 'packing_material'
                    };
                }
            }
            breakdown.push(productRequirements);
        }

        res.json({
            aggregated: Object.values(requirements),
            breakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Producible Quantities for all products
// @route   GET /api/planning/producible
const getProducibleQuantities = async (req, res) => {
    try {
        const recipes = await Recipe.find({})
            .populate('finishedGoodId')
            .populate('ingredients.rawMaterialId')
            .populate('packaging.packingMaterialId');

        const results = recipes.map(recipe => {
            const product = recipe.finishedGoodId;
            if (!product) return null;

            let maxProducible = Infinity;

            if (recipe.ingredients.length === 0) {
                maxProducible = 0;
            } else {
                for (const ingredient of recipe.ingredients) {
                    const material = ingredient.rawMaterialId;
                    if (!material) {
                        maxProducible = 0;
                        break;
                    }

                    const possibleBatches = material.currentQuantity / ingredient.quantity;
                    const producibleWithThisMaterial = possibleBatches * recipe.batchSize;

                    if (producibleWithThisMaterial < maxProducible) {
                        maxProducible = producibleWithThisMaterial;
                    }
                }

                // Consider packaging materials
                for (const pack of recipe.packaging || []) {
                    const material = pack.packingMaterialId;
                    if (!material) {
                        maxProducible = 0;
                        break;
                    }

                    const possibleBatches = material.currentQuantity / pack.quantity;
                    const producibleWithThisPackaging = possibleBatches * recipe.batchSize;

                    if (producibleWithThisPackaging < maxProducible) {
                        maxProducible = producibleWithThisPackaging;
                    }
                }
            }

            return {
                _id: product._id,
                name: product.name,
                sku: product.sku,
                category: product.category,
                currentQuantity: product.currentQuantity,
                potentialProduction: Math.floor(maxProducible === Infinity ? 0 : maxProducible),
                recipe: {
                    batchSize: recipe.batchSize,
                    ingredients: [
                        ...recipe.ingredients.map(ing => ({
                            name: ing.rawMaterialId?.name,
                            sku: ing.rawMaterialId?.sku,
                            needed: ing.quantity,
                            available: ing.rawMaterialId?.currentQuantity,
                            type: 'raw'
                        })),
                        ...(recipe.packaging || []).map(pack => ({
                            name: pack.packingMaterialId?.name,
                            sku: pack.packingMaterialId?.sku,
                            needed: pack.quantity,
                            available: pack.packingMaterialId?.currentQuantity,
                            type: 'packing'
                        }))
                    ]
                }
            };
        }).filter(item => item !== null);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveRecipe, getRecipe, calculateRequirements, getProducibleQuantities };
