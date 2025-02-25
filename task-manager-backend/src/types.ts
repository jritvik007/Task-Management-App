export interface Task {
    id?: number;
    title: string;
    description: string;
    category: "To Do" | "In Progress" | "Done" | "Timeout";
    createdAt: string;
  }
  