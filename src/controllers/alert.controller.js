const SKU = require("../models/SKU");
const StockMovement = require("../models/StockMovement");

// Low Stock SKUs
exports.getLowStock = async (req, res) => {
    try {
        const lowStockSKUs = await SKU.find({
            $expr: { $lte: ["$currentQuantity", "$minThreshold"] },
        });

        res.json(lowStockSKUs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Dead Stock SKUs (no OUT in last 30 days)
exports.getDeadStock = async (req, res) => {
    try {
        const THIRTY_DAYS_AGO = new Date();
        THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

        // Find SKUs with recent OUT movement
        const activeSkuIds = await StockMovement.distinct("skuId", {
            type: "OUT",
            createdAt: { $gte: THIRTY_DAYS_AGO },
        });

        // Dead stock = SKUs NOT in active list
        const deadStockSKUs = await SKU.find({
            _id: { $nin: activeSkuIds },
        });

        res.json(deadStockSKUs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
