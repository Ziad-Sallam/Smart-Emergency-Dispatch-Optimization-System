import React from "react";
import TopBar from "../components/TopBar";
import Grid from "../components/Grid";
import BreadCrumbs from "../components/BreadCrumbs";
import Table from "../components/Table";

const AnalyticsPage = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow w-[90vw] ">
      <BreadCrumbs parentPath={"Dashboard"} currentPath={"Analytics"} />
      <TopBar />
      <Grid />
      <Table />
    </div>
  );
};

export default AnalyticsPage;
