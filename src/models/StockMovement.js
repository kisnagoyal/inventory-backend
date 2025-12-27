const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
    {
        skuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SKU",
            required: true,
        },
        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);
