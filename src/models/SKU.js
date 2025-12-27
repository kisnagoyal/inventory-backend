const mongoose = require("mongoose");

const skuSchema = new mongoose.Schema(
    {
        skuCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        currentQuantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        minThreshold: {
            type: Number,
            required: true,
            default: 10,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SKU", skuSchema);
