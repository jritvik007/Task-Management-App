"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamingData = exports.checkTaskTimeouts = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const database_1 = __importDefault(require("./database"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Get all tasks
 */
const getTasks = (req, res, next) => {
    try {
        const tasks = database_1.default.prepare("SELECT * FROM tasks").all();
        res.json(tasks);
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
/**
 * Get a single task by ID
 */
const getTaskById = (req, res, next) => {
    try {
        const task = database_1.default.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
/**
 * Create a new task
 */
const createTask = (req, res, next) => {
    try {
        let { title, description = "", category, status, dueDate = null } = req.body;
        if (!title || !category) {
            res.status(400).json({ message: "Title and category are required" });
            return;
        }
        if (!["To Do", "In Progress", "Done", "Timeout"].includes(category)) {
            res.status(400).json({ message: "Invalid category" });
            return;
        }
        status = category;
        const createdAt = new Date().toISOString();
        const stmt = database_1.default.prepare("INSERT INTO tasks (title, description, category, status, dueDate, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
        const result = stmt.run(title, description, category, status, dueDate, createdAt);
        res.status(201).json({ id: result.lastInsertRowid, title, description, category, status, dueDate, createdAt });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
/**
 * Update an existing task
 */
const updateTask = (req, res, next) => {
    try {
        const { title, description, category, dueDate } = req.body;
        const existingTask = database_1.default.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
        if (!existingTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        const updatedTitle = title !== undefined ? title : existingTask.title;
        const updatedDescription = description !== undefined ? description : existingTask.description;
        const updatedCategory = category !== undefined ? category : existingTask.category;
        const updatedDueDate = dueDate !== undefined ? dueDate : existingTask.dueDate;
        const stmt = database_1.default.prepare("UPDATE tasks SET title = ?, description = ?, category = ?, dueDate = ? WHERE id = ?");
        const result = stmt.run(updatedTitle, updatedDescription, updatedCategory, updatedDueDate, req.params.id);
        if (result.changes === 0) {
            res.status(400).json({ message: "No changes made" });
            return;
        }
        res.json({
            id: req.params.id,
            title: updatedTitle,
            description: updatedDescription,
            category: updatedCategory,
            dueDate: updatedDueDate,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
/**
 * Delete a task by ID
 */
const deleteTask = (req, res, next) => {
    try {
        const stmt = database_1.default.prepare("DELETE FROM tasks WHERE id = ?");
        const result = stmt.run(req.params.id);
        if (result.changes === 0) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
/**
 * Move expired tasks to the "Timeout" category
 */
const checkTaskTimeouts = () => {
    try {
        const now = new Date().toISOString();
        const updateStmt = database_1.default.prepare("UPDATE tasks SET category = 'Timeout', status = 'Timeout' WHERE category != 'Timeout' AND datetime(createdAt, '+30 minutes') < datetime(?)");
        const result = updateStmt.run(now);
        console.log(`✅ ${result.changes} tasks moved to 'Timeout' category`);
    }
    catch (error) {
        console.error("❌ Error checking task timeouts:", error);
    }
};
exports.checkTaskTimeouts = checkTaskTimeouts;
/**
 * Fetch streaming data from Twitch API
 */
const getStreamingData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://api.twitch.tv/helix/streams", {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching Twitch data:", error);
        res.status(500).json({ message: "Failed to fetch streaming data" });
    }
});
exports.getStreamingData = getStreamingData;
