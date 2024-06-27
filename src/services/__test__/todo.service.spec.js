const db = require("../../db");
const TodoService = require("../todo.service");

describe("TodoService", () => {
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
      }
    });
  });
});
