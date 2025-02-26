import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import { Task } from "../types/Task";

type TaskFormProps = {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  existingTask?: Task; // <-- Optional prop for editing
};

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, existingTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Task["category"]>("To Do");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Populate form if editing an existing task
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setCategory(existingTask.category);
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate) : null);
    }
  }, [existingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      alert("Please enter a title and select a category!");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      status: "To Do", // Add a default status or use a state variable if needed
    });

    // Clear form after submission if adding a new task
    if (!existingTask) {
      setTitle("");
      setDescription("");
      setCategory("To Do");
      setDueDate(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">
        {existingTask ? "Edit Task" : "Add New Task"}
      </h2>

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
        {existingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
