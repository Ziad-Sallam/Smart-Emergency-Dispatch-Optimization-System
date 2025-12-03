import React from "react";
import { MdOutlineDelete } from "react-icons/md";

const DeleteAccount = () => {
  return (
    <div className="flex sticky top-[90%] flex-col border-t py-3 border-stone-300 justify-end text-xs">
      <div className=" flex items-center justify-between">
        <div>
          <div className="flex">
            <MdOutlineDelete size={30} />
            <p className="font-bold py-2">Delete Account</p>
          </div>
          <p className="text-stone-500">Do you want to delete your account?</p>
        </div>
        <button className="w-fit px-2 py-1.5 font-medium bg-primary text-white hover:bg-primary/80 hover:text-white transition-colors rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
