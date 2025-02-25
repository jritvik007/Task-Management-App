import axios from "axios";
import { Task } from "../types/Task";

const API_URL = "http://localhost:5000/tasks";

// Validate category before assignment
const validCategories = ["To Do", "In Progress", "Done", "Timeout"] as const;

// ✅ Fetch Tasks
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const res = await axios.get(API_URL);
    return res.data.map((task: any) => ({
      ...task,
      category: validCategories.includes(task.category) ? task.category : "To Do",
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// ✅ Add New Task
export const addTask = async (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    const taskWithCreatedAt = { ...task, createdAt: new Date().toISOString() }; // Ensure createdAt is present
    const res = await axios.post(API_URL, taskWithCreatedAt);
    return {
      ...res.data,
      category: res.data.category as "To Do" | "In Progress" | "Done" | "Timeout",
    };
  };
  

// ✅ Delete Task
export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// ✅ Update Task
export const updateTask = async (task: Task): Promise<Task> => {
  try {
    const res = await axios.put(`${API_URL}/${task.id}`, task);
    return {
      ...res.data,
      category: validCategories.includes(res.data.category) ? res.data.category : "To Do",
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

