import React from "react";

const Pagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center gap-2 text-gray-500 p-4 text-medium flex-wrap">
      <button
        type="button"
        aria-label="prev"
        className="mr-4 flex items-center gap-2"
        onClick={handlePrev}
        disabled={currentPage === 1}
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

      <div className="flex gap-2 text-sm md:text-base flex-wrap justify-center">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange && onPageChange(page)}
            className={`flex items-center justify-center w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md transition-all ${
              page === currentPage
                ? "border border-indigo-500 text-indigo-500"
                : "hover:bg-slate-100/80"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="next"
        className="ml-4 flex items-center gap-2"
        onClick={handleNext}
        disabled={currentPage === totalPages}
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
