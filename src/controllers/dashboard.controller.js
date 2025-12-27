const SKU = require("../models/SKU");
const StockMovement = require("../models/StockMovement");

// Dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        // Total SKUs
        const totalSKUs = await SKU.countDocuments();

        // Total inventory quantity
        const inventoryAggregation = await SKU.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$currentQuantity" },
                },
            },
        ]);
        const totalInventoryQuantity =
            inventoryAggregation[0]?.totalQuantity || 0;

        // Low stock count
        const lowStockCount = await SKU.countDocuments({
            $expr: { $lte: ["$currentQuantity", "$minThreshold"] },
        });

        // Dead stock count (no OUT in last 30 days)
        const THIRTY_DAYS_AGO = new Date();
        THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

        const activeSkuIds = await StockMovement.distinct("skuId", {
            type: "OUT",
            createdAt: { $gte: THIRTY_DAYS_AGO },
        });

        const deadStockCount = await SKU.countDocuments({
            _id: { $nin: activeSkuIds },
        });

        // Top selling SKUs (last 30 days)
        const topSelling = await StockMovement.aggregate([
            {
                $match: {
                    type: "OUT",
                    createdAt: { $gte: THIRTY_DAYS_AGO },
                },
            },
            {
                $group: {
                    _id: "$skuId",
                    unitsSold: { $sum: "$quantity" },
                },
            },
            { $sort: { unitsSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "skus",
                    localField: "_id",
                    foreignField: "_id",
                    as: "sku",
                },
            },
            { $unwind: "$sku" },
        ]);

        res.json({
            totalSKUs,
            totalInventoryQuantity,
            lowStockCount,
            deadStockCount,
            topSelling,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
