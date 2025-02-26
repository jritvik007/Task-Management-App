export type Task = {
  id: number;
  title: string;
  description: string;
  category: "To Do" | "In Progress" | "Done" | "Timeout"; // Ensure category is defined properly
  status: "To Do" | "In Progress" | "Done" | "Timeout"; // Keep status field
  dueDate?: string; // Keep optional dueDate
  createdAt: string;
};
