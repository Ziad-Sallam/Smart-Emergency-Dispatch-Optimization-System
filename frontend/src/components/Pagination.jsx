import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center gap-2 text-gray-500 p-4">
      <button
        type="button"
        aria-label="prev"
        className="mr-4 flex items-center gap-2"
      >
        <svg
          className="mt-1.5"
          width="9"
          height="13"
          viewBox="0 0 9 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1 2 6.667 8 12"
            stroke="#111820"
            strokeOpacity=".5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>prev</span>
      </button>

      <div className="flex gap-2 text-sm md:text-base">
        <button
          type="button"
          className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md hover:bg-slate-100/80 transition-all"
        >
          1
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md hover:bg-slate-100/80 transition-all"
        >
          2
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md border border-indigo-500 text-indigo-500 transition-all"
        >
          3
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md hover:bg-slate-100/80 transition-all"
        >
          4
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md hover:bg-slate-100/80 transition-all"
        >
          5
        </button>
      </div>

      <button
        type="button"
        aria-label="next"
        className="ml-4 flex items-center gap-2"
      >
        <span>next</span>
        <svg
          className="mt-1.5"
          width="9"
          height="13"
          viewBox="0 0 9 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="scale(-1 1)"
        >
          <path
            d="M8 1 2 6.667 8 12"
            stroke="#111820"
            strokeOpacity=".5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
