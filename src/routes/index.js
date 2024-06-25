const httpStatus = require("http-status");
const express = require("express");

const apiRouter = require("./api");

const router = express.Router();

// API prefix routes
router.use("/api", apiRouter);

// Disable favicon.ico request
router.get("/favicon.ico", (req, res) => res.status(204));

// Disable robots.txt request
router.get("/robots.txt", (req, res) => res.status(204));

// Disable all routes
router.all("*", (req, res) =>
  res.status(404).json({
    status: httpStatus.NOT_FOUND,
    message: httpStatus["400_MESSAGE"],
    reason: `The requested route ${req.method} ${req.path} does not exist.`,
  })
);

module.exports = router;
