import React, { useState } from "react";

const AddEmergencyUnitForm = ({ onClose, onSubmit }) => {
  const [type, setType] = useState("FIRE");
  const [location, setLocation] = useState("");
  const [zone, setZone] = useState("");

  const handleSubmit = () => {
    const newUnit = { type, location, zone };
    if (onSubmit) onSubmit(newUnit);
    onClose();
  };

  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add Emergency Unit
      </h2>

      <label htmlFor="type">Type</label>
      <select
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4"
      >
        <option value="FIRE">FIRE</option>
        <option value="POLICE">POLICE</option>
        <option value="MEDICAL">MEDICAL</option>
      </select>

      <label htmlFor="location" className="mt-4 block">
        Location
      </label>
      <input
        id="location"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4"
      />

      <label htmlFor="zone" className="mt-4 block">
        Zone
      </label>
      <input
        id="zone"
        type="text"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        placeholder="Enter zone"
        className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full my-3 bg-gray-800 active:scale-95 transition py-2.5 rounded text-white"
      >
        Add Unit
      </button>
    </div>
  );
};

export default AddEmergencyUnitForm;
