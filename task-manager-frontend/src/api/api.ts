import axios from "axios";
import { Task } from "../types/Task";

const API_URL = "http://localhost:5000/tasks";

// Valid categories and statuses
const validCategories = ["To Do", "In Progress", "Done", "Timeout"] as const;
const validStatuses = ["To Do", "In Progress", "Done", "Timeout"] as const;

// ✅ Fetch Tasks
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const res = await axios.get(API_URL);
    return res.data.map((task: any) => ({
      ...task,
      category: validCategories.includes(task.category) ? task.category : "To Do",
      status: validStatuses.includes(task.status) ? task.status : "To Do",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null, // Ensure dueDate is valid
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// ✅ Add New Task
export const addTask = async (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
  try {
    const taskWithCreatedAt = { 
      ...task, 
      createdAt: new Date().toISOString(), // Ensure createdAt is present
      status: validStatuses.includes(task.status) ? task.status : "To Do", 
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null, 
    };
    
    const res = await axios.post(API_URL, taskWithCreatedAt);
    return {
      ...res.data,
      category: res.data.category as Task["category"],
      status: res.data.status as Task["status"],
      dueDate: res.data.dueDate ? new Date(res.data.dueDate).toISOString() : null,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
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
    const updatedTask = {
      ...task,
      category: validCategories.includes(task.category) ? task.category : "To Do", // Ensure category is valid
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null, // Ensure proper date format
    };

    const res = await axios.put(`${API_URL}/${task.id}`, updatedTask);

    return {
      ...res.data,
      status: res.data.category, // Ensure status matches category
      dueDate: res.data.dueDate ? new Date(res.data.dueDate).toISOString() : null, // Convert back to ISO
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

