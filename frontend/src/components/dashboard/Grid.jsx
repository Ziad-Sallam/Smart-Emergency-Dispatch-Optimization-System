import React from "react";
import StatCards from "./StatCards";
import ActivityGraph from "./ActivityGraph";
import MapView from"../shared/MapView"

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <ActivityGraph />
      <MapView/>
    </div>
  );
};

export default Grid;
