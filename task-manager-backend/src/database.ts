import Database from "better-sqlite3";

const db = new Database("tasks.db");

// Get the table structure
const columns = db.prepare(`PRAGMA table_info(tasks);`).all();
const hasDescription = columns.some((col: any) => col.name === "description");
const hasCategory = columns.some((col: any) => col.name === "category");

// If table does not exist, create it
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

// Add missing columns
if (!hasDescription) {
  db.exec(`ALTER TABLE tasks ADD COLUMN description TEXT;`);
}

if (!hasCategory) {
  db.exec(`ALTER TABLE tasks ADD COLUMN category TEXT CHECK(category IN ('To Do', 'In Progress', 'Done', 'Timeout'));`);
}

export default db;
