import React from "react";
import { FiCalendar } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            🚀 Good morning, Admin!
          </span>
          <span className="text-xs block text-stone-500">
            Wednesday, Dec 12th 2025
          </span>
        </div>
        <button className="flex text-sm items-center gap-2 bg-accent text-white font-medium transition-colors hover:bg-accent/80 hover:text-white px-3 py-1.5 rounded">
          <FiCalendar />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
