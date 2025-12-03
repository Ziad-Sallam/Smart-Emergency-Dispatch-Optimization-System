import React from "react";
import { FaRegUser } from "react-icons/fa";
import { FaRegBuilding } from "react-icons/fa";
import { AiOutlineAlert } from "react-icons/ai";
const StatCards = () => {
  return (
    <>
      <Card title="Admins" value="5" icon={<FaRegUser size={"30"}/>} />
      <Card title="Emergency Units" value="32" icon={<FaRegBuilding />} />
      <Card title="Current Incidents" value="12" icon={<AiOutlineAlert size={"40"}/>} />
    </>
  );
};

const Card = ({ title, value, icon }) => {
  return (
    <div className="p-4 border-stone-300 rounded border col-span-4 hover:bg-primary/6 transition-[box-shadow,_background-color,_color]">
      <div className="flex items-center justify-center gap-[50%]">
        <div className="flex flex-col items-start justify-between">
          <p className="text-3xl font-semibold">{value}</p>
          <h3 className="mt-2 text-stone-500 text-sm">{title}</h3>
        </div>
        <span className="text-3xl items-center font-bold-300 ">{icon}</span>
      </div>
    </div>
  );
};
export default StatCards;
