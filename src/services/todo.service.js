const db = require("../db");

class TodoService {
  constructor() {}

  async findAll(queryFilter = {}) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM todos";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  }

  async findById(id) {
    if (!id) {
      return Promise.reject(new Error("ID is required."));
    }

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todos WHERE id = ?", id, (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todos WHERE email = ?", email, (err, row) => {
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
            reject(err);
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
            reject(err);
            return;
          }

          resolve(this.changes);
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
