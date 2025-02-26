export interface Task {
  id?: number;
  title: string;
  description?: string;
  category: "To Do" | "In Progress" | "Done" | "Timeout";
  status: "To Do" | "In Progress" | "Done" | "Timeout"; // Ensured same values as category
  dueDate?: string;
  createdAt: string;
}
