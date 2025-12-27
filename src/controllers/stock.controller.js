const SKU = require("../models/SKU");
const StockMovement = require("../models/StockMovement");

// Stock IN (add inventory)
exports.stockIn = async (req, res) => {
    try {
        const { skuId, quantity, reason } = req.body;

        if (!skuId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const sku = await SKU.findById(skuId);
        if (!sku) {
            return res.status(404).json({ message: "SKU not found" });
        }

        // Update inventory
        sku.currentQuantity += quantity;
        await sku.save();

        // Log movement
        await StockMovement.create({
            skuId,
            type: "IN",
            quantity,
            reason: reason || "restock",
        });

        res.json({ message: "Stock added successfully", sku });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Stock OUT (reduce inventory)
exports.stockOut = async (req, res) => {
    try {
        const { skuId, quantity, reason } = req.body;

        if (!skuId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const sku = await SKU.findById(skuId);
        if (!sku) {
            return res.status(404).json({ message: "SKU not found" });
        }

        if (sku.currentQuantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Update inventory
        sku.currentQuantity -= quantity;
        await sku.save();

        // Log movement
        await StockMovement.create({
            skuId,
            type: "OUT",
            quantity,
            reason: reason || "sale",
        });

        res.json({ message: "Stock reduced successfully", sku });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
