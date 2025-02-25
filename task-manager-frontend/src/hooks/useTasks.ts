import { useState, useEffect } from "react";
import { Task } from "../types/Task";
import { fetchTasks } from "../api/api";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  return { tasks, setTasks };
};
