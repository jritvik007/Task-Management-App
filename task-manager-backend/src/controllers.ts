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
    let { title, description = "", category, status, dueDate = null } = req.body;

    console.log("Received:", req.body); // Debugging

    if (!title || !category) {
      res.status(400).json({ message: "Title and category are required" });
      return;
    }

    if (!["To Do", "In Progress", "Done", "Timeout"].includes(category)) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }

    // Force category and status to be the same
    status = category;

    const createdAt = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO tasks (title, description, category, status, dueDate, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(title, description, category, status, dueDate, createdAt);

    res.status(201).json({ id: result.lastInsertRowid, title, description, category, status, dueDate, createdAt });
  } catch (error) {
    next(error);
  }
};




/**
 * Update an existing task
 */
export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, description, category, dueDate } = req.body;

    // Fetch existing task from the database
    const existingTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id) as {
      title: string;
      description: string;
      category: string;
      dueDate?: string;
    } | undefined;

    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Use existing values if new ones are not provided
    const updatedTitle = title !== undefined ? title : existingTask.title;
    const updatedDescription = description !== undefined ? description : existingTask.description;
    const updatedCategory = category !== undefined ? category : existingTask.category;
    const updatedDueDate = dueDate !== undefined ? dueDate : existingTask.dueDate;

    console.log(`🔄 Updating Task ${req.params.id}: ${updatedTitle}, ${updatedCategory}`);

    // Update the task in the database
    const stmt = db.prepare(
      "UPDATE tasks SET title = ?, description = ?, category = ?, dueDate = ? WHERE id = ?"
    );
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
      "UPDATE tasks SET category = 'Timeout', status = 'Timeout' WHERE category != 'Timeout' AND datetime(createdAt, '+30 minutes') < datetime(?)"
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
