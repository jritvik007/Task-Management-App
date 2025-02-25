import { Request, Response, NextFunction } from "express";
import db from "./database";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Get all tasks
 */
export const getTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 */
export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) {
      res.status(400).json({ message: "Title and category are required" });
      return;
    }

    const createdAt = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO tasks (title, description, category, createdAt) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(title, description, category, createdAt);

    res.status(201).json({ id: result.lastInsertRowid, title, description, category, createdAt });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) {
      res.status(400).json({ message: "Title and category are required" });
      return;
    }

    const stmt = db.prepare(
      "UPDATE tasks SET title = ?, description = ?, category = ? WHERE id = ?"
    );
    const result = stmt.run(title, description, category, req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ id: req.params.id, title, description, category });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task by ID
 */
export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Move expired tasks to the "Timeout" category
 */
export const checkTaskTimeouts = (): void => {
  try {
    const now = new Date().toISOString();

    const updateStmt = db.prepare(
      "UPDATE tasks SET category = 'Timeout' WHERE category != 'Timeout' AND datetime(createdAt, '+30 minutes') < datetime(?)"
    );
    const result = updateStmt.run(now);

    console.log(`✅ ${result.changes} tasks moved to 'Timeout' category`);
  } catch (error) {
    console.error("❌ Error checking task timeouts:", error);
  }
};

/**
 * Fetch streaming data (e.g., Twitch API example)
 */
export const getStreamingData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN!}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};
