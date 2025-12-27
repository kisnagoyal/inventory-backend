const express = require("express");
const router = express.Router();

const { createSKU, getAllSKUs } = require("../controllers/sku.controller");

// Routes
router.post("/", createSKU);
router.get("/", getAllSKUs);

module.exports = router;
