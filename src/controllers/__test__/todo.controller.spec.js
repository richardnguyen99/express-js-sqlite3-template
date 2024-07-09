const { getMockReq, getMockRes } = require("@jest-mock/express");
const httpStatus = require("http-status");

const db = require("../../db");
const { TodoController } = require("../todo.controller");

describe("Todo Controller", () => {
  const todoController = new TodoController();

  describe("create", () => {
    // it("should return an error if the todo object is missing", async () => {
    // const req = getMockReq();
    // const { res, next } = getMockRes();

    // try {
    // // Next function is called when an error occurs. However, this will
    // // be handled at route level, not controller level.
    // await todoController.create(req, res, next);
    // } catch (err) {
    // expect(err).toBeDefined();
    // expect(err).toBeInstanceOf(Error);
    // expect(err.message).toBe("Todo object is required.");
    // expect(next).toHaveBeenCalledWith(err);
    // }
    // });

    // it("should create a new todo item", async () => {
    // const req = getMockReq({
    // body: {
    // title: "Buy groceries",
    // completed: false,
    // userId: 1,
    // },
    // });
    // const { res, next } = getMockRes();

    // await todoController.create(req, res, next);

    // expect(res.status).toHaveBeenCalledWith(201);
    // expect(res.json).toHaveBeenCalledWith({
    // id: expect.any(Number),
    // title: "Buy groceries",
    // completed: false,
    // userId: 1,
    // });
    // });

    // it("should return an error if the todo item cannot be created", async () => {
    // const req = getMockReq({
    // body: {
    // title: "Buy groceries",
    // completed: false,
    // userId: 1,
    // },
    // });
    // const { res, next } = getMockRes();

    // try {
    // // Next function is called when an error occurs. However, this will
    // // be handled at route level, not controller level.
    // await todoController.create(req, res, next);
    // } catch (err) {
    // expect(err).toBeDefined();
    // expect(err).toBeInstanceOf(Error);
    // expect(err.message).toBe("UNIQUE constraint failed: todos.title");
    // expect(next).toHaveBeenCalledWith(err);
    // }
    // });

    // it("should return an error if the title is missing", async () => {
    // const req = getMockReq({
    // body: {
    // completed: false,
    // userId: 1,
    // },
    // });
    // const { res, next } = getMockRes();

    // try {
    // // Next function is called when an error occurs. However, this will
    // // be handled at route level, not controller level.
    // await todoController.create(req, res, next);
    // } catch (err) {
    // expect(err).toBeDefined();
    // expect(err).toBeInstanceOf(Error);
    // expect(err.message).toBe("Title is required");
    // expect(next).toHaveBeenCalledWith(err);
    // }
    // });

    it("should create a new todo item", async () => {
      const req = getMockReq({
        body: {
          title: "Implement unit tests for todo controllers",
          completed: false,
          userId: 11,
        },
      });
      const { res, next } = getMockRes();

      await todoController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        todo: {
          id: expect.any(Number),
          title: "Implement unit tests for todo controllers",
          completed: false,
          userId: 11,
        },
      });
    });
  });

  describe("findOne", () => {
    it("should return a todo item", async () => {
      // Mock the TodoService.findById method to return a todo item
      const req = getMockReq({ params: { id: 1 } });
      const { res, next } = getMockRes();

      const todoController = new TodoController();

      const todo = {
        id: 1,
        title: "Implement unit tests for todo controllers",
        completed: 0,
        userId: 11,
      };

      // Call the findOne method with the mocked request and response objects
      await todoController.findOne(req, res, next);

      // Verify that the response status is set to 200 (OK)
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      // Verify that the response json method is called with the todo item
      expect(res.json).toHaveBeenCalledWith({
        todo: {
          ...todo,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });

      // Verify that the next function is not called
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle todo item not found", async () => {
      const req = { params: { id: 100 } }; // Mock the request object with an id parameter
      const { res, next } = getMockRes(); // Mock the response object

      const todoController = new TodoController();

      // Call the findOne method with the mocked request and response objects
      await todoController.findOne(req, res, next);

      // Verify that the response status is set to 404 (Not Found)
      expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);

      // Verify that the response json method is called with the message
      expect(res.json).toHaveBeenCalledWith({ message: "Todo item not found" });

      // Verify that the next function is not called
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return a list of todos", async () => {
      // Mock the TodoService.findAll method to return a list of todos
      const req = getMockReq(); // Mock the request object
      const { res, next } = getMockRes(); // Mock the response object and the next function

      const todoController = new TodoController();

      // Call the findAll method with the mocked request and response objects
      await todoController.findAll(req, res, next);

      // Verify that the response status is set to 200 (OK)
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      // Verify that the response json method is called with the list of todos
      expect(res.json).toHaveBeenCalledWith({
        todos: [
          {
            id: 1,
            title: "Implement unit tests for todo controllers",
            completed: 0,
            userId: 11,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      });

      // Verify that the next function is not called
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const originalFindAll = db.all;

      db.all = jest.fn((query, params, callback) => {
        callback(new Error("Failed to fetch todos"));
      });

      const req = getMockReq(); // Mock the request object
      const { res, next } = getMockRes(); // Mock the response object and the next function

      const todoController = new TodoController();

      // Call the findAll method with the mocked request and response objects
      await todoController.findAll(req, res, next);

      // Verify that the next function is called with an error
      expect(next).toHaveBeenCalledWith(new Error("Failed to fetch todos"));

      db.all = originalFindAll;
    });
  });
});
