import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import CategorySlider from "../components/CategorySlider";
import { fetchTasks, addTask, deleteTask, updateTask } from "../api/api";
import { Task } from "../types/Task";
import { Search } from "lucide-react"; // Import search icon

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Task["category"] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tasks from API
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, []);

  // Filter tasks based on category and search query
  useEffect(() => {
    let filtered = tasks;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  }, [tasks, selectedCategory, searchQuery]);

  // Handle adding a task
  const handleAddTask = async (newTask: Omit<Task, "id" | "createdAt">) => {
    try {
      const taskToAdd: Omit<Task, "id"> = {
        ...newTask,
        createdAt: new Date().toISOString(), // Ensure createdAt is included
      };

      const addedTask = await addTask(taskToAdd);
      setTasks((prev) => [...prev, addedTask]); // Update state properly
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const newTask = await updateTask(updatedTask);

      // Ensure the task updates in state
      setTasks((prev) =>
        prev.map((task) => (task.id === newTask.id ? newTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 p-4 text-white rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-3 py-1 text-black rounded-md pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        </div>
      </nav>

      {/* Category Filter */}
      <CategorySlider selected={selectedCategory} onSelect={(category) => setSelectedCategory(category)} />

      {/* Task Form */}
      <div className="my-4">
        <TaskForm onSubmit={handleAddTask} />
      </div>

      {/* Task List */}
      <TaskList tasks={filteredTasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
    </div>
  );
};

export default Home;
