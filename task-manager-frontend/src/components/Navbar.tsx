import { useState } from "react";

type NavbarProps = {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
};

const Navbar = ({ onSearch, onFilter }: NavbarProps) => {
  const [query, setQuery] = useState("");

  return (
    <nav className="flex justify-between bg-blue-600 text-white p-4">
      <h1 className="text-xl font-bold">Task Management App</h1>
      <input
        type="text"
        placeholder="Search tasks..."
        className="p-2 text-black rounded"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <select
        className="p-2 text-black rounded"
        onChange={(e) => onFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </nav>
  );
};

export default Navbar;
