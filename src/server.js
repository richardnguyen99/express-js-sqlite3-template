const app = require("./app");
const db = require("./db");

const PORT = process.env.PORT || 3000;

// Start the server in a waterfall fashion to ensure the database is created
// and seeded before starting the server.
db.serialize(() => {
  db.run(
    `--sql
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
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
        console.error("Error creating tables", err);
        process.exit(1);
      }

      console.log("Tables created");

      // Insert some sample data
      db.run(
        `--sql
            INSERT INTO todos (title, completed, userId) VALUES
            ('Buy groceries', 0, 1),
            ('Walk the dog', 0, 1),
            ('Do laundry', 0, 2),
            ('Wash the car', 0, 2),
            ('Water the plants', 0, 3),
            ('Mow the lawn', 0, 3),
            ('Take out the trash', 0, 4),
            ('Vacuum the house', 0, 4),
            ('Pick up Johnny from school', 0, 5),
            ('Drop off dry cleaning', 0, 5);
            `,
        function (err) {
          if (err) {
            console.error("Error inserting data: ", err);
            process.exit(1);
          }

          console.log("Sample data inserted: ", this.changes);

          app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
          });
        }
      );
    }
  );

  db.once("open", function () {
    console.log("Database connected");
  });

  db.on("error", function (err) {
    console.error("Database error", err);
  });
});
