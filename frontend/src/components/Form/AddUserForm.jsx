import React, { useState } from "react";
import Modal from "../shared/Modal";

const AddUserForm = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DISPATCHER");

  const handleSubmit = () => {
    const newUser = { name, email, password, role };
    if (onSubmit) onSubmit(newUser);
    onClose(); // close modal after submission
  };

  return (
      <div className="flex flex-col items-start ">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add New User
        </h2>

        <label className="block mb-2" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="w-full border mt-1 border-gray-300 focus:border-indigo-500 outline-none rounded py-2.5 px-4 mb-4"
        />

        <label className="block mb-2" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full border mt-1 border-gray-300 focus:border-indigo-500 outline-none rounded py-2.5 px-4 mb-4"
        />

        <label className="block mb-2" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border mt-1 border-gray-300 focus:border-indigo-500 outline-none rounded py-2.5 px-4 mb-4"
        />

        <label className="block mb-2" htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border mt-1 border-gray-300 focus:border-indigo-500 outline-none rounded py-2.5 px-4 mb-6"
        >
          <option value="DISPATCHER">Dispatcher</option>
          <option value="RESPONDER">Responder</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-indigo-700 text-white font-medium py-2.5 rounded transition"
        >
          Add User
        </button>
      </div>
  );
};

export default AddUserForm;
