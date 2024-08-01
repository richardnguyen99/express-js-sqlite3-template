"use strict";

/**
 * This module contains the service for the todo database, which is responsible
 * for handling asynchronous operations related to the todo database.
 *
 * @fileoverview Service for interacting with the todo database.
 */

const db = require("../db");

/**
 * This class represents the interaction with the todo database, which is responsible
 * for handling asynchronous operations related to the todo database.
 *
 * @class
 */
class TodoService {
  constructor() {}

  /**
   * Find all todo items.
   *
   * @returns {Promise<Array>} A promise that returns an array of todo items
   *
   * @throws {Error} An internal error is thrown if the query fails or SQLite engine encounters an error
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM todos";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }

        resolve(rows);
      });
    });
  }

  /**
   * Find a todo item by ID.
   *
   * @param {number} id - The ID of the todo item to find
   * @returns {Promise<Object>} - A promise that returns a todo item
   *
   * @throws {Error} - An request error if the ID is not provided, is not a number, or is less than 1.
   * @throws {Error} - An internal error if the query fails or SQLite engine encounters an error.
   */
  async findById(id) {
    if (!id) {
      return Promise.reject(new Error("ID is required."));
    }

    if (isNaN(id)) {
      return Promise.reject(new Error("ID must be a number."));
    }

    if (id < 1) {
      return Promise.reject(new Error("ID must be greater than 0."));
    }

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }

        resolve(row);
      });
    });
  }

  /**
   * Find a todo item by title.
   *
   * @param {string} title - The title of the todo item to find
   * @returns {Promise<Object>} - A promise that returns an array of todo items
   *
   * @throws {Error} - An request error if the title is not provided or is not a string.
   * @throws {Error} - An internal error if the query fails or SQLite engine encounters an error.
   */
  async findByTitle(title) {
    if (!title) {
      return Promise.reject(new Error("Title is required."));
    }

    if (typeof title !== "string") {
      return Promise.reject(new Error("Title must be a string."));
    }

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todos WHERE title = ?", [title], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }

        resolve(row);
      });
    });
  }

  /**
   * Create a new todo item.
   *
   * @param {Object} todo - The todo object to create
   * @param {string} todo.title - The title of the todo item
   * @param {boolean} todo.completed - The completion status of the todo item
   * @param {number} todo.userId - The ID of the user that owns
   *
   * @returns {Promise<Object>} - A promise that returns the created todo item
   * @throws {Error} - An request error if the todo object is not provided.
   * @throws {Error} - An internal error if the query fails or SQLite engine encounters
   */
  async create(todo) {
    if (!todo) {
      return Promise.reject(new Error("Todo object is required."));
    }

    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO todos (title, completed, userId) VALUES (?, ?, ?)",
        [todo.title, todo.completed, todo.userId],
        function (err) {
          // Throw an error if the todo item cannot be created
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
              reject(
                new Error(
                  `Todo title must be unique. Found duplicate '${todo.title}'`
                )
              );
            } else {
              reject(new Error(err.message));
            }

            return;
          }

          // Return the result if the todo item is created successfully
          resolve({
            id: this.lastID,
            title: todo.title,
            completed: todo.completed,
            userId: todo.userId,
          });
        }
      );
    });
  }

  /**
   * Update a todo item by ID.
   *
   * @param {number} id - The ID of the todo item to update
   * @param {Object} todo  - The todo object to update
   * @param {string} todo.title - The title of the todo item
   * @param {boolean} todo.completed - The completion status of the todo item
   * @param {number} todo.userId - The ID of the user that owns
   * @returns {Promise<Object>} - A promise that returns the updated todo item
   *
   * @throws {Error} An request error if the ID or todo object is not provided.
   * @throws {Error} An internal error if the query fails or SQLite engine encounters
   */
  async update(id, todo) {
    if (!id) {
      return Promise.reject(new Error("ID is required."));
    }

    if (!todo) {
      return Promise.reject(new Error("Todo object is required."));
    }

    // build the query
    const query = [];
    const params = [];

    if (todo.title) {
      query.push("title = ?");
      params.push(todo.title);
    }

    if (todo.completed) {
      query.push("completed = ?");
      params.push(todo.completed);
    }

    if (query.length === 0 || params.length === 0) {
      return Promise.reject(new Error("Required fields are missing."));
    }

    params.push(id);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE todos SET ${query.join(", ")} WHERE id = ?`,
        params,
        function (err) {
          if (err) {
            reject(new Error(err.message));
            return;
          }

          if (this.changes === 1) {
            resolve({
              id: id,
              title: todo.title,
              completed: todo.completed,
              userId: todo.userId,
            });
          } else {
            reject(new Error("Todo item not found."));
          }
        }
      );
    });
  }

  /**
   * Delete a todo item by ID.
   *
   * @param {number} id
   * @returns <Promise<number>} - A promise that returns the number of todo items deleted
   *
   * @throws {Error} - An request error if the ID is not provided
   * @throws {Error} - An internal error if the query fails or SQLite engine encounters an error
   */
  async delete(id) {
    if (!id) {
      return Promise.reject(new Error("ID is required."));
    }

    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
        if (err) {
          reject(new Error(err.message));
          return;
        }

        if (this.changes === 1) {
          resolve(this.changes);
        } else {
          reject(new Error("Todo item not found."));
        }
      });
    });
  }
}

module.exports = TodoService;
