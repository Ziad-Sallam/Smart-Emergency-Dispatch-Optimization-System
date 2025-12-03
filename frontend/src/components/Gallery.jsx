import React from "react";
import police from "../assets/police.jpg";
import ambulance from "../assets/ambulance.jpg";
import firefighter from "../assets/fire1.jpg";

const Gallery = () => {
  return (
    <div className="flex flex-col items-center text-primary px-6 py-15">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <h1 className="text-3xl font-semibold text-center mx-auto">
        Our Emergency Responders
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        Meet the heroes behind our Smart Emergency Dispatch System – ready to
        respond quickly and save lives.
      </p>

      <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-10 mx-auto">
        {/* Police */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src={police}
            alt="police"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Police Officers</h1>
            <p className="text-sm">
              Ensuring public safety and quick response to incidents with
              precision and care.
            </p>
          </div>
        </div>

        {/* Ambulance */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src={ambulance}
            alt="ambulance"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Paramedics</h1>
            <p className="text-sm">
              Providing life-saving medical assistance at the scene and during
              transport to hospitals.
            </p>
          </div>
        </div>

        {/* Firefighters */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src={firefighter}
            alt="firefighter"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Firefighters</h1>
            <p className="text-sm">
              Responding swiftly to fires and hazardous situations, protecting
              life and property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
