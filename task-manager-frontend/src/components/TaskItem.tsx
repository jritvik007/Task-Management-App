import React, { useState, useEffect } from "react";
import { Task } from "../types/Task";
import { Trash, Edit, Check, X } from "lucide-react"; // Import icons

type TaskItemProps = {
  task: Task;
  onDelete: (taskId: number) => void;
  onUpdate: (updatedTask: Task) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Sync editedTask when task updates
  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTask),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      onUpdate(responseData); // ✅ Update UI immediately
      setIsEditing(false); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  
  
  
  
  

  const handleCancel = () => {
    setEditedTask({ ...task }); // Reset edits
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="flex flex-col p-4 bg-white shadow-md rounded-lg">
      {isEditing ? (
        <>
          {/* Editable Title */}
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="border p-2 rounded-md w-full mb-2"
            placeholder="Task Title"
          />

          {/* Editable Description */}
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="border p-2 rounded-md w-full mb-2"
            placeholder="Task Description"
          />

          {/* Status Dropdown */}
          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task["status"] })}
            className="border p-2 rounded-md w-full mb-2"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Timeout">Timeout</option>
          </select>

          {/* Due Date Picker */}
          <input
            type="date"
            value={editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value).toISOString() })}
            className="border p-2 rounded-md w-full mb-2"
          />

          {/* Save & Cancel Buttons */}
          <div className="flex space-x-2">
            <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-md">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="p-2 bg-gray-500 text-white rounded-md">
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Display Mode */}
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>

          {/* Status Display */}
          <p className="text-sm text-blue-500 font-semibold">
            Status: <span className="text-gray-800">{task.status}</span>
          </p>

          {/* Due Date Display */}
          <p className="text-sm text-gray-500">
            Due:{" "}
            <span className="text-gray-800">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            </span>
          </p>

          {/* Edit & Delete Buttons */}
          <div className="flex space-x-2 mt-2">
            <button onClick={() => setIsEditing(true)} className="p-2 bg-blue-500 text-white rounded-md">
              <Edit size={16} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-2 bg-red-500 text-white rounded-md">
              <Trash size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
