import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import { Task } from "../types/Task";

type TaskFormProps = {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Task["category"]>("To Do");
  const [dueDate, setDueDate] = useState<Date | null>(null); // Store due date
  const [showCalendar, setShowCalendar] = useState(false); // Toggle calendar visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert("Please enter a title and select a due date!");
      return;
    }

    onSubmit({
      title,
      description,
      category,
      dueDate: dueDate.toISOString(), // Convert date to string format
    });

    setTitle("");
    setDescription("");
    setCategory("To Do");
    setDueDate(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Add New Task</h2>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Task["category"])}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
        <option value="Timeout">Timeout</option>
      </select>

      {/* Due Date Selector */}
      <div className="relative mb-2">
        <label className="block font-medium mb-1">Due Date:</label>
        <button
          type="button"
          className="w-full p-2 border rounded-md bg-gray-200"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {dueDate ? dueDate.toDateString() : "Select Due Date"}
        </button>

        {showCalendar && (
          <div className="absolute bg-white shadow-lg p-2 rounded-md mt-2 z-10">
            <Calendar
              onChange={(date) => {
                setDueDate(date as Date);
                setShowCalendar(false);
              }}
              value={dueDate}
            />
          </div>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
