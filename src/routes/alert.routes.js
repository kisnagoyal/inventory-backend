const express = require("express");
const router = express.Router();

const {
    getLowStock,
    getDeadStock,
} = require("../controllers/alert.controller");

router.get("/low-stock", getLowStock);
router.get("/dead-stock", getDeadStock);

module.exports = router;
