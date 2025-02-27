"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default("tasks.db");
// Get the table structure
const columns = db.prepare(`PRAGMA table_info(tasks);`).all();
const hasDescription = columns.some((col) => col.name === "description");
const hasCategory = columns.some((col) => col.name === "category");
const hasStatus = columns.some((col) => col.name === "status");
const hasDueDate = columns.some((col) => col.name === "dueDate");
// If table does not exist, create it
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK(category IN ('To Do', 'In Progress', 'Done', 'Timeout')) NOT NULL DEFAULT 'To Do',
    status TEXT CHECK(status IN ('To Do', 'In Progress', 'Done', 'Timeout')) NOT NULL DEFAULT 'To Do',
    dueDate TEXT,
    createdAt TEXT NOT NULL
  );
`);
// Add missing columns (Ensure category and status exist)
if (!hasDescription) {
    db.exec(`ALTER TABLE tasks ADD COLUMN description TEXT;`);
}
if (!hasCategory) {
    db.exec(`ALTER TABLE tasks ADD COLUMN category TEXT CHECK(category IN ('To Do', 'In Progress', 'Done', 'Timeout')) DEFAULT 'To Do';`);
}
if (!hasStatus) {
    db.exec(`ALTER TABLE tasks ADD COLUMN status TEXT CHECK(status IN ('To Do', 'In Progress', 'Done', 'Timeout')) DEFAULT 'To Do';`);
}
if (!hasDueDate) {
    db.exec(`ALTER TABLE tasks ADD COLUMN dueDate TEXT;`);
}
exports.default = db;
