import React from "react";
import TaskItem from "./TaskItem";
import { Task } from "../types/Task";

type TaskListProps = {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onUpdate: (task: Task) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks found.</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default TaskList;
