import React from "react";
import { BsTable } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "./Pagination";

// Define headers
const tableHeaders = [
  { key: "reportedAt", label: "Reported At" },
  { key: "resolvedAt", label: "Resolved At" },
  { key: "location", label: "Location" },
  { key: "issueType", label: "Issue Type" },
  { key: "severity", label: "Severity" },
  { key: "currentStatus", label: "Current Status" },
];

// Sample data
const tableData = [
  {
    id: 1,
    reportedAt: "2025-12-01 09:15",
    resolvedAt: "2025-12-01 12:30",
    location: "Server Room A",
    issueType: "Network Outage",
    severity: "High",
    currentStatus: "Resolved",
  },
  {
    id: 2,
    reportedAt: "2025-12-02 14:50",
    resolvedAt: "-",
    location: "Office Floor 3",
    issueType: "Printer Jam",
    severity: "Low",
    currentStatus: "In Progress",
  },
  {
    id: 3,
    reportedAt: "2025-12-02 08:20",
    resolvedAt: "2025-12-02 10:00",
    location: "Lobby",
    issueType: "Power Fluctuation",
    severity: "Medium",
    currentStatus: "Resolved",
  },
  {
    id: 4,
    reportedAt: "2025-12-03 11:05",
    resolvedAt: "-",
    location: "Conference Room B",
    issueType: "Projector Issue",
    severity: "Low",
    currentStatus: "Open",
  },
];

const Table = () => {
  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 m-4 w-full">
      <div className="pb-4 flex items-center p-4 justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <BsTable className="mr-1" size={20} />
          <span>Today's Incidents</span>
        </h3>
        <button className="text-smflex text-sm items-center gap-2 bg-accent text-white font-medium transition-colors hover:bg-accent/80 hover:text-white px-3 py-1.5 rounded">
          Add User
        </button>
      </div>
      <table className="w-full table-auto">
        <TableHead />
        <TableBody />
      </table>
      <Pagination />
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500 text-left">
        {tableHeaders.map((header) => (
          <th key={header.key} className="px-4 py-2">
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow = ({ data, order }) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      {tableHeaders.map((header) => (
        <td key={header.key} className="px-4 py-2">
          {data[header.key]}
        </td>
      ))}
      <td className="w-8 flex items-start">
        <button className="hover:bg-stone-200 transitions-colors grid place-content-center rounded text-sm size-8">
          <MdOutlineDelete size={20} className="text-indigo-500" />
        </button>
      </td>
    </tr>
  );
};

const TableBody = () => {
  return (
    <tbody>
      {tableData.map((row, index) => (
        <TableRow key={row.id} order={index} data={row} />
      ))}
    </tbody>
  );
};

export default Table;
