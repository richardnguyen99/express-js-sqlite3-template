const { getMockReq, getMockRes } = require("@jest-mock/express");

const db = require("../../db");
const { TodoController } = require("../todo.controller");

describe("Todo Controller", () => {
  const todoController = new TodoController();

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      db.run(
        /*sql*/ `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0,
      userId INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create a trigger to update the updatedAt column when a todo item is updated
    CREATE TRIGGER IF NOT EXISTS update_todo
    AFTER UPDATE ON todos
    BEGIN
      UPDATE todos SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
    `,
        function (err) {
          if (err) {
            reject(err);
          }

          resolve();
        }
      );
    });
  });

  describe("create", () => {
    it("should return an error if the todo object is missing", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();

      try {
        // Next function is called when an error occurs. However, this will
        // be handled at route level, not controller level.
        await todoController.create(req, res, next);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Todo object is required.");
        expect(next).toHaveBeenCalledWith(err);
      }
    });

    it("should create a new todo item", async () => {
      const req = getMockReq({
        body: {
          title: "Buy groceries",
          completed: false,
          userId: 1,
        },
      });
      const { res, next } = getMockRes();

      await todoController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: expect.any(Number),
        title: "Buy groceries",
        completed: false,
        userId: 1,
      });
    });

    it("should return an error if the todo item cannot be created", async () => {
      const req = getMockReq({
        body: {
          title: "Buy groceries",
          completed: false,
          userId: 1,
        },
      });
      const { res, next } = getMockRes();

      try {
        // Next function is called when an error occurs. However, this will
        // be handled at route level, not controller level.
        await todoController.create(req, res, next);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("UNIQUE constraint failed: todos.title");
        expect(next).toHaveBeenCalledWith(err);
      }
    });

    it("should return an error if the title is missing", async () => {
      const req = getMockReq({
        body: {
          completed: false,
          userId: 1,
        },
      });
      const { res, next } = getMockRes();

      try {
        // Next function is called when an error occurs. However, this will
        // be handled at route level, not controller level.
        await todoController.create(req, res, next);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Title is required");
        expect(next).toHaveBeenCalledWith(err);
      }
    });
  });

  afterAll(() => {
    db.run(`DROP TABLE todos`);
    db.close();
  });
});
