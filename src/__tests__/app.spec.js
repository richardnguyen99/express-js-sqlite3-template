"use strict";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

describe("Todo Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /todos", () => {
    it("should respond with a list of todos", async () => {
      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ todos: [] });
    });

    it("should handle errors thrown by controllers", async () => {
      const originalAll = db.all;

      db.all = jest.fn((query, params, callback) => {
        callback(new Error("Failed to query the database"));
      });

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 500,
        message: "Internal Server Error",
        reason: "Failed to query the database",
      });

      db.all = originalAll;
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const response = await request(app).post("/api/todos").send({
        title: "Test Todo",
        completed: false,
        userId: 1,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        todo: {
          id: expect.any(Number),
          title: "Test Todo",
          completed: false,
          userId: 1,
        },
      });
    });
  });

  describe("GET /todos/:id", () => {
    it("should respond with a single todo", async () => {
      const response = await request(app).get("/api/todos/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        todo: {
          id: 1,
          title: "Test Todo",
          completed: 0,
          userId: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle errors thrown by controllers", async () => {
      const response = await request(app).get("/api/todos/dddd");

      // Spy on the next in todoErrorHandler

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 500,
        message: "Internal Server Error",
        reason: expect.any(String),
      });
    });
  });

  describe("wrong routes", () => {
    it("should return a 404 error for an invalid route (/home)", async () => {
      const response = await request(app).get("/home");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        message: "Not Found",
        reason: "The requested route GET /home does not exist.",
      });
    });

    it("should return a 404 error for an invalid route (/api/home)", async () => {
      // Must have the prefix /api to match the route
      const response = await request(app).get("/api/home");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        message: "Not Found",
        reason: "The requested route GET /api/home does not exist.",
      });
    });
  });
});
