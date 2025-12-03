import React from "react";
import AccountToggle from "./AccountToggle";
import RouteSelect from "./RouteSelect";
import DeleteAccount from "./DeleteAccount";

const Sidebar = () => {
  return (
    <div className="w-[15vw] ">
      <div className=" sticky top-4 h-[calc(100vh - 32px - 48px)]">
        <AccountToggle />
        <RouteSelect />
      </div>
      <DeleteAccount />
    </div>
  );
};

export default Sidebar;
