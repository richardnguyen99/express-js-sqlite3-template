"use strict";

const db = require("../../db");
const TodoService = require("../todo.service");

describe("Todo Service", () => {
  const todoService = new TodoService();

  describe("initial data", () => {
    it("should return an empty list of todo items", async () => {
      const todos = await todoService.findAll();

      expect(todos).toBeDefined();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos).toHaveLength(0);
    });

    it("should return an undefined todo item", async () => {
      const todo = await todoService.findById(1);

      expect(todo).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new todo item", async () => {
      const todo = {
        title: "Buy groceries",
        completed: false,
        userId: 1,
      };

      const newTodo = await todoService.create(todo);

      expect(newTodo).toBeDefined();
      expect(newTodo).toMatchObject(todo);
    });

    it("should create a list of new todo items", async () => {
      const todos = [
        {
          title: "Read book",
          completed: false,
          userId: 3,
        },
        {
          title: "Walk the dog",
          completed: false,
          userId: 2,
        },
      ];

      for (const todo of todos) {
        const newTodo = await todoService.create(todo);

        expect(newTodo).toBeDefined();
        expect(newTodo).toMatchObject(todo);
      }
    });

    it("should return an error if the todo object is missing", async () => {
      try {
        await todoService.create();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Todo object is required.");
      }
    });

    it("should return an error if the todo object is missing a title", async () => {
      try {
        await todoService.create({ completed: false, userId: 1 });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo object is missing a userId", async () => {
      try {
        await todoService.create({ title: "Buy groceries", completed: false });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo object is missing completed status", async () => {
      try {
        await todoService.create({ title: "Buy groceries", userId: 1 });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo item already exists", async () => {
      try {
        await todoService.create({
          title: "Buy groceries",
          completed: false,
          userId: 1,
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
        expect(err.message).toBe(
          "Todo title must be unique. Found duplicate 'Buy groceries'"
        );
      }
    });

    it("should throw an exception on error", async () => {
      // temporarily change the db.run method to throw an error
      const originalRun = db.run;

      // db.run will be called in the create service routine
      db.run = jest.fn().mockImplementation((query, params, callback) => {
        callback(new Error("Failed to run query"));
      });

      try {
        await todoService.create({
          title: "Buy groceries",
          completed: false,
          userId: 1,
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Failed to run query");
      }

      // restore the original db.run method
      db.run = originalRun;
    });
  });

  describe("findAll", () => {
    it("should return a list of todo items", async () => {
      const todos = await todoService.findAll();

      expect(todos).toBeDefined();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos).toHaveLength(3);
    });

    it("should throw an error on error", async () => {
      // temporarily change the db.all method to throw an error
      const originalAll = db.all;

      // db.all will be called in the findAll service routine
      db.all = jest.fn().mockImplementation((query, params, callback) => {
        callback(new Error("Failed to run query"));
      });

      try {
        await todoService.findAll();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Failed to run query");
      }

      // restore the original db.all method
      db.all = originalAll;
    });
  });

  describe("findById", () => {
    it("should return a todo item by ID = 1", async () => {
      const todo = await todoService.findById(1);

      expect(todo).toBeDefined();
      expect(todo).toMatchObject({
        id: 1,
        title: "Buy groceries",
        completed: 0,
        userId: 1,
      });
    });

    it("should return a todo item by ID = 2", async () => {
      const todo = await todoService.findById(2);

      expect(todo).toBeDefined();
      expect(todo).toMatchObject({
        id: 2,
        title: "Read book",
        completed: 0,
        userId: 3,
      });
    });

    it("should return undefined if the todo item does not exist", async () => {
      const todo = await todoService.findById(100);

      expect(todo).toBeUndefined();
    });

    it("should return an error if the ID is missing", async () => {
      try {
        await todoService.findById();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("ID is required.");
      }
    });

    it("should return an error if the ID is not a number", async () => {
      try {
        await todoService.findById("abc");
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("message");
        expect(err.message).toBe("ID must be a number.");
      }
    });

    it("should return an error if the ID is negative", async () => {
      try {
        await todoService.findById(-1);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("message");
        expect(err.message).toBe("ID must be greater than 0.");
      }
    });

    it("should throw an error on error", async () => {
      // temporarily change the db.all method to throw an error
      const originalAll = db.get;

      // db.all will be called in the findAll service routine
      db.get = jest.fn().mockImplementation((query, params, callback) => {
        callback(new Error("Failed to run db.get"));
      });

      try {
        await todoService.findById(1);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Failed to run db.get");
      }

      // restore the original db.all method
      db.get = originalAll;
    });
  });

  describe("update", () => {
    it("should update a todo item by ID = 1", async () => {
      const todo = {
        id: 1,
        title: "Buy groceries",
        completed: true,
        userId: 1,
      };

      const updatedTodo = await todoService.update(1, todo);

      expect(updatedTodo).toBeDefined();
      expect(updatedTodo).toMatchObject(todo);
    });

    it("should return an error if the ID is missing", async () => {
      try {
        await todoService.update(undefined, {});
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("ID is required.");
      }
    });

    it("should return an error if the todo object is missing", async () => {
      try {
        await todoService.update(1);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Todo object is required.");
      }
    });

    it("should return an error if the todo object is missing a title", async () => {
      try {
        await todoService.update({ completed: false, userId: 1 });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo object is missing a userId", async () => {
      try {
        await todoService.update({ title: "Buy groceries", completed: false });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo object is missing completed status", async () => {
      try {
        await todoService.update({ title: "Buy groceries", userId: 1 });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the query length is 0", async () => {
      try {
        await todoService.update(1, {});
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the params length is 0", async () => {
      try {
        await todoService.update(1, { title: "Buy groceries" });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should return an error if the todo item does not exist", async () => {
      try {
        await todoService.update(100, {
          id: 100,
          title: "Buy groceries",
          completed: false,
          userId: 1,
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("message");
        expect(err.message).toBe("Todo item not found.");
      }
    });

    it("should return an error if the todo object is invalid", async () => {
      try {
        await todoService.update(new Animation(), {
          title: "Buy groceries",
          completed: true,
          invalid: true,
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("message");
      }
    });

    it("should throw an exception on error", async () => {
      // temporarily change the db.run method to throw an error
      const originalRun = db.run;

      // db.run will be called in the update service routine
      db.run = jest.fn().mockImplementation((query, params, callback) => {
        callback(new Error("Failed to run query"));
      });

      try {
        await todoService.update(1, {
          title: "Buy groceries",
          completed: false,
          userId: 1,
        });
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Failed to run query");
      }

      // restore the original db.run method
      db.run = originalRun;
    });
  });

  describe("delete", () => {
    it("should delete a todo item by ID = 1", async () => {
      const todo = await todoService.delete(1);

      expect(todo).toBeDefined();
      expect(todo).toBe(1);
    });

    it("should return an error if the ID is missing", async () => {
      try {
        await todoService.delete();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("ID is required.");
      }
    });

    it("should return an error if the todo item does not exist", async () => {
      try {
        await todoService.delete(100);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toHaveProperty("message");
      }
    });

    it("should throw an exception on error", async () => {
      // temporarily change the db.run method to throw an error
      const originalRun = db.run;

      // db.run will be called in the delete service routine
      db.run = jest.fn().mockImplementation((query, params, callback) => {
        callback(new Error("Failed to run query"));
      });

      try {
        await todoService.delete(1);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Failed to run query");
      }

      // restore the original db.run method
      db.run = originalRun;
    });
  });
});
