const express = require("express");
const cors = require("cors");
const coreRouter = require("./routes");

// Create an express application
const app = express();

// Apply middlewares for REST API with JSON
app.use(express.json());
// Apply middlewares for REST API with URL-encoded
app.use(express.urlencoded({ extended: true }));
// Apply middlewares for CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Core router
app.use(coreRouter);

module.exports = app;
