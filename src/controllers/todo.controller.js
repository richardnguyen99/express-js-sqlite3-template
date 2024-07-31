"use strict";

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
   * Todo Service instance
   * @type {TodoService}
   * @private
   * @memberof TodoController
   */
  _todoService;

  /**
   * Create a new instance of TodoController
   * @constructor
   */
  constructor() {
    this._todoService = new TodoService();

    // Bind the methods to the class context
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Find all todo items. Handler for GET /todos.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async findAll(_req, res, next) {
    try {
      const todos = await this._todoService.findAll();
      res.status(httpStatus.OK).json({ todos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find a todo item by id. Handler for GET /todos/:id.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async findOne(req, res, next) {
    const { id } = req.params;
    try {
      const todo = await this._todoService.findById(id);
      if (todo) {
        res.status(httpStatus.OK).json({ todo });
      } else {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Todo item not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new todo item. Handler for POST /todos.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async create(req, res, next) {
    const todo = req.body;
    try {
      const createdTodo = await this._todoService.create(todo);
      res.status(httpStatus.CREATED).json({ todo: createdTodo });
    } catch (error) {
      next(error);
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
    const { id } = req.params;
    const todo = req.body;

    try {
      const item = await this._todoService.findById(id);

      if (!item) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Todo item not found" });
        return;
      }

      const updatedTodo = await this._todoService.update(id, todo);

      res.status(httpStatus.OK).json({ todo: updatedTodo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a todo item by id. Handler for DELETE /todos/:id.
   *
   * @param {express.Request} req - Express object representing the HTTP request
   * @param {express.Response} res - Express  object representing the HTTP response
   * @param {express.NextFunction} next - Express function that calls the next middleware
   */
  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const user = await this._todoService.findById(id);

      if (!user) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Todo item not found" });

        return;
      }

      const deletedCount = await this._todoService.delete(id);

      res.status(httpStatus.OK).json({
        message: "Todo item deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

exports.TodoController = TodoController;
