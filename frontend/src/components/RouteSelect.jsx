import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import { RiMapPin2Line } from "react-icons/ri";
import ChangePassword from "../pages/ChangePassword";

const RouteSelect = () => {
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1); // go back to previous page
  };
  return (
    <div className="space-y-1">
      <Route
        to="/dashboard/analytics"
        Icon={FaChartBar}
        title="Analytics"
        selected={true}
      />
      <Route to="/dashboard/map" Icon={RiMapPin2Line} title="Map View" />
      <Route to="/dashboard/users" Icon={GoPeople} title="User Management" />
      <Route
        to="/dashboard/notifications"
        Icon={IoMdNotificationsOutline}
        title="Notifications"
      />
      <Route
        to={"/dashboard/change-password"}
        Icon={RiLockPasswordLine}
        title="Change Password"
        Component={ChangePassword}
        componentProps={{
          open: openChangePassword,
          onClose: () => {
            setOpenChangePassword(false);
            handleClose();
          },
        }}
        handleClick={() => setOpenChangePassword(true)}
      />
      <Route to="/dashboard/logout" Icon={LuLogOut} title="Logout" />
    </div>
  );
};

const Route = ({ Icon, title, to, handleClick, Component, componentProps }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <>
      {!Component ? (
        <Link
          to={to}
          className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
            isActive
              ? "bg-primary text-stone-950 shadow text-white"
              : "hover:bg-primary/6 bg-transparent text-stone-500 shadow-none"
          }`}
        >
          <Icon />
          <span>{title}</span>
        </Link>
      ) : (
        <>
          <button
            onClick={handleClick}
            className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
              isActive
                ? "bg-primary text-stone-950 shadow text-white"
                : "hover:bg-primary/6 bg-transparent text-stone-500 shadow-none"
            }`}
          >
            <Icon />
            <span>{title}</span>
          </button>
          {isActive && Component && <Component {...componentProps} />}
        </>
      )}
    </>
  );
};

export default RouteSelect;
