import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
const AccountToggle = () => {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <div className="text-start">
          <span className="text-sm font-bold block">John Doe</span>
          <span className="text-xs  block text-stone-500">
            JohnDoe@gmail.com
          </span>
        </div>
      </button>
    </div>
  );
};

export default AccountToggle;
