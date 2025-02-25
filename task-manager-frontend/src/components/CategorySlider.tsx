import React from "react";
import { Task } from "../types/Task";

type CategorySliderProps = {
  selected: Task["category"] | "All";
  onSelect: (category: Task["category"] | "All") => void;
};

const categories: (Task["category"] | "All")[] = ["All", "To Do", "In Progress", "Done", "Timeout"];

const CategorySlider: React.FC<CategorySliderProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-2 p-2 bg-white shadow-md rounded-lg">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-md ${
            selected === category ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySlider;
