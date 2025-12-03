import React, { useState } from "react";
import ErrorPage from "./ErrorPage";
import Table from "../components/shared/Table";
import { MdOutlineDelete } from "react-icons/md";
import Modal from "../components/shared/Modal";
import AddUserForm from "../components/Form/AddUserForm";
import AddEmergencyUnitForm from "../components/Form/AddEmergencyForm";
const stationHeaders = [
  { key: "station_id", label: "Station ID" },
  { key: "type", label: "Type" },
  { key: "location", label: "Location" },
  { key: "zone", label: "Zone" },
];
const stations = [
  { station_id: 1, type: "FIRE", location: "Downtown", zone: "Zone 1" },
  { station_id: 2, type: "POLICE", location: "Central Park", zone: "Zone 2" },
  { station_id: 3, type: "MEDICAL", location: "City Hospital", zone: "Zone 1" },
  { station_id: 4, type: "FIRE", location: "West End", zone: "Zone 3" },
  { station_id: 5, type: "POLICE", location: "East Side", zone: "Zone 2" },
  { station_id: 6, type: "MEDICAL", location: "North Clinic", zone: "Zone 3" },
];

const userHeaders = [
  { key: "user_id", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];
const users = [
  {
    user_id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    password: "hashed_pass1",
    role: "ADMIN",
  },
  {
    user_id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "hashed_pass2",
    role: "DISPATCHER",
  },
  {
    user_id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_pass3",
    role: "RESPONDER",
  },
  {
    user_id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    password: "hashed_pass4",
    role: "DISPATCHER",
  },
  {
    user_id: 5,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: "hashed_pass5",
    role: "RESPONDER",
  },
  {
    user_id: 6,
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    password: "hashed_pass6",
    role: "ADMIN",
  },
];

const UserManagement = () => {
  const [openStationModal, setOpenStationModal] = React.useState(false);
  const [openUserModal, setOpenUserModal] = React.useState(false);

  return (
    <div className="flex justify-center bg-white rounded-lg pb-4 shadow w-[90vw] h-[96vh]">
      {/* Emergency Units Table */}
      <Table
        title="Emergency Units"
        headers={stationHeaders}
        data={stations}
        onAddClick={() => setOpenStationModal(true)}
        actions={[MdOutlineDelete]}
        buttonTitle={"Add Station"}
      />
      {openStationModal && (
        <Modal onClose={() => setOpenStationModal(false)} open={openStationModal}>
          <AddEmergencyUnitForm />
        </Modal>
      )}
      <Table
        title="Total Users"
        headers={userHeaders}
        data={users}
        onAddClick={() => setOpenUserModal(true)}
        actions={[MdOutlineDelete]}
        buttonTitle={"Add User"}
      />
      {openUserModal && (
        <Modal onClose={() => setOpenUserModal(false)} open={openUserModal}>
          <AddUserForm />
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
