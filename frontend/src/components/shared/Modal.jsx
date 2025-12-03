import React from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ children, onClose, open }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white bg-white rounded-xl p-6 shadow transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-stone-500  bg-white hover:text-stone-50 hover:text-stone-600 p-2"
        >
          <IoMdClose size={30}/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
