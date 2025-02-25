import React from "react";
import { Task } from "../types/Task";
import { Trash, Edit } from "lucide-react"; // Import icons

type TaskItemProps = {
  task: Task;
  onDelete: (taskId: number) => void;
  onUpdate: (task: Task) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onUpdate }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
      <div>
        <h3 className="font-bold">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
        <span className="text-sm text-blue-500">{task.category}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onUpdate(task)}
          className="p-2 bg-green-500 text-white rounded-md"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white rounded-md"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
