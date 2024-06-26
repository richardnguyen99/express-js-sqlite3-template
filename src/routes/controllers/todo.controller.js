const httpStatus = require("http-status");
const http = require("http");

const db = require("../../db");
const { randomInt } = require("../../helpers/random");

class TodoController {
  /**
   * Find all todo items.
   *
   * @param {import("express").Request} req - Express object representing the HTTP request
   * @param {import("express").Response} res - Express  object representing the HTTP response
   * @param {import("express").NextFunction} next - Express function that calls the next middleware
   */
  async findAll(req, res, next) {
    db.all("SELECT * FROM todos", (err, rows) => {
      if (err) {
        next(err);
        return;
      }

      res.status(httpStatus.OK).json(rows);
    });
  }

  /**
   * Find a todo item by id.
   *
   * @param {import("express").Request} req - Express object representing the HTTP request
   * @param {import("express").Response} res - Express  object representing the HTTP response
   * @param {import("express").NextFunction} next - Express function that calls the next middleware
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
   * Create a new todo item.
   *
   * @param {import("express").Request} req - Express object representing the HTTP request
   * @param {import("express").Response} res - Express  object representing the HTTP response
   * @param {import("express").NextFunction} next - Express function that calls the next middleware
   */
  async create(req, res, next) {
    const { title, completed = false, userId = randomInt() } = req.body;

    try {
      const result = await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO todos (title, completed, userId) VALUES (?, ?, ?)",
          [title, completed, userId],
          function (err) {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              id: this.lastID,
              title,
              completed,
              userId,
            });
          }
        );
      });
      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a todo item by id.
   *
   * @param {import("express").Request} req - Express object representing the HTTP request
   * @param {import("express").Response} res - Express  object representing the HTTP response
   * @param {import("express").NextFunction} next - Express function that calls the next middleware
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
   * Delete a todo item by id.
   *
   * @param {import("express").Request} req - Express object representing the HTTP request
   * @param {import("express").Response} res - Express  object representing the HTTP response
   * @param {import("express").NextFunction} next - Express function that calls the next middleware
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
