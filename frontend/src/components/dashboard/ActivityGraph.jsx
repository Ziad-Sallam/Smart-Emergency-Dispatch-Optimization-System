import React from "react";
import { LuChartLine } from "react-icons/lu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// #region Sample data, will be replaced with real data later
const data = [
  {
    name: "Page A",
    incidents: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    incidents: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    incidents: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    incidents: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    incidents: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    incidents: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    incidents: 4300,
    amt: 2100,
  },
];
const ActivityGraph = () => {
  return (
    <div className="col-span-6 overflow-hidden rounded border border-stone-300 p-4">
      <div className="pb-4 flex justify-center">
        <h3 className="flex items-center gap-1.5 font-medium">
          <LuChartLine className="mr-1" size={20}/>
          <span>Incidents Graph</span>
        </h3>
      </div>
      <div className="px-4">
        <LineChart
          style={{
            width: "100%",
            maxWidth: "700px",
            height: "100%",
            maxHeight: "70vh",
            aspectRatio: 1.618,
          }}
          responsive
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip wrapperClassName="text-sm rounded" labelClassName="font-bold text-primary"/>
          <Legend />
          <Line
            type="monotone"
            dataKey="incidents"
            stroke="var(--color-primary)"
            fill="var(--color-secondary)"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default ActivityGraph;
