const sqlite3 = require("sqlite3");

// Create a new database in memory
// To create a new database on disk, replace ":memory:" with a path to a file.
// For example, `const db = new sqlite3.Database("path/to/database.db");`
const db = new sqlite3.Database(":memory:");

module.exports = db;
