const SKU = require("../models/SKU");

// Create a new SKU
exports.createSKU = async (req, res) => {
    try {
        const { skuCode, name, category, currentQuantity, minThreshold } = req.body;

        // Basic validation
        if (!skuCode || !name || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingSKU = await SKU.findOne({ skuCode });
        if (existingSKU) {
            return res.status(409).json({ message: "SKU already exists" });
        }

        const sku = await SKU.create({
            skuCode,
            name,
            category,
            currentQuantity,
            minThreshold,
        });

        res.status(201).json(sku);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all SKUs
exports.getAllSKUs = async (req, res) => {
    try {
        const skus = await SKU.find().sort({ createdAt: -1 });
        res.json(skus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
