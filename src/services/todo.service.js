const db = require("../db");

class TodoService {
  constructor() {}

  async findAll() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM todos";

      db.all(query, [], (err, rows) => {
        resolve(rows);
      });
    });
  }

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
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }

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

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todos WHERE id = ?", id, function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes);
      });
    });
  }
}

module.exports = TodoService;
