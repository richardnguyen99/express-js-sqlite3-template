/**
 * This module contains the controller for the todo resource, which is responsible
 * for handling HTTP requests related to the todo resource.
 *
 * @fileoverview Controller for the todo resource.
 */

const express = require("express");
const httpStatus = require("http-status");
const http = require("http");

const db = require("../db");
const { TodoService } = require("../services");
const { randomInt } = require("../helpers/random");

/**
 * This class represents the controller for the todo resource, which is responsible
 * for handling HTTP requests related to the todo resource. The class contains
 * handlers for the following routes:
 *
 * - `GET /todos`
 * - `GET /todos/:id`
 * - `POST /todos`
 * - `PUT /todos/:id`
 * - `DELETE /todos/:id`
 *
 * @class
 */
class TodoController {
  /**
   * Create a new instance of TodoController
   * @constructor
   */
  constructor() {
    this.todoService = new TodoService();
  }

  /**
   * Find all todo items. Handler for GET /todos.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async findAll(_req, res, next) {
    db.all("SELECT * FROM todos", (err, rows) => {
      if (err) {
        next(err);
        return;
      }

      res.status(httpStatus.OK).json(rows);
    });
  }

  /**
   * Find a todo item by id. Handler for GET /todos/:id.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async findOne(req, res, next) {
    db.get("SELECT * FROM todos WHERE id = ?", req.params.id, (err, row) => {
      if (err) {
        next(err);
        return;
      }

      if (row) {
        res.status(httpStatus.OK).json(row);
      } else {
      }
    });
  }

  /**
   * Create a new todo item. Handler for POST /todos.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async create(req, res, next) {
    const { title, completed = false, userId = randomInt() } = req.body;

    try {
      const result = await this.todoService.create({
        title,
        completed,
        userId,
      });

      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a todo item by id. Handler for PUT /todos/:id.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async update(req, res, next) {
    const { title, completed } = req.body;

    // build the SQL query depending on the fields that are being updated
    const fields = [];

    if (title) {
      fields.push("title = ?");
    }

    if (completed !== undefined) {
      fields.push("completed = ?");
    }

    const query = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;

    db.run(
      query,
      [
        ...(title ? [title] : []),
        ...(completed !== undefined ? [completed] : []),
        req.params.id,
      ],
      function (err) {
        if (err) {
          next(err);
          return;
        }

        if (this.changes) {
          res.status(httpStatus.OK).json({
            id: req.params.id,
            title,
            completed,
          });
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: http.STATUS_CODES[httpStatus.NOT_FOUND],
            reason: `The requested route ${req.method} ${req.path} does not exist.`,
          });
        }
      }
    );
  }

  /**
   * Delete a todo item by id. Handler for DELETE /todos/:id.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async delete(req, res, next) {
    db.run("DELETE FROM todos WHERE id = ?", req.params.id, function (err) {
      if (err) {
        next(err);
        return;
      }

      if (this.changes) {
        res.status(httpStatus.NO_CONTENT).json();
      } else {
        res.status(httpStatus.NOT_FOUND).json({
          status: httpStatus.NOT_FOUND,
          message: http.STATUS_CODES[httpStatus.NOT_FOUND],
          reason: `The requested route ${req.method} ${req.path} does not exist.`,
        });
      }
    });
  }
}

exports.TodoController = TodoController;
