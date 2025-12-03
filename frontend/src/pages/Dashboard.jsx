import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex gap-4 p-4 h-full">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
