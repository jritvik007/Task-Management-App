import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import CategorySlider from "../components/CategorySlider";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { fetchTasks, addTask, deleteTask, updateTask } from "../api/api";
import { Task } from "../types/Task";

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Task["category"] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for calendar

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
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split("T")[0];
      filtered = filtered.filter((task) => task.dueDate.startsWith(selectedDateString));
    }
    setFilteredTasks(filtered);
  }, [tasks, selectedCategory, searchQuery, selectedDate]);

  const handleAddTask = async (newTask: Omit<Task, "id" | "createdAt">) => {
    try {
      const taskToAdd: Omit<Task, "id"> = {
        ...newTask,
        createdAt: new Date().toISOString(), // Auto-generate createdAt
      };
      const addedTask = await addTask(taskToAdd);
      setTasks((prev) => [...prev, addedTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center bg-blue-600 p-4 text-white rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          className="px-3 py-1 text-black rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </nav>

           {/* Category Filter */}
           <CategorySlider selected={selectedCategory} onSelect={setSelectedCategory} />


      

      {/* Task Form */}
      <div className="my-4">
        <TaskForm onSubmit={handleAddTask} />
      </div>

      {/* Task List */}
      <TaskList tasks={filteredTasks} onDelete={deleteTask} onUpdate={updateTask} />
    </div>
  );
};

export default Home;
