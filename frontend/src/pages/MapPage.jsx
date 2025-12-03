import React from "react";
import ErrorPage from "./ErrorPage";
import Table from "../components/shared/Table";
import { MdOutlineDelete } from "react-icons/md";
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
  {
    id: 5,
    reportedAt: "2025-12-03 09:30",
    resolvedAt: "2025-12-03 11:00",
    location: "Server Room B",
    issueType: "Server Crash",
    severity: "High",
    currentStatus: "Resolved",
  },
  {
    id: 6,
    reportedAt: "2025-12-04 13:20",
    resolvedAt: "-",
    location: "Office Floor 2",
    issueType: "Internet Slow",
    severity: "Medium",
    currentStatus: "In Progress",
  },
  {
    id: 7,
    reportedAt: "2025-12-04 15:45",
    resolvedAt: "2025-12-04 16:30",
    location: "Lobby",
    issueType: "Door Sensor Error",
    severity: "Low",
    currentStatus: "Resolved",
  },
  {
    id: 8,
    reportedAt: "2025-12-05 10:15",
    resolvedAt: "-",
    location: "Conference Room A",
    issueType: "Air Conditioning Issue",
    severity: "Medium",
    currentStatus: "Open",
  },
  {
    id: 9,
    reportedAt: "2025-12-05 14:10",
    resolvedAt: "2025-12-05 15:00",
    location: "Server Room C",
    issueType: "Network Outage",
    severity: "High",
    currentStatus: "Resolved",
  },
  {
    id: 10,
    reportedAt: "2025-12-06 09:00",
    resolvedAt: "-",
    location: "Office Floor 1",
    issueType: "Printer Jam",
    severity: "Low",
    currentStatus: "In Progress",
  },
  {
    id: 11,
    reportedAt: "2025-12-06 11:20",
    resolvedAt: "2025-12-06 12:00",
    location: "Lobby",
    issueType: "Power Fluctuation",
    severity: "Medium",
    currentStatus: "Resolved",
  },
  {
    id: 12,
    reportedAt: "2025-12-07 10:50",
    resolvedAt: "-",
    location: "Conference Room C",
    issueType: "Projector Issue",
    severity: "Low",
    currentStatus: "Open",
  },
  {
    id: 13,
    reportedAt: "2025-12-07 14:30",
    resolvedAt: "2025-12-07 16:00",
    location: "Server Room D",
    issueType: "Server Crash",
    severity: "High",
    currentStatus: "Resolved",
  },
  {
    id: 14,
    reportedAt: "2025-12-08 09:25",
    resolvedAt: "-",
    location: "Office Floor 4",
    issueType: "Internet Slow",
    severity: "Medium",
    currentStatus: "In Progress",
  },
];
const MapPage = () => {
  return (
    <div className="flex justify-center bg-white rounded-lg pb-4 shadow w-[90vw] h-[96vh]">
      <Table
        title="Incidents"
        headers={tableHeaders}
        data={tableData}
      />
    </div>
  );
};

export default MapPage;
