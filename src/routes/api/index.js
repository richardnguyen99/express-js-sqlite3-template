"use strict";

const express = require("express");

// API routes
const router = express.Router();

// Todo API routes
router.use("/todos", require("./todo.route"));

module.exports = router;
