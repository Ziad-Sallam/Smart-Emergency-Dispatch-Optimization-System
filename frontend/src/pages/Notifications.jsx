import React from "react";
import { Link } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const Notifications = () => {
  return (
    <div className="flex justify-center bg-white rounded-lg pb-4 shadow w-[90vw] h-[96vh]">
      <ErrorPage/>
    </div>
  );
};

export default Notifications;
