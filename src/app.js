// // src/app.js
// require("dotenv").config(); 

// const express = require("express");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health check route
// app.get("/", (req, res) => {
//     res.send("Inventory backend is running");
// });

// module.exports = app;


// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const app = express();

// // Connect Database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health route
// app.get("/", (req, res) => {
//     res.send("Inventory backend is running");
// });

// module.exports = app;

//---------------------------------------------------

const express = require("express");
const stockRoutes = require("./routes/stock.routes");
const alertRoutes = require("./routes/alert.routes");
const dashboardRoutes = require("./routes/dashboard.routes");



const cors = require("cors");
const connectDB = require("./config/db");

const skuRoutes = require("./routes/sku.routes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/skus", skuRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);




// Health check
app.get("/", (req, res) => {
    res.send("Inventory backend is running");
});

module.exports = app;

