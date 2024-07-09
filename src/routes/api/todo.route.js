"use strict";

const express = require("express");
const httpStatus = require("http-status");
const http = require("node:http");

const { TodoController } = require("../../controllers");

const router = express.Router({
  strict: true,
});

const todoController = new TodoController();

// GET /todos - Get all todos items
router.get("/", todoController.findAll);

// POST /todos - Create a new todo item
router.post("/", todoController.create);

// GET /todos/:id - Get a todo item by id
router.get("/:id", todoController.findOne);

// PUT /todos/:id - Update a todo item by id
router.put("/:id", todoController.update);

// DELETE /todos/:id - Delete a todo item by id
router.delete("/:id", todoController.delete);

// Handle invalid routes
router.all("*", (req, res) =>
  res.status(httpStatus.NOT_FOUND).json({
    status: httpStatus.NOT_FOUND,
    message: http.STATUS_CODES[httpStatus.NOT_FOUND],
    reason: `The requested route ${req.method} ${req.path} does not exist.`,
  })
);

/**
 * Handle general errors from the todo router.
 *
 * @param {Error} err  The error object from the todo router with next(err)
 * @param {express.Request} req The request object from the todo router
 * @param {express.Response} res The response object from the todo router
 * @param {express.NextFunction} next The callback function from the todo router
 */
function todoErrorHandler(err, req, res, next) {
  if (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: http.STATUS_CODES[httpStatus.INTERNAL_SERVER_ERROR],
      reason: err.message,
    });
  } else {
    next();
  }
}

// Handle errors from the todo router
router.use(todoErrorHandler);

module.exports = router;
