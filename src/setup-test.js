"use strict";

const db = require("./db");

// Create the table before running any tests
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

    CREATE TABLE IF NOT EXISTS empty_dbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT
    )
    
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

// Drop the table after all tests are done
afterAll(() => {
  db.run(`DROP TABLE todos`);
  db.close();
});
