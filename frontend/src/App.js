import React from "react";
import Navbar from "./components/homepage/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Banner from "./components/homepage/Banner";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import MapPage from "./pages/MapPage";
import UserManagment from "./pages/UserManagment";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="users" element={<UserManagment />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
